 
import requests
import json 
from bs4 import BeautifulSoup

import pandas as pd

from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.decomposition import LatentDirichletAllocation

import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

import re
import time
lemmatizer = WordNetLemmatizer()

from getAspect import AspectTermExtractor
from getAspectSentiment import AspectSentimentClassifier

def fetch_steam_tags(app_id):
    # URL for the Steam game page
    url = f"https://store.steampowered.com/app/{app_id}/"
    
    # Fetch the page content
    response = requests.get(url)
    
    if response.status_code != 200:
        print(f"Failed to fetch the page. Status code: {response.status_code}")
        return None
    
    # Parse the HTML with BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find the section containing the tags
    tags_section = soup.find('div', class_='glance_tags popular_tags')
    
    if not tags_section:
        print("Could not find the tags section.")
        return None
    
    # Extract the tags from the section
    tags = [tag.text.strip() for tag in tags_section.find_all('a')]
    
    return tags

def fetch_current_players(app_id):
    url = f"https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid={app_id}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return data['response']['player_count']
    else:
        print("Failed to fetch data.")
        return None

def fetch_game_details(app_id):

    user_review_url = f'https://store.steampowered.com/api/appdetails?appids={app_id}'
    req_app_details = requests.get(
        user_review_url
    )

    if req_app_details.status_code != 200:
        print(f'Fail to get response. Status code: {req_app_details.status_code}')
        return {"success": 2}
    
    try:
        app_details = req_app_details.json()
    except:
        return {"success": 2}
    return app_details

def get_user_reviews(review_appid, params):
    user_review_url = f'https://store.steampowered.com/appreviews/{review_appid}'

    req_user_review = requests.get(
        user_review_url,
        params=params
    )
    if req_user_review.status_code != 200:
        print(f'Fail to get response. Status code: {req_user_review.status_code}')
        return {"success": 2}
    try:
        user_reviews = req_user_review.json()
    except:
        return {"success": 2}
    return user_reviews

def fetch_steam_reviews(review_appid, params):
    selected_reviews = []
    print('fetching reviews time: ', time.ctime())

    while (True):

        reviews_response = get_user_reviews(review_appid, params)
    
    # not success?
        if reviews_response["success"] != 1:
            print("Not a success")
            break
            
        if reviews_response["query_summary"]["num_reviews"] == 0:
            print("no_reviews.")
            break
    
    # extract each review in the response of the API call
        for review in reviews_response["reviews"]:
            # for brevity, the extraction is not included

            selected_reviews.append(review)
            
            # go to next page
            try:
                cursor = reviews_response['cursor']         # cursor field does not exist, or = null in the last page
            except Exception as e:
                cursor = ''
                
            if not cursor:
                print("Reached the end of all comments.")
                break
        
        params["cursor"] = cursor

    print('finished fetching reviews time: ', time.ctime())
    df = pd.DataFrame(data=selected_reviews)

    new_df = df[['recommendationid','review',"voted_up",'timestamp_updated']]

    return new_df

def preprocess_text(text):

    if not isinstance(text, str):
        text =  str(text)
    
    # Remove URLs
    text = re.sub(r'http\S+|www\S+', '', text)
    
    # Normalize Whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Remove non-ASCII characters
    text = text.encode('ascii', 'ignore').decode('ascii')

    text = re.sub(r'\d+', '', str(text).lower())  # Remove numbers
    tokens = word_tokenize(text)
    return ' '.join([lemmatizer.lemmatize(token) for token in tokens])

def generate_word_cloud(data, n=40):
    print('WC start time: ', time.ctime())
    vectorizer = TfidfVectorizer(
    ngram_range=(1, 3),
    token_pattern=r'(?u)\b[^\d\W][^\d\W]+\b',  # Excludes tokens with digits# Extract 1-word, 2-word, and 3-word phrases
    stop_words="english",     # Remove common words (the, and, etc.)
    min_df=2,                # Ignore terms appearing in <2 reviews
    max_features=100        # Limit to top 100 terms
    )

    X = vectorizer.fit_transform(data['cleaned_reviews'])

    # Get terms and frequencies
    terms = vectorizer.get_feature_names_out()
    counts = X.sum(axis=0).A1     # Convert to 1D array
    term_counts = dict(zip(terms, counts))
    print('WC finish time: ', time.ctime())
    return sorted(term_counts.items(), key=lambda x: -x[1])[:n]

def get_topics(model, vectorizer, n_words=5):
    print('LDA start time: ', time.ctime())
    topics =[]
    feature_names = vectorizer.get_feature_names_out()
    for topic_idx, topic in enumerate(model.components_):
        top_words = [feature_names[i] for i in topic.argsort()[:-n_words - 1:-1]]
        topics.append(top_words)
    print('LDA finish time: ', time.ctime())
    return topics

def generate_ABSA(data):
    print('ABSA start time: ', time.ctime())

    # Vectorize using CountVectorizer
    vectorizer = CountVectorizer(max_df=0.95, min_df=2, stop_words="english")
    X = vectorizer.fit_transform(data["cleaned_reviews"])

    # Train LDA
    lda = LatentDirichletAllocation(
        n_components=3,  # Number of topics
        random_state=42,
        learning_method="online",  # Faster for small datasets
        max_iter=10
    )
    lda.fit(X)

    topics = get_topics(lda, vectorizer)

    # Predict topic for each review
    topic_distributions = lda.transform(X)
    data["Dominant_Topic"] = topic_distributions.argmax(axis=1)

    # Display reviews with assigned topics
    new_df = data[["review", "Dominant_Topic","sentiment"]]

    topic_ratio =[]

    for topic_id in range(lda.n_components):
        
        true_count = new_df[(new_df['sentiment'] == 1) & (new_df['Dominant_Topic'] == topic_id)].shape[0]
        # Calculate the total number of records where Column B is 1
        total_count = new_df[new_df['Dominant_Topic'] == topic_id].shape[0]
        
        # Calculate the ratio
        if total_count > 0:
            ratio = true_count / total_count * 100
        else:
            ratio = 0

        # get review example
        sample_review = new_df[new_df['Dominant_Topic'] == topic_id]['review'].head(3).values.tolist()

        topic_ratio.append([topics[topic_id],ratio,sample_review])

    print('ABSA finish time: ', time.ctime())

    return topic_ratio


def extractAspects(df):
    model = AspectTermExtractor(model_path=r"C:\Users\winso\FYP\FYP\backend\.venv\models\ATE\allenaitk-instruct-base-def-pos-game_absa")
    df = model.extract(df)
    return df

def classifyAspectSentiment(df):
    model = AspectSentimentClassifier(model_path=r"C:\Users\winso\FYP\FYP\backend\.venv\models\ATSC\allenaitk-instruct-base-def-pos-game_absa")
    df = model.classify(df)
    return df

def get_cumulative_reviews_by_month(df, timestamp_col='timestamp_updated'):
    # Convert UNIX timestamp to datetime
    df['datetime'] = pd.to_datetime(df[timestamp_col], unit='s')

    # Format to 'YYYY-MM'
    df['month'] = df['datetime'].dt.to_period('M').astype(str)

    # Count reviews per month
    monthly_counts = df.groupby('month').size().reset_index(name='count')

    # Sort by month
    monthly_counts = monthly_counts.sort_values(by='month')

    # Compute cumulative sum
    monthly_counts['cumulative'] = monthly_counts['count'].cumsum()

    # Convert to list of dicts for Recharts
    recharts_data = monthly_counts[['month', 'cumulative']].rename(columns={'cumulative': 'count'}).to_dict(orient='records')

    return recharts_data
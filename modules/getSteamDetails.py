import json 
from utils import *


def getSteamReviewSentiment(app_id):

    params = {
        'json':1,
        'language': 'english',
        'cursor': '*',                                  # set the cursor to retrieve reviews from a specific "page"
        'num_per_page': 100,
        'filter': 'recent'
    }

    data = fetch_steam_reviews(app_id, params) # pandas df

    #separate ABSA data for simplicity
    absa_data = data.copy()
    absa_data = absa_data[['recommendationid', 'review','timestamp_updated']]
    absa_data['review'] = data['review'].apply(preprocess_text)
    #Extract Terms in steam review
    absa_data = extractAspects(absa_data)
    absa_data = classifyAspectSentiment(absa_data)
    dates = get_cumulative_reviews_by_month(absa_data)

    # data preprocessing
    data['cleaned_reviews'] = data['review'].apply(preprocess_text)
    data['sentiment'] = data['voted_up'].astype(int)

    word_cloud = generate_word_cloud(data)
    topic = generate_ABSA(data)

    app_details = fetch_game_details(app_id)
    app_details = app_details[str(app_id)]['data']
    tags = fetch_steam_tags(app_id)
    players = fetch_current_players(app_id)

    details = {
        "name": app_details['name'],
        "description": app_details['short_description'],
        "website": app_details['website'],
        "developers": app_details['developers'],
        "publishers": app_details['publishers'],
        "genres": [item['description'] for item in app_details['genres']],
        "release_date": app_details['release_date']['date'],
        "tags": tags,
        "players": players,
        "wordCloud": word_cloud,
        "reviewCount": data.shape[0],
        "absa": topic,
        "pos_reviews_count": data[data['sentiment'] == 1].shape[0],
        "neg_reviews_count": data[data['sentiment'] == 0].shape[0],
        "aspects_with_sentiment": absa_data['aspects_with_sentiment'].tolist(),
        "timestamp_updated": dates
        # "developers": ,
        }

    return json.dumps(details)

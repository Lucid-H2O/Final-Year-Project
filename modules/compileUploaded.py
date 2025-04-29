import json
from utils import *

def getUploadedReviewSentiment(data):

    data['cleaned_reviews'] = data['review'].apply(preprocess_text)

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

    word_cloud = generate_word_cloud(data)
    topic = generate_ABSA(data)

    details = {
        "wordCloud": word_cloud,
        "reviewCount": data.shape[0],
        "absa": topic,
        "pos_reviews_count": data[data['sentiment'] == 1].shape[0],
        "neg_reviews_count": data[data['sentiment'] == 0].shape[0],
        "aspects_with_sentiment": absa_data['aspects_with_sentiment'].tolist(),
        "timestamp_updated": dates
        }

    return json.dumps(details)
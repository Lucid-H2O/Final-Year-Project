# save this as app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
import pandas as pd

# Download NLTK data (first-time only)
nltk.download(['punkt_tab', 'wordnet', 'omw-1.4'])


from modules.getSteamDetails import getSteamReviewSentiment
from modules.getSentiment import getSentimentUploaded
from modules.compileUploaded import getUploadedReviewSentiment

app = Flask(__name__)

CORS(app)

@app.route("/")
def hello():
    return "Hello, World!"

@app.route('/sentiment/<int:app_id>', methods=['GET'])
def getSentiment(app_id):
    return getSteamReviewSentiment(app_id)


@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    data = pd.read_csv(file)
    data = getSentimentUploaded(data)
    return getUploadedReviewSentiment(data)

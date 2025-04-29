# Import necessary libraries
import pandas as pd
from torch import nn
import torch
from transformers import BertModel, BertTokenizer

import warnings
warnings.filterwarnings("ignore", category=FutureWarning)

# Sentiment Classifier class 
class SentimentClassifier(nn.Module):
    
    # Constructor class 
    def __init__(self, n_classes):
        super(SentimentClassifier, self).__init__()
        self.bert = BertModel.from_pretrained(MODEL_NAME)
        self.drop = nn.Dropout(p=0.3)
        self.out = nn.Linear(self.bert.config.hidden_size, n_classes)
    
    # Forward propagaion class
    def forward(self, input_ids, attention_mask):
        bert_output = self.bert(
          input_ids=input_ids,
          attention_mask=attention_mask
        )
        pooled_output = bert_output.pooler_output # Accessing the pooled output
        #  Add a dropout layer
        output = self.drop(pooled_output)
        return self.out(output)

def predict_sentiment(input):
    review_text = str(input)
    encoded_review = tokenizer.encode_plus(
    review_text,
    max_length=160,
    add_special_tokens=True,
    return_token_type_ids=False,
    pad_to_max_length=True,
    return_attention_mask=True,
    return_tensors='pt',
    )

    input_ids = encoded_review['input_ids'].to(device)
    attention_mask = encoded_review['attention_mask'].to(device)
    
    output = model(input_ids, attention_mask)
    _, prediction = torch.max(output, dim=1)
    
    return prediction.cpu().numpy()

MODEL_NAME = 'bert-base-cased'
model = SentimentClassifier(2)

# BERT based tokenizer
tokenizer = BertTokenizer.from_pretrained(MODEL_NAME)

# Load the saved state_dict
model.load_state_dict(torch.load('model.bin', weights_only=True))
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = model.to(device)

def getSentimentUploaded(data): 
    new_data = data.drop_duplicates(subset=['review'])
    new_data = new_data[['recommendationid', 'review', 'timestamp_updated']]
    new_data['sentiment'] = new_data['review'].apply(predict_sentiment)

    return new_data
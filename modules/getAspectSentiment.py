import torch
import time
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import pandas as pd

class AspectSentimentClassifier:
    def __init__(self, model_path, batch_size=8, device=None):
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_path)
        self.device = device or torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = self.model.to(self.device)
        self.batch_size = batch_size

        # Instructions
        self.bos_instruction = """Definition: The output will be 'positive' if the aspect identified in the sentence contains a positive sentiment. If the sentiment of the identified aspect in the input is negative the answer will be 'negative'.  
        Otherwise, the output should be 'neutral'. For aspects which are classified as noaspectterm, the sentiment is none.  
        Positive example 1-  
        input: The soundtrack is absolutely phenomenal and adds so much to the atmosphere. The aspect is soundtrack.  
        output: positive  
        Positive example 2-  
        input: I loved the smooth combat mechanics and fluid animations. The aspect is combat mechanics.  
        output: positive  
        Now complete the following example-  
        input:"""
        self.delim_instruction = " The aspect is "
        self.eos_instruction = ".\noutput:"

    def classify(self, df, text_column='review', aspect_column='aspect_terms', id_column='recommendationid', timestamp_column='timestamp_updated'):
        """
        Perform ATSC on dataframe with extracted aspect terms.
        Args:
            df (pd.DataFrame): DataFrame with review and extracted aspect terms.
        Returns:
            pd.DataFrame: Result with aspect-level sentiment classification.
        """
        start_time = time.time()
        df = df.copy()

        # Preprocess: explode aspect terms
        df[aspect_column] = df[aspect_column].apply(lambda x: [term.strip() for term in x.split(',') if term.strip()])
        df_expanded = df.explode(aspect_column).reset_index(drop=True)
        df_expanded.rename(columns={aspect_column: 'aspect_term'}, inplace=True)

        # Construct prompt
        df_expanded['prompt'] = self.bos_instruction + df_expanded[text_column] + self.delim_instruction + df_expanded['aspect_term'] + self.eos_instruction

        # Batch inference
        sentiments = []
        for i in range(0, len(df_expanded), self.batch_size):
            batch = df_expanded.iloc[i:i + self.batch_size]
            inputs = self.tokenizer(list(batch['prompt']), return_tensors="pt", padding=True, truncation=True).to(self.device)

            outputs = self.model.generate(
                input_ids=inputs['input_ids'],
                attention_mask=inputs['attention_mask'],
                max_length=20
            )
            decoded = [self.tokenizer.decode(out, skip_special_tokens=True).split('output:')[-1].strip() for out in outputs]
            sentiments.extend(decoded)

        df_expanded['sentiment'] = sentiments

        # Regroup to list of aspects with sentiment
        result_df = df_expanded.groupby(id_column).apply(
            lambda x: {
                text_column: x.iloc[0][text_column],
                timestamp_column: x.iloc[0][timestamp_column],
                'aspects_with_sentiment': [{'term': row['aspect_term'], 'sentiment': row['sentiment']} for _, row in x.iterrows()]
            }
        ).apply(pd.Series).reset_index()

        # Rearrange columns
        result_df = result_df[[id_column, text_column, timestamp_column, 'aspects_with_sentiment']]

        print(f"\n✅ ATSC completed in {time.time() - start_time:.2f} seconds for {len(df_expanded)} aspect terms")
        return result_df

import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import time

class AspectTermExtractor:
    def __init__(self, model_path, batch_size=8, device=None):
        self.tokenizer = AutoTokenizer.from_pretrained(model_path)
        self.model = AutoModelForSeq2SeqLM.from_pretrained(model_path)

        self.device = device or torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = self.model.to(self.device)
        self.batch_size = batch_size

        self.bos_instruction = """Definition: The output will be the aspects (both implicit and explicit) which have an associated opinion that are extracted from the input game review. In cases where there are no aspects, the output should be noaspectterm.
        Positive example 1-
        input: The storyline was so immersive, I couldn't stop playing for hours.
        output: storyline
        Positive example 2-
        input: I love the graphics and the soundtrack, but the controls felt a bit clunky.
        output: graphics, soundtrack, controls
        Positive example 3-
        input: It’s fun at first, but the lack of content becomes obvious after a few hours.
        output: content
        Now complete the following example-
        input: """
        self.delim_instruction = ''
        self.eos_instruction = ' \noutput:'

    def extract(self, df, text_column='review'):
        """
        Perform aspect term extraction on a dataframe.
        Args:
            df (pd.DataFrame): Input dataframe with a text column.
            text_column (str): Column name containing text (reviews).
        Returns:
            pd.DataFrame: Updated dataframe with a new 'aspect_terms' column.
        """
        results = []
        start_time = time.time()

        for i in range(0, len(df), self.batch_size):
            batch = df.iloc[i:i + self.batch_size]
            prompts = [
                self.bos_instruction + text + self.delim_instruction + self.eos_instruction
                for text in batch[text_column]
            ]
            tokenized = self.tokenizer(prompts, return_tensors="pt", padding=True, truncation=True).to(self.device)

            outputs = self.model.generate(
                input_ids=tokenized['input_ids'],
                attention_mask=tokenized['attention_mask'],
                max_length=128
            )

            decoded = [
                self.tokenizer.decode(output, skip_special_tokens=True).split('output:')[-1].strip()
                for output in outputs
            ]
            results.extend(decoded)

        df = df.copy()
        df['aspect_terms'] = results

        print(f"✅ ATE completed in {time.time() - start_time:.2f} seconds for {len(df)} samples")
        return df
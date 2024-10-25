from transformers import T5ForConditionalGeneration, T5Tokenizer
import sys
import json

model = T5ForConditionalGeneration.from_pretrained("t5-small")
tokenizer = T5Tokenizer.from_pretrained("t5-small")

def generate_question(resume_text):
    input_text = f"generate question: {resume_text}"
    input_ids = tokenizer.encode(input_text, return_tensors="pt")

    
    outputs = model.generate(input_ids, max_length=50, num_beams=5, early_stopping=True)
    question = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return question

# Accept input from Node.js
if __name__ == "__main__":
    resume_text = sys.argv[1]
    question = generate_question(resume_text)
    print(json.dumps({"question": question}))

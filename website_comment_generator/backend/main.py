import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch


class GenerationParameters(BaseModel):
    temperature: float
    no_repeat_ngram_size: int
    num_return_sequences: int
    top_p: float
    top_k: int
class CommentGeneration(BaseModel):
    post_text: str
    position: int
    post_reactions: dict
    desired_reactions: dict
class GenerationRequest(BaseModel):
    generation_params: GenerationParameters
    comment_data: CommentGeneration


app = FastAPI()
origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model_name = '/app/model/models--mccarryster--com-gen-llama3.2-1B/snapshots/480e552123b9434eb1885eb5c47a22636fda6053'
model = AutoModelForCausalLM.from_pretrained(model_name, device_map="cpu")
tokenizer = AutoTokenizer.from_pretrained(model_name)

@app.post("/generate")
def generate_comment(request: GenerationRequest):
    request_dict = request.model_dump()  # Convert Pydantic model to dict

    reactions = ", ".join([f"{k}:{v}" for k, v in request_dict['comment_data']['post_reactions'].items()])
    desired_reactions = ", ".join([f"{k}:{v}" for k, v in request_dict['comment_data']['desired_reactions'].items()]) or "None"
    prompt = f"""
    You are a social media assistant. Generate a comment. Consider the Reaction of users and the tone of the Post.<|eot_id|>
    <|start_header_id|>user<|end_header_id|>
    Post: {request_dict['comment_data']['post_text']}
    Reactions: {reactions}
    Position: {request_dict['comment_data']['position']}
    Desired reactions: {desired_reactions}<|eot_id|>
    <|start_header_id|>assistant<|end_header_id|>
    """
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    with torch.no_grad():
        outputs = model.generate(
            input_ids=inputs.input_ids,
            attention_mask=inputs.attention_mask,
            pad_token_id=tokenizer.eos_token_id,
            max_new_tokens=200,
            temperature=request_dict['generation_params']['temperature'],
            repetition_penalty=1.2,
            no_repeat_ngram_size=request_dict['generation_params']['no_repeat_ngram_size'],
            length_penalty=1.0,
            do_sample=True,
            top_k=request_dict['generation_params']['top_k'],
            top_p=request_dict['generation_params']['top_p'],
            num_return_sequences=request_dict['generation_params']['num_return_sequences']
        )
    return {
        "output": [tokenizer.decode(output[inputs.input_ids.shape[1]:], skip_special_tokens=True) for output in outputs]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
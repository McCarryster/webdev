# Use an official PyTorch image with CUDA 11.8 support
FROM pytorch/pytorch:2.5.1-cuda11.8-cudnn9-runtime

# Set working directory inside the container
WORKDIR /app

# Copy requirements.txt
COPY requirements.txt .

# Install dependencies
RUN pip install --verbose -r requirements.txt

# Ensure torchvision is installed with CUDA support
RUN pip install torchvision --extra-index-url https://download.pytorch.org/whl/cu118

# Install transformers library
RUN pip install transformers --upgrade

# Copy application code
COPY main.py .

# Copy the model
COPY models/fine_tuned_vikhr_llama3.2_1B/ ./model/

# Expose port 8000 for FastAPI
EXPOSE 8000

# Run the FastAPI app with Uvicorn on all interfaces
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
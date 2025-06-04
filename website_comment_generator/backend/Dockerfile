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

# Set up a new user named "user"
RUN useradd -m -u 1000 user
# Switch to the "user" user
USER user
# Set home to the user's home directory
ENV HOME=/home/user PATH=/home/user/.local/bin:$PATH

# Set the working directory to the      user's home directory
WORKDIR $HOME/app

# Copy application code and the model
COPY --chown=user main.py $HOME/app
# COPY --chown=user fine_tuned_vikhr_llama3.2_1B/ $HOME/app/model/

# Expose port
EXPOSE 7860

# Run the FastAPI app with Uvicorn on all interfaces
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
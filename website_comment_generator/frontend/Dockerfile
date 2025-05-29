# Use official Node.js LTS Alpine image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files to container
COPY . .

# Expose React default port
EXPOSE 3000

# Start React app in development mode
CMD ["npm", "start"]

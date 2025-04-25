# Use Node.js LTS base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Copy wait-for-it.sh into the container and make it executable
COPY scripts/wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh

# Expose backend port
EXPOSE 5000

# Use wait-for-it.sh to wait for MySQL before starting the backend
CMD ["sh", "-c", "./wait-for-it.sh mysql:3306 -- npm start"]
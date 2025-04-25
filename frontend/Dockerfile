# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy frontend source
COPY . .

# Expose frontend port
EXPOSE 3000

# Start the frontend dev server
CMD ["npm", "start"]
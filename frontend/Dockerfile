# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the React app
RUN npm run build

# Use a simple web server (optional, or just expose for dev)
RUN npm install -g serve
EXPOSE 3000
CMD ["serve", "-s", "build"]
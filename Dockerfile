FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application files
COPY . .

# Build the application (Vite + Esbuild server)
RUN npm run build

# Expose the standard port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]

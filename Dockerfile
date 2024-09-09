FROM node:18

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 3001


# Start the app
CMD ["npm", "start"]

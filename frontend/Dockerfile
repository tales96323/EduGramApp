FROM node:18-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Install global expo-cli to ensure we can run expo commands if needed, 
# though npm start usually suffices.
RUN npm install -g expo-cli

# Expo default ports
EXPOSE 19000
EXPOSE 19001
EXPOSE 19002
EXPOSE 19006
EXPOSE 8081

CMD ["npm", "start"]

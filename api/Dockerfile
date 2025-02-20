FROM node:18-alpine

# DIRECTORY APP
WORKDIR /app

# COPIER FICHIER PROJET
COPY package*.json ./
RUN npm i --only=production

# COPIER FICHIER PROJET
COPY . .

# EXPOSER PORT
EXPOSE 3000

# EXECUTER LE SERVEUR
CMD [ "node", "server.js" ]
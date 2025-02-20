FROM node:18-alpine

# DIRECTORY APP
WORKDIR /app

# COPIER FICHIER PROJET
COPY package*.json ./
RUN npm i --only=production

# COPIER FICHIER PROJET
COPY . .

# EXPOSER PORT
EXPOSE 3001

# EXECUTER LE SERVEUR
CMD [ "npm", "run", "start" ]
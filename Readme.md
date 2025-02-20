# Biblibilibiblio'otake

## Récupèrer le projet 
```bash
git clone https://github.com/PaulDelamare/delamare-paul-docker.git
```

Suite à ça rentrer dans le dossier avec : 
```bash
cd delamare-paul-docker.git
```

Vous aurez ensuite 3 dossier :

##  db-init

On y retrouve le dossier init.sql qui sert à créer les tables de base de la base de données.
Dans notre cas on y retrouve une table :
- Books avec name et author.
- Genres avec les genres des films
- books_genres qui est une table intermédiaire

## api

Qui est l'api qui sert à mettre en liaison la base de données avec le front.
Voici l'architecture : 

### 📂 Structure du projet

```
📦 Racine du projet
├── 📁 config
├── 📁 node_modules
├── 📁 src
│   ├── 📁 Controller
│   │   ├── 📄 books.controller.js
│   │   ├── 📄 genre.controller.js
│   ├── 📁 Middlewares
│   ├── 📁 Routes
│   │   ├── 📄 books.routes.js
│   │   ├── 📄 genre.routes.js
│   ├── 📄 server.js
├── 📄 Dockerfile
├── 📄 package-lock.json
├── 📄 package.json
```

### 📜 Description des dossiers et fichiers

- **`config/`** : Contient les fichiers de configuration de l'application.
- **`node_modules/`** : Contient les dépendances installées via npm.
- **`src/`** : Contient le cœur de l'application.
  - **`Controller/`** : Gère la logique métier des différentes entités.
    - `books.controller.js` : Contrôleur des livres.
    - `genre.controller.js` : Contrôleur des genres.
  - **`Middlewares/`** : Contient les middlewares (authentification, validation, etc.).
  - **`Routes/`** : Définit les routes de l'API.
    - `books.routes.js` : Routes pour la gestion des livres.
    - `genre.routes.js` : Routes pour la gestion des genres.
  - **`server.js`** : Point d'entrée principal de l'API.
- **`Dockerfile`** : Fichier pour la conteneurisation avec Docker.
- **`package-lock.json`** : Verrouille les versions des dépendances.
- **`package.json`** : Fichier de configuration des dépendances et scripts npm.

## FrontEnd
Il contient le site internet
```
📦 Racine du projet
├── 📄 Dockerfile
├── 📄 index.html
├── 📄 nginx.conf
├── 📄 script.js
├── 📄 style.css
```

## Docker 

## 🏗️ Fonctionnement avec Docker Compose

L'application repose sur une architecture composée de deux services :

- **`db`** : Base de données MySQL.
- **`frontend`** : Interface utilisateur.

### 🔒 Sécurité & Réseaux

- La base de données **n'est accessible que par l'API** via un réseau interne `backend_network`.
- Seul le frontend est accessible depuis l'extérieur via `http://localhost:8889/`.

### 🚀 Lancement avec Docker Compose

1. Lancer l'application avec :
   ```sh
   docker-compose up -d
   ```
   - `-d` permet de lancer en mode détaché.

2. Accéder à l'application :
   - Interface frontend : [http://localhost:8889/](http://localhost:8889/)

### 🛠️ Explication du `docker-compose.yml`

```yaml
version: '3'

networks:
  backend_network:
    internal: true
  frontend_network:
    driver: bridge

services:
  db:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: mybooksdb
    volumes:
      - db_data:/var/lib/mysql
      - ./db-init/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - backend_network
    healthcheck:
      test: [ "CMD", "mysqladmin", "ping", "-h", "localhost" ]
      interval: 5s
      timeout: 20s
      retries: 10

  frontend:
    build: ./frontend
    ports:
      - "8889:80"
    networks:
      - frontend_network

volumes:
  db_data:
```

Ce fichier définit l'architecture réseau et l'ordre de démarrage des services. La base de données est protégée par un réseau interne et seul le frontend est exposé publiquement.

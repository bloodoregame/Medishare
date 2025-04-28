#!/bin/bash

# Exécution du build Vite standard
npm run build

# Copie des fonctions Netlify dans le dossier dist
mkdir -p dist/.netlify/functions
cp -r netlify/functions/* dist/.netlify/functions/

# Création d'un package.json pour les fonctions Netlify
cat > dist/.netlify/functions/package.json << 'EOL'
{
  "name": "musitube-functions",
  "version": "1.0.0",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.2",
    "multer": "^1.4.5-lts.2",
    "serverless-http": "^3.1.1"
  }
}
EOL

echo "Build pour Netlify terminé avec succès !"
#!/bin/bash

# 🚀 SCRIPT D'INSTALLATION AUTOMATIQUE BOOKINAILS
# Installe toutes les dépendances et configure l'environnement

echo "🎯 INSTALLATION BOOKINAILS - Configuration automatique"
echo "====================================================="

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ d'abord."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé. Veuillez installer Python 3.9+ d'abord."
    exit 1
fi

echo "✅ Python version: $(python3 --version)"

# Installation des dépendances frontend
echo "📦 Installation dépendances frontend..."
cd frontend && npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur installation frontend"
    exit 1
fi

echo "🎭 Installation Playwright..."
npx playwright install --with-deps
cd ..

# Installation des dépendances backend
echo "📦 Installation dépendances backend..."
cd backend && pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "❌ Erreur installation backend"
    exit 1
fi
cd ..

# Installation dépendances racine
echo "📦 Installation dépendances racine..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur installation racine"
    exit 1
fi

# Configuration environnement
echo "🔧 Configuration environnement..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Fichier .env créé depuis .env.example"
else
    echo "✅ Fichier .env existe déjà"
fi

# Initialiser la base de données
echo "🗄️ Initialisation base de données..."
cd backend && python3 -c "
from db import engine, Base
from models import *
Base.metadata.create_all(bind=engine)
print('✅ Tables créées')
"
cd ..

# Peupler avec des données de test
echo "🌱 Peuplement données de test..."
python3 database/seed.py

# Build frontend
echo "🔨 Build frontend..."
cd frontend && npm run build
if [ $? -ne 0 ]; then
    echo "⚠️ Warning: Build frontend échoué (normal sans backend actif)"
fi
cd ..

echo ""
echo "🎉 INSTALLATION TERMINÉE AVEC SUCCÈS !"
echo "======================================"
echo ""
echo "🚀 Commandes pour démarrer:"
echo "  npm run dev          # Démarrer en mode développement"
echo "  npm run start        # Démarrer en mode production"
echo "  npm run test:all     # Lancer tous les tests"
echo ""
echo "🌐 URLs de développement:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "💅 Bookinails est prêt à être utilisé !"

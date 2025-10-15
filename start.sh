#!/bin/bash

echo "🚀 Démarrage de Bookinails..."
echo "=================================="

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    echo "📥 https://docs.docker.com/get-docker/"
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Créer le fichier .env s'il n'existe pas
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env
    echo "✅ Fichier .env créé. Vous pouvez le modifier avec vos propres clés."
fi

# Démarrer les services
echo "🐳 Démarrage des conteneurs Docker..."
docker compose up --build -d

echo ""
echo "⏳ Attente du démarrage des services..."
sleep 10

# Vérifier que les services sont démarrés
echo "🔍 Vérification des services..."

# Backend
backend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health || echo "000")
if [ "$backend_status" = "200" ]; then
    echo "✅ Backend API: http://localhost:8000"
else
    echo "⚠️  Backend API: En cours de démarrage..."
fi

# Frontend
frontend_status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
if [ "$frontend_status" = "200" ]; then
    echo "✅ Frontend: http://localhost:3000"
else
    echo "⚠️  Frontend: En cours de démarrage..."
fi

# Database
if docker-compose ps | grep -q "bookinails_db.*running"; then
    echo "✅ Base de données: PostgreSQL"
else
    echo "⚠️  Base de données: En cours de démarrage..."
fi

echo ""
echo "🎉 Bookinails est en cours de démarrage !"
echo "=================================="
echo "📱 Frontend: http://localhost:3000"
echo "🔧 API Backend: http://localhost:8000"
echo "📚 Documentation API: http://localhost:8000/docs"
echo "🗄️  Base de données: PostgreSQL sur le port 5432"
echo ""
echo "⏱️  Si les services ne répondent pas immédiatement,"
echo "    attendez quelques secondes le temps du démarrage complet."
echo ""
echo "🛠️  Pour arrêter: docker compose down"
echo "📋 Pour voir les logs: docker compose logs -f"
echo ""
echo "🎯 Prêt à réserver des manucures ! 💅"

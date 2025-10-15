# 💅 Bookinails - Réservez votre manucure comme sur Booking.com

![Bookinails Logo](https://img.shields.io/badge/Bookinails-💅-pink?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**Bookinails** est une plateforme web moderne qui permet de **trouver et réserver des prestations d'ongles** en ligne, sur le modèle de Booking.com mais spécialisée dans la beauté des ongles.

## 🚀 Fonctionnalités principales

### Pour les clients
- 🔍 **Recherche intuitive** par ville et type de prestation
- 📱 **Interface responsive** optimisée mobile/desktop
- 🗓️ **Réservation en temps réel** avec calendrier interactif
- 💳 **Paiement sécurisé** via Stripe
- ⭐ **Système d'avis** pour choisir en confiance
- 📧 **Confirmations automatiques** par email

### Pour les professionnels
- 🏪 **Profil salon** avec photos et descriptions
- 📊 **Gestion des créneaux** et disponibilités
- 💰 **Suivi des réservations** et paiements
- 📈 **Analytics** simples des performances

## 🛠️ Stack technique

### Frontend
- **Next.js 15** - Framework React moderne
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles modernes et responsifs
- **Lucide React** - Icônes élégantes
- **React Hot Toast** - Notifications utilisateur

### Backend
- **FastAPI** - API REST haute performance
- **SQLAlchemy** - ORM Python moderne
- **PostgreSQL** - Base de données relationnelle
- **Pydantic** - Validation des données
- **JWT** - Authentification sécurisée

### DevOps & Déploiement
- **Docker** - Containerisation
- **Docker Compose** - Orchestration locale
- **Stripe** - Paiements sécurisés
- **Vercel** - Déploiement frontend
- **Render** - Déploiement backend

## 📁 Structure du projet

```
bookinails/
├── 📁 frontend/              # Application Next.js
│   ├── 📁 pages/             # Pages de l'application
│   │   ├── index.tsx         # Page d'accueil
│   │   ├── salon/[id].tsx    # Fiche salon
│   │   └── reservation.tsx   # Processus de réservation
│   ├── 📁 components/        # Composants réutilisables
│   │   ├── SearchBar.tsx     # Barre de recherche
│   │   ├── SalonCard.tsx     # Carte salon
│   │   └── Calendar.tsx      # Calendrier de réservation
│   └── 📁 styles/            # Styles Tailwind
│
├── 📁 backend/               # API FastAPI
│   ├── main.py               # Point d'entrée de l'API
│   ├── models.py             # Modèles de données
│   ├── db.py                 # Configuration base de données
│   └── 📁 routers/           # Routes API
│       ├── salons.py         # API des salons
│       ├── reservations.py   # API des réservations
│       └── auth.py           # API d'authentification
│
├── 📁 database/              # Scripts base de données
│   └── seed.py               # Données de test
│
├── docker-compose.yml        # Configuration Docker
├── .env.example              # Variables d'environnement
└── README.md                 # Cette documentation
```

## 🚀 Installation et lancement

### Prérequis
- **Node.js** 18+ 
- **Python** 3.11+
- **Docker** & **Docker Compose**
- **PostgreSQL** (ou via Docker)

### 1. Cloner le repository
```bash
git clone https://github.com/votre-username/bookinails.git
cd bookinails
```

### 2. Configuration de l'environnement
```bash
# Copier le fichier d'environnement
cp .env.example .env

# Éditer les variables d'environnement
nano .env
```

### 3. Lancement avec Docker (Recommandé)
```bash
# Lancer tous les services
docker-compose up --build

# En arrière-plan
docker-compose up -d --build
```

**🎉 L'application sera accessible sur :**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Documentation API**: http://localhost:8000/docs

### 4. Lancement en mode développement

#### Backend
```bash
cd backend

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
cd frontend

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

### 5. Peupler la base de données
```bash
# Avec Docker
docker-compose exec backend python /app/../database/seed.py

# En local
cd database
python seed.py
```

## 🔑 Configuration des services externes

### Stripe (Paiements)
1. Créer un compte sur [stripe.com](https://stripe.com)
2. Récupérer les clés API test
3. Mettre à jour `.env`:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### SendGrid (Emails)
1. Créer un compte sur [sendgrid.com](https://sendgrid.com)
2. Générer une clé API
3. Mettre à jour `.env`:
```env
SENDGRID_API_KEY=SG...
FROM_EMAIL=noreply@bookinails.fr
```

## 📖 API Documentation

L'API FastAPI génère automatiquement une documentation interactive :
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Endpoints principaux

#### Salons
- `GET /api/salons` - Liste des salons
- `GET /api/salons/{id}` - Détails d'un salon
- `GET /api/salons/{id}/availability` - Créneaux disponibles

#### Réservations
- `POST /api/reservations` - Créer une réservation
- `GET /api/reservations` - Mes réservations
- `PATCH /api/reservations/{id}/cancel` - Annuler une réservation

#### Authentification
- `POST /api/auth/register` - S'inscrire
- `POST /api/auth/login` - Se connecter
- `GET /api/auth/me` - Profil utilisateur

## 🎯 Roadmap MVP

### ✅ Version 1.0 (Actuelle)
- [x] Interface de recherche de salons
- [x] Fiche détaillée des salons
- [x] Système de réservation
- [x] Paiement Stripe basique
- [x] Authentification simple

### 🚧 Version 1.1 (À venir)
- [ ] Dashboard professionnel complet
- [ ] Système d'avis clients
- [ ] Notifications push
- [ ] Export des réservations PDF
- [ ] Analytics avancés

### 🔮 Version 2.0 (Futur)
- [ ] Application mobile (React Native)
- [ ] IA de recommandation
- [ ] Programme de fidélité
- [ ] API publique pour partenaires

## 🧪 Tests

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

## 🚀 Déploiement

### Frontend (Vercel)
```bash
# Connecter à Vercel
npx vercel

# Déploiement automatique via Git
git push origin main
```

### Backend (Render)
1. Connecter le repository à Render
2. Configurer les variables d'environnement
3. Déploiement automatique via Git

## 🤝 Contribution

1. **Fork** le projet
2. Créer une **branche feature** (`git checkout -b feature/amazing-feature`)
3. **Commit** vos changements (`git commit -m 'Add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une **Pull Request**

## 📝 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

- 📧 **Email**: contact@bookinails.fr
- 🐛 **Issues**: [GitHub Issues](https://github.com/votre-username/bookinails/issues)
- 💬 **Discord**: [Serveur communauté](https://discord.gg/bookinails)

---

**Fait avec 💖 par l'équipe Bookinails**

*Révolutionnons ensemble l'industrie de la beauté des ongles !* ✨

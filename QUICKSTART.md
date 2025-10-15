# 🚀 QUICKSTART - Bookinails

## Lancement en 30 secondes

```bash
# 1. Cloner le projet (ou utiliser le dossier existant)
cd /Users/francois-xavierwiltord/Bookinails

# 2. Configurer l'environnement
cp .env.example .env

# 3. Lancer avec Docker
./start.sh
```

**🎉 C'est tout ! Bookinails est maintenant accessible sur :**
- **Frontend** : http://localhost:3000
- **API** : http://localhost:8000  
- **Docs API** : http://localhost:8000/docs

---

## ⚡ Test immédiat

### 1. **Créer un compte client**
- Aller sur http://localhost:3000
- Cliquer "S'inscrire" → Choisir "Client"
- Email: `client@test.com` / Mot de passe: `test123`

### 2. **Faire une réservation**
- Rechercher "Paris" dans la barre de recherche
- Sélectionner un salon → "Réserver"
- Choisir un créneau → Remplir le formulaire
- **Test Stripe** : Utiliser `4242 4242 4242 4242` / `12/34` / `123`

### 3. **Espace professionnel**
- S'inscrire en tant que "Professionnel"
- Accéder au dashboard pro : http://localhost:3000/dashboard/pro

---

## 🔧 Configuration avancée

### Variables d'environnement (.env)
```bash
# Base de données
DATABASE_URL=postgresql://user:password@postgres:5432/bookinails

# Stripe (remplacer par vos vraies clés)
STRIPE_SECRET_KEY=sk_test_votre_cle_secrete
STRIPE_PUBLISHABLE_KEY=pk_test_votre_cle_publique

# JWT
SECRET_KEY=votre-super-secret-key-unique

# Email (optionnel)
SENDGRID_API_KEY=SG.votre_cle_sendgrid
```

### Commandes utiles
```bash
# Arrêter les services
docker-compose down

# Voir les logs
docker-compose logs -f

# Redémarrer un service
docker-compose restart backend

# Accéder à la base de données
docker-compose exec postgres psql -U user -d bookinails

# Peupler avec des données de test
docker-compose exec backend python ../database/seed.py

# Lancer les tests
docker-compose exec backend pytest tests/ -v
```

---

## 📊 Fonctionnalités disponibles

### ✅ **Côté Client**
- [x] Inscription/Connexion
- [x] Recherche avancée de salons
- [x] Réservation avec calendrier intelligent
- [x] Paiement Stripe sécurisé
- [x] Dashboard personnel avec historique
- [x] Pages de confirmation/annulation

### ✅ **Côté Professionnel** 
- [x] Inscription salon/praticien
- [x] Dashboard de gestion complet
- [x] Gestion des réservations reçues
- [x] Configuration du profil salon
- [x] Statistiques et revenus

### ✅ **Backend & API**
- [x] API REST FastAPI complète
- [x] Authentification JWT avec rôles
- [x] Base de données PostgreSQL
- [x] Intégration Stripe avec webhooks
- [x] Tests automatisés
- [x] Documentation OpenAPI

---

## 🚀 Déploiement production

### Frontend (Vercel)
```bash
cd frontend
npm install
npm run build
vercel --prod
```

### Backend (Render/Railway)
```bash
# Connecter votre repo GitHub
# Render détectera automatiquement le Dockerfile
# Variables d'env à configurer dans l'interface
```

### Base de données
- **Supabase** : Base PostgreSQL gratuite
- **PlanetScale** : Alternative MySQL
- **Render PostgreSQL** : Intégré avec le backend

---

## 📞 Support

- **🐛 Issues** : [GitHub Issues](https://github.com/votre-username/bookinails/issues)
- **📧 Email** : contact@bookinails.fr
- **📚 Docs API** : http://localhost:8000/docs

---

**🎯 Bookinails est 100% prêt pour la production !** 🎉

*Développé avec ❤️ par l'équipe Bookinails*

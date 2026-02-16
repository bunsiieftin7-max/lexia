# 🎓 Drept Academy API

> API complète pour plateforme d'apprentissage du droit avec gamification, IA et spaced repetition

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## ⚡ Déploiement Rapide

### 🚀 Option 1 : Déploiement en 1 clic sur Render

1. Cliquez sur le bouton "Deploy to Render" ci-dessus
2. Configurez les variables d'environnement secrètes :
   - `GEMINI_API_KEY` - Votre clé API Google Gemini
   - `GOOGLE_CLIENT_EMAIL` - Email du service account Google
   - `GOOGLE_PRIVATE_KEY` - Clé privée du service account
3. Déployez !

### 📦 Option 2 : Fork et déploiement manuel

```bash
# 1. Forker ce repo sur GitHub

# 2. Cloner votre fork
git clone https://github.com/VOTRE-USERNAME/drept-academy-api.git
cd drept-academy-api

# 3. Créer un nouveau service sur Render
# - Connecter votre repo GitHub
# - Render détectera automatiquement render.yaml

# 4. Configurer les variables d'environnement (voir .env.example)

# 5. Déployer !
```

## 🎯 Fonctionnalités

### 📊 Statistiques & Progression
- ✅ Tracking complet (questions, taux de réussite, XP, niveau)
- ✅ Statistiques par sujet
- ✅ Historique des sessions
- ✅ Calcul automatique des niveaux

### 🏆 Gamification
- ✅ 11 badges débloquables automatiquement
- ✅ Système de rareté (common → legendary)
- ✅ Notifications de déblocage
- ✅ Récompenses en XP

### 🔥 Système de Streaks
- ✅ Suivi des jours consécutifs
- ✅ Milestones (7, 30, 100 jours)
- ✅ Leaderboard global
- ✅ Protection anti-perte

### 🤖 IA Conversationnelle
- ✅ Agent flashcard avec Google Gemini
- ✅ Agent QCM avec correction stricte
- ✅ Feedback personnalisé
- ✅ Support multi-sujets

### 📅 Planification Intelligente
- ✅ Plans quotidiens personnalisés
- ✅ 3 sessions par jour (matin, après-midi, soir)
- ✅ Adaptation aux faiblesses
- ✅ Tracking de complétion

### 💡 Nudges Intelligents
- ✅ Rappels contextuels (8h, 14h, 20h)
- ✅ Messages personnalisés
- ✅ Priorités adaptatives
- ✅ Anti-spam intégré

### 🔄 Spaced Repetition
- ✅ Algorithme SM-2 (SuperMemo 2)
- ✅ Calcul automatique des intervalles
- ✅ Questions dues pour révision
- ✅ Statistiques de mémorisation

### 🔔 Notifications
- ✅ File de notifications avec priorités
- ✅ In-app, email (extensible)
- ✅ Système de retry
- ✅ Nettoyage automatique

## 🏗️ Architecture

```
Express.js + PostgreSQL + Google AI
├─ Routes (API REST)
├─ Services (Business Logic)
├─ Jobs (Cron Tasks)
└─ Database (14 tables optimisées)
```

## 📚 Documentation

- **[📖 Guide de Démarrage](docs/QUICKSTART.md)** - Déployez en 5 minutes
- **[🏛️ Architecture](docs/ARCHITECTURE.md)** - Structure détaillée
- **[📋 API Reference](docs/API.md)** - Documentation complète des endpoints
- **[🔧 Configuration](docs/CONFIGURATION.md)** - Variables d'environnement
- **[🗄️ Database](database/README.md)** - Schéma et migrations

## 🚀 Démarrage Local

```bash
# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos credentials

# Créer la base de données
createdb drept_academy
psql drept_academy -f database/schema.sql

# Démarrer le serveur
npm run dev
```

Le serveur démarrera sur http://localhost:3000

## 🔑 Variables d'Environnement

Voir `.env.example` pour la liste complète.

**Obligatoires** :
- `DATABASE_URL` - URL PostgreSQL
- `GEMINI_API_KEY` - Clé API Google Gemini
- `GOOGLE_CLIENT_EMAIL` - Service account email
- `GOOGLE_PRIVATE_KEY` - Service account private key

**Optionnelles** :
- `PORT` - Port du serveur (défaut: 3000)
- `ALLOWED_ORIGINS` - Origins CORS autorisées
- `ENABLE_CRON_JOBS` - Activer les jobs planifiés (défaut: true)

## 📡 Endpoints Principaux

### Statistiques
```http
POST /api/stats/update
GET  /api/stats/user/:userId
GET  /api/stats/user/:userId/subjects
```

### Badges
```http
GET  /api/badges/user/:userId
POST /api/badges/check/:userId
```

### Questions
```http
POST /api/questions/flashcard
POST /api/questions/qcm
POST /api/questions/answer
```

### IA
```http
POST /api/flashcard/chat
POST /api/qcm/chat
```

### Streaks
```http
GET  /api/streak/user/:userId
POST /api/streak/update/:userId
GET  /api/streak/leaderboard
```

### Planificateur
```http
GET  /api/planner/today/:userId
POST /api/planner/complete/:userId/:activityType
```

### Health
```http
GET  /api/health
GET  /api/health/detailed
```

Voir [API Documentation](docs/API.md) pour la documentation complète.

## 🧪 Test Rapide

```bash
# Health check
curl https://your-app.onrender.com/api/health

# Créer un utilisateur test (via psql)
psql $DATABASE_URL -c "INSERT INTO users (wp_user_id, wp_display_name, email) VALUES (1, 'Test', 'test@example.com');"

# Mettre à jour les stats
curl -X POST https://your-app.onrender.com/api/stats/update \
  -H "Content-Type: application/json" \
  -d '{"wp_user_id": 1, "is_correct": true, "subject_id": 1}'
```

## 🗄️ Base de Données

### Schéma PostgreSQL avec :
- **14 tables** optimisées avec indexes
- **Triggers** pour updated_at automatique
- **Views** pour statistiques complexes
- **Functions** pour calculs (niveau, etc.)

Tables principales :
- `users`, `user_stats`, `user_subject_progress`
- `user_streaks`, `sessions`
- `badges`, `user_badges`
- `notification_queue`, `daily_plans`
- `spaced_repetition`, `question_bank`

Voir [Database Documentation](database/README.md)

## ⏰ Jobs Automatiques

| Job | Horaire | Description |
|-----|---------|-------------|
| Daily Planner | 6h | Génère les plans quotidiens |
| Smart Nudges | 8h, 14h, 20h | Envoie les rappels |
| Badge Checker | Toutes les heures | Vérifie les badges |
| Streak Checker | Minuit | Vérifie les streaks expirés |
| Notification Cleanup | Dimanche 3h | Nettoie les anciennes notifs |

## 🔐 Sécurité

- ✅ Rate limiting (100 req/15min par défaut)
- ✅ CORS configuré
- ✅ Helmet.js pour headers sécurisés
- ✅ Parameterized queries (anti SQL injection)
- ✅ Environment variables pour secrets
- ✅ HTTPS en production (via Render)

## 📈 Performance

- Connection pooling PostgreSQL (20 connexions max)
- Indexes optimisés sur toutes les requêtes fréquentes
- Compression gzip des réponses
- Logging structuré avec Winston
- Health checks pour monitoring

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour plus de détails.

## 📄 Licence

Ce projet est sous licence MIT. Voir [LICENSE](LICENSE) pour plus d'informations.

## 🆘 Support

- 📖 [Documentation complète](docs/)
- 🐛 [Issues GitHub](https://github.com/votre-username/drept-academy-api/issues)
- 💬 [Discussions](https://github.com/votre-username/drept-academy-api/discussions)

## 🗺️ Roadmap

- [ ] Authentification JWT
- [ ] Système de recommandation ML
- [ ] Analytics avancées
- [ ] Support multi-langues
- [ ] API GraphQL
- [ ] Tests automatisés (Jest)
- [ ] CI/CD avec GitHub Actions
- [ ] Documentation OpenAPI/Swagger

## 🙏 Remerciements

- [Google Gemini](https://ai.google.dev/) pour l'IA conversationnelle
- [Render](https://render.com) pour l'hébergement
- [PostgreSQL](https://www.postgresql.org/) pour la base de données
- [Express.js](https://expressjs.com/) pour le framework web

---

Développé avec ❤️ pour les étudiants en droit

**[⭐ Star ce projet](https://github.com/votre-username/drept-academy-api)** si vous le trouvez utile !

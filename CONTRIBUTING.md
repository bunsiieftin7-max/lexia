# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à Drept Academy API ! Ce document explique comment participer au projet.

## 📋 Table des Matières

- [Code of Conduct](#code-of-conduct)
- [Comment Contribuer](#comment-contribuer)
- [Setup du Projet](#setup-du-projet)
- [Structure du Code](#structure-du-code)
- [Standards de Code](#standards-de-code)
- [Process de Pull Request](#process-de-pull-request)
- [Signaler des Bugs](#signaler-des-bugs)
- [Proposer des Fonctionnalités](#proposer-des-fonctionnalités)

## Code of Conduct

En participant à ce projet, vous acceptez de respecter notre code de conduite :

- Soyez respectueux et inclusif
- Acceptez les critiques constructives
- Concentrez-vous sur ce qui est meilleur pour la communauté
- Montrez de l'empathie envers les autres

## Comment Contribuer

Il existe plusieurs façons de contribuer :

### 🐛 Signaler des Bugs
- Vérifiez que le bug n'a pas déjà été signalé
- Utilisez le template d'issue pour les bugs
- Incluez un maximum de détails

### ✨ Proposer des Fonctionnalités
- Ouvrez une issue avec le tag "enhancement"
- Expliquez clairement le problème et la solution proposée
- Donnez des exemples d'utilisation

### 📝 Améliorer la Documentation
- Corrigez les fautes de frappe
- Clarifiez les explications
- Ajoutez des exemples

### 💻 Contribuer du Code
1. Fork le projet
2. Créez une branche pour votre feature
3. Commitez vos changements
4. Poussez vers votre fork
5. Ouvrez une Pull Request

## Setup du Projet

### Prérequis
- Node.js >= 18.0.0
- PostgreSQL >= 13
- npm >= 9.0.0

### Installation

```bash
# Cloner votre fork
git clone https://github.com/VOTRE-USERNAME/drept-academy-api.git
cd drept-academy-api

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos credentials

# Créer la base de données
createdb drept_academy_dev
psql drept_academy_dev -f database/schema.sql

# Démarrer en mode développement
npm run dev
```

### Variables d'Environnement pour Dev

```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/drept_academy_dev
GEMINI_API_KEY=your_dev_key
GOOGLE_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FLASHCARD_SHEET_ID=your_sheet_id
QCM_SHEET_ID=your_sheet_id
ALLOWED_ORIGINS=http://localhost:3000
ENABLE_CRON_JOBS=false
LOG_LEVEL=debug
```

## Structure du Code

```
src/
├── config/          # Configuration (database, etc.)
├── routes/          # Routes Express
├── services/        # Business logic
├── jobs/            # Cron jobs
├── utils/           # Utilitaires
└── server.js        # Point d'entrée
```

### Principes d'Architecture

- **Séparation des responsabilités** : Routes → Services → Database
- **Pas de logique métier dans les routes**
- **Services réutilisables**
- **Gestion d'erreurs uniforme**
- **Logging structuré**

## Standards de Code

### JavaScript

```javascript
// ✅ Bon
const userService = require('../services/user.service');

async function getUserStats(userId) {
  try {
    const stats = await userService.getStats(userId);
    return stats;
  } catch (error) {
    logger.error('Error fetching stats:', error);
    throw error;
  }
}

// ❌ Mauvais
function getUserStats(userId) {
  userService.getStats(userId).then(stats => {
    return stats;
  });
}
```

### Conventions de Nommage

- **Fichiers** : `kebab-case.js` (ex: `user.service.js`)
- **Variables/Fonctions** : `camelCase` (ex: `getUserStats`)
- **Classes** : `PascalCase` (ex: `UserService`)
- **Constantes** : `UPPER_SNAKE_CASE` (ex: `MAX_RETRIES`)

### Commentaires

```javascript
// ✅ Bon - Explique le pourquoi
// Use SM-2 algorithm because it's proven effective for spaced repetition
const interval = calculateSM2Interval(repetitions, easeFactor);

// ❌ Mauvais - Explique le quoi (évident dans le code)
// Set interval to the result of calculateSM2Interval
const interval = calculateSM2Interval(repetitions, easeFactor);
```

### Gestion d'Erreurs

```javascript
// ✅ Bon
try {
  const result = await service.doSomething();
  res.json({ success: true, data: result });
} catch (error) {
  logger.error('Error in endpoint:', error);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
}

// ❌ Mauvais
const result = await service.doSomething();
res.json(result);
```

### Logging

```javascript
// ✅ Bon
logger.info('User stats updated', { 
  userId, 
  questionsAnswered: stats.total_questions 
});

// ❌ Mauvais
console.log(`Stats updated for user ${userId}`);
```

## Process de Pull Request

### 1. Créer une Branche

```bash
# Toujours partir de main à jour
git checkout main
git pull origin main

# Créer une branche descriptive
git checkout -b feature/add-user-preferences
# ou
git checkout -b fix/streak-calculation-bug
```

### 2. Faire vos Changements

- Respectez les standards de code
- Testez localement
- Commitez régulièrement avec des messages clairs

### 3. Messages de Commit

Format : `type: description`

Types :
- `feat`: Nouvelle fonctionnalité
- `fix`: Correction de bug
- `docs`: Documentation
- `style`: Formatage
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Maintenance

Exemples :
```bash
git commit -m "feat: add user preferences endpoint"
git commit -m "fix: correct streak calculation for timezone"
git commit -m "docs: update API documentation"
```

### 4. Pousser et Ouvrir une PR

```bash
git push origin feature/add-user-preferences
```

Puis sur GitHub :
1. Ouvrez une Pull Request
2. Remplissez le template
3. Liez les issues concernées
4. Attendez la review

### 5. Review Process

- Un maintainer reviewera votre PR
- Répondez aux commentaires
- Faites les changements demandés
- Une fois approuvée, elle sera mergée

## Signaler des Bugs

### Template d'Issue pour Bug

```markdown
**Description**
Description claire du bug

**Pour Reproduire**
1. Allez sur '...'
2. Cliquez sur '...'
3. Scrollez jusqu'à '...'
4. Voyez l'erreur

**Comportement Attendu**
Ce qui devrait se passer

**Screenshots**
Si applicable

**Environnement**
- OS: [ex: Ubuntu 22.04]
- Node: [ex: 18.17.0]
- Version: [ex: 1.0.0]

**Logs**
```
Collez les logs ici
```

**Contexte Additionnel**
Toute autre information pertinente
```

## Proposer des Fonctionnalités

### Template d'Issue pour Feature

```markdown
**Problème à Résoudre**
Description claire du problème que cette feature résoudrait

**Solution Proposée**
Description de la solution envisagée

**Alternatives Considérées**
Autres approches considérées et pourquoi elles n'ont pas été retenues

**Contexte Additionnel**
Toute autre information pertinente

**Exemples d'Utilisation**
```javascript
// Comment la feature serait utilisée
const result = await newFeature.doSomething();
```
```

## Questions ?

- 💬 [Discussions GitHub](https://github.com/votre-username/drept-academy-api/discussions)
- 📧 Email : dev@drept-academy.com
- 📖 [Documentation](../README.md)

---

**Merci de contribuer à Drept Academy API ! 🙏**

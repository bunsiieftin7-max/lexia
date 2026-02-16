#!/bin/bash

# 🚀 Script d'initialisation Git pour Drept Academy API
# Ce script configure Git et pousse le code vers GitHub

set -e  # Exit on error

echo "🎓 Initialisation Drept Academy API"
echo "===================================="
echo ""

# Vérifier si Git est installé
if ! command -v git &> /dev/null; then
    echo "❌ Git n'est pas installé. Installez-le d'abord."
    exit 1
fi

# Vérifier si on est dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Exécutez ce script depuis la racine du projet"
    exit 1
fi

# Demander le nom du repo
echo "📝 Configuration Git"
read -p "Entrez votre username GitHub: " GITHUB_USERNAME
read -p "Entrez le nom du repository (ex: drept-academy-api): " REPO_NAME

echo ""
echo "🔧 Configuration Git..."

# Initialiser Git si ce n'est pas déjà fait
if [ ! -d ".git" ]; then
    git init
    echo "✅ Repository Git initialisé"
else
    echo "ℹ️  Repository Git déjà initialisé"
fi

# Configurer l'utilisateur (si pas déjà fait)
if [ -z "$(git config user.name)" ]; then
    read -p "Entrez votre nom pour Git: " GIT_NAME
    git config user.name "$GIT_NAME"
fi

if [ -z "$(git config user.email)" ]; then
    read -p "Entrez votre email pour Git: " GIT_EMAIL
    git config user.email "$GIT_EMAIL"
fi

# Créer le premier commit
echo ""
echo "📦 Création du commit initial..."
git add .
git commit -m "Initial commit: Drept Academy API

- Express.js API avec PostgreSQL
- Google Gemini AI integration
- Système de gamification complet
- Jobs automatiques avec node-cron
- Documentation complète
- Prêt pour déploiement Render" || echo "ℹ️  Commit déjà existant"

# Créer la branche main si nécessaire
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    git branch -M main
    echo "✅ Branche renommée en 'main'"
fi

# Ajouter le remote
REPO_URL="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
if git remote | grep -q "origin"; then
    git remote set-url origin $REPO_URL
    echo "✅ Remote 'origin' mis à jour"
else
    git remote add origin $REPO_URL
    echo "✅ Remote 'origin' ajouté"
fi

echo ""
echo "🎉 Configuration terminée!"
echo ""
echo "📋 Prochaines étapes:"
echo ""
echo "1. Créez le repository sur GitHub:"
echo "   → Allez sur https://github.com/new"
echo "   → Nom: $REPO_NAME"
echo "   → Description: API pour plateforme d'apprentissage du droit"
echo "   → Public ou Private selon votre choix"
echo "   → Ne cochez PAS 'Initialize with README'"
echo "   → Créez le repository"
echo ""
echo "2. Poussez le code:"
echo "   git push -u origin main"
echo ""
echo "3. Déployez sur Render:"
echo "   → https://dashboard.render.com"
echo "   → New → Blueprint"
echo "   → Connectez votre repo GitHub"
echo "   → Configurez les variables d'environnement"
echo ""
echo "📖 Documentation complète: docs/QUICKSTART.md"
echo ""

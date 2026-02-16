# 🚀 Déploiement Étape par Étape

Guide complet pour déployer Drept Academy API depuis zéro jusqu'en production.

## ⏱️ Temps Estimé : 15 minutes

## ✅ Checklist de Préparation

Avant de commencer, assurez-vous d'avoir :

- [ ] Compte GitHub (gratuit)
- [ ] Compte Render (gratuit)
- [ ] Clé API Google Gemini
- [ ] Service Account Google Sheets configuré

---

## 📝 Étape 1 : Préparer les Credentials (5 min)

### A. Google Gemini API

1. **Allez sur** : https://makersuite.google.com/app/apikey
2. **Cliquez** sur "Create API Key"
3. **Copiez** la clé et sauvegardez-la quelque part

### B. Google Sheets API

1. **Google Cloud Console** : https://console.cloud.google.com
2. **Créez un projet** : "Drept Academy"
3. **Activez l'API** :
   - Menu ☰ → APIs & Services → Enable APIs
   - Recherchez "Google Sheets API"
   - Cliquez "Enable"

4. **Créez un Service Account** :
   - Menu ☰ → IAM & Admin → Service Accounts
   - "Create Service Account"
   - Name: `drept-academy-sheets`
   - Role: (laissez vide)
   - "Create and Continue" → "Done"

5. **Créez une clé** :
   - Cliquez sur le service account créé
   - Tab "Keys" → "Add Key" → "Create new key"
   - Type: JSON
   - "Create" → télécharge un fichier JSON

6. **Ouvrez le fichier JSON** et notez :
   ```
   client_email: "drept-academy-sheets@......iam.gserviceaccount.com"
   private_key: "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

7. **Partagez vos Google Sheets** :
   - Ouvrez votre sheet de Flashcards
   - Cliquez "Partager"
   - Collez le `client_email`
   - Donnez l'accès "Lecteur"
   - Cliquez "Envoyer"
   - Répétez pour le sheet de QCM

✅ **Credentials prêts !**

---

## 🐙 Étape 2 : Pousser sur GitHub (3 min)

### Option A : Utiliser le script automatique

```bash
./init-git.sh
```

Suivez les instructions du script.

### Option B : Manuellement

```bash
# 1. Initialiser Git
git init

# 2. Configurer votre identité
git config user.name "Votre Nom"
git config user.email "votre@email.com"

# 3. Premier commit
git add .
git commit -m "Initial commit: Drept Academy API"

# 4. Créer la branche main
git branch -M main

# 5. Créer le repo sur GitHub
# Allez sur https://github.com/new
# Nom: drept-academy-api
# Ne cochez PAS "Initialize with README"
# Créez le repo

# 6. Ajouter le remote
git remote add origin https://github.com/VOTRE-USERNAME/drept-academy-api.git

# 7. Pousser
git push -u origin main
```

✅ **Code sur GitHub !**

---

## 🎨 Étape 3 : Déployer sur Render (5 min)

### Créer le Service

1. **Allez sur** : https://dashboard.render.com

2. **Connectez GitHub** :
   - Si pas déjà fait : "Connect Account" → Autorisez

3. **New → Blueprint** :
   - Cliquez "New +" → "Blueprint"
   - Sélectionnez votre repository `drept-academy-api`
   - Render détecte automatiquement `render.yaml`

4. **Nommez votre Blueprint** :
   - Name: `Drept Academy`
   - Cliquez "Apply"

### Configurer les Variables Secrètes

Render va vous demander 3 variables :

#### 1. GEMINI_API_KEY
```
Collez votre clé API Google Gemini
```

#### 2. GOOGLE_CLIENT_EMAIL
```
Collez le client_email du fichier JSON
Exemple: drept-academy-sheets@projet-123456.iam.gserviceaccount.com
```

#### 3. GOOGLE_PRIVATE_KEY
```
Collez la private_key du fichier JSON
⚠️ IMPORTANT: Gardez les \n (sauts de ligne)
Exemple: -----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n
```

**Astuce** : Pour copier correctement la clé privée :
- Ouvrez le fichier JSON dans un éditeur
- Copiez exactement le contenu de "private_key" avec les \n
- Ne formatez pas, ne remplacez pas les \n

5. **Cliquez "Apply Blueprint"**

Render va créer :
- ✅ Une base de données PostgreSQL
- ✅ Un Web Service avec votre API

**Attendez 5-10 minutes** que Render construise et déploie.

✅ **API déployée !**

---

## 🗄️ Étape 4 : Initialiser la Base de Données (2 min)

### Depuis votre Terminal Local

1. **Récupérez l'URL de connexion** :
   - Render Dashboard → Votre Database
   - Tab "Connect"
   - Copiez la commande "External Connection"

2. **Exécutez le schema** :
```bash
# Remplacez <DATABASE_URL> par l'URL copiée
psql <DATABASE_URL> -f database/schema.sql
```

Vous devriez voir plusieurs messages `CREATE TABLE`, `CREATE INDEX`, etc.

✅ **Base de données prête !**

---

## 🧪 Étape 5 : Tester l'API (2 min)

### 1. Trouver l'URL de votre API

- Render Dashboard → Votre Web Service
- L'URL est en haut : `https://votre-app.onrender.com`

### 2. Health Check

```bash
curl https://votre-app.onrender.com/api/health
```

Résultat attendu :
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "uptime": 123.45
}
```

### 3. Test Détaillé

```bash
curl https://votre-app.onrender.com/api/health/detailed
```

Vérifiez que tous les services sont `true` :
```json
{
  "services": {
    "gemini_ai": true,
    "google_sheets": true,
    "cron_jobs": true
  }
}
```

### 4. Créer un Utilisateur Test

```bash
# Remplacez <DATABASE_URL> par votre URL
psql <DATABASE_URL> -c "INSERT INTO users (wp_user_id, wp_display_name, email) VALUES (1, 'Test User', 'test@example.com');"
```

### 5. Test Complet

```bash
# Mettre à jour des stats
curl -X POST https://votre-app.onrender.com/api/stats/update \
  -H "Content-Type: application/json" \
  -d '{
    "wp_user_id": 1,
    "is_correct": true,
    "subject_id": 1,
    "question_id": "test_q1"
  }'

# Récupérer les stats
curl https://votre-app.onrender.com/api/stats/user/1

# Obtenir une question
curl -X POST https://votre-app.onrender.com/api/questions/flashcard \
  -H "Content-Type: application/json" \
  -d '{"query": "droit civil"}'
```

✅ **Tout fonctionne !**

---

## 🎉 Succès ! Que faire maintenant ?

### 1. Notez votre URL
```
https://votre-app.onrender.com/api
```

### 2. Intégrez avec votre Frontend

```javascript
const API_URL = 'https://votre-app.onrender.com/api';

// Exemple : Mettre à jour les stats
async function updateUserStats(userId, isCorrect) {
  const response = await fetch(`${API_URL}/stats/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      wp_user_id: userId,
      is_correct: isCorrect,
      subject_id: 1,
      question_id: 'q_' + Date.now()
    })
  });
  return response.json();
}
```

### 3. Configurez un Domaine Personnalisé (Optionnel)

- Render Dashboard → Votre Service → Settings
- Scroll jusqu'à "Custom Domain"
- Ajoutez votre domaine
- Configurez les DNS selon les instructions

### 4. Activez les Backups

- Render Dashboard → Votre Database → Backups
- Enable "Automatic Backups"

### 5. Surveillez les Logs

- Render Dashboard → Votre Service → Logs
- Vérifiez qu'il n'y a pas d'erreurs

---

## 🐛 Dépannage

### Erreur : "Google Sheets API not configured"

**Problème** : Variables d'environnement incorrectes

**Solution** :
1. Vérifiez que `GOOGLE_CLIENT_EMAIL` et `GOOGLE_PRIVATE_KEY` sont définies
2. Vérifiez que les \n sont présents dans `GOOGLE_PRIVATE_KEY`
3. Vérifiez que les Sheets sont partagés avec le service account

### Erreur : "Database connection failed"

**Solution** :
1. Vérifiez que le schema a été exécuté : `psql <DATABASE_URL> -c "\dt"`
2. Vérifiez que la DB et le service sont dans le même projet Render

### L'API est lente

**Raison** : Le plan gratuit de Render met l'instance en veille après 15 min d'inactivité

**Solutions** :
1. Passez au plan payant ($7/mois)
2. Utilisez un service de "keep-alive" externe
3. Acceptez le délai de ~30 secondes au premier appel

---

## 📚 Documentation Complète

- **[README.md](../README.md)** - Vue d'ensemble
- **[API Examples](../examples/API_EXAMPLES.md)** - Exemples de requêtes
- **[Database Schema](../database/README.md)** - Documentation DB
- **[Contributing](../CONTRIBUTING.md)** - Guide de contribution

---

## 🆘 Besoin d'Aide ?

- 🐛 [Ouvrir une issue](https://github.com/votre-username/drept-academy-api/issues)
- 💬 [Discussions](https://github.com/votre-username/drept-academy-api/discussions)
- 📧 [Render Support](https://render.com/support)

---

**🎊 Félicitations ! Votre API est déployée et fonctionnelle !**

N'oubliez pas de ⭐ star le projet sur GitHub si vous le trouvez utile !

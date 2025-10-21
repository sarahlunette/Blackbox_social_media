# DisasterConnect - Application de Gestion de Médias Sociaux pour la Gestion Post-Catastrophe

## 🌟 Vue d'ensemble

**DisasterConnect** est une application innovante qui utilise l'API Blackbox pour générer et programmer automatiquement des publications sur les réseaux sociaux concernant les offres d'emploi post-catastrophes naturelles. L'application inclut des fonctionnalités avancées comme l'analyse de données, les tests A/B, et la gestion multi-plateformes.

## 🎯 Objectifs principaux

- **Génération automatique de contenu** : Création de photos/vidéos avec l'IA
- **Publication multi-plateformes** : Facebook, Twitter, Instagram, LinkedIn
- **Réponse automatique** : Gestion des candidatures et réponses
- **Analytics avancés** : Suivi des performances et insights
- **Tests A/B** : Optimisation des campagnes

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure) - [Télécharger ici](https://nodejs.org/)
- **npm** ou **yarn** (inclus avec Node.js)
- **Git** pour cloner le projet

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <votre-repo-url>
cd disaster-connect
```

### 2. Installer les dépendances

```bash
npm install
# ou avec yarn
yarn install
```

### 3. Configuration de l'environnement

Créez un fichier `.env.local` à la racine du projet avec vos clés API :

```env
# API Blackbox
BLACKBOX_API_KEY=votre_cle_blackbox_api

# Réseaux sociaux (optionnel pour la démo)
FACEBOOK_ACCESS_TOKEN=votre_token_facebook
TWITTER_API_KEY=votre_cle_twitter
INSTAGRAM_ACCESS_TOKEN=votre_token_instagram
LINKEDIN_ACCESS_TOKEN=votre_token_linkedin

# Base de données (optionnel - utilise localStorage par défaut)
DATABASE_URL=votre_url_base_donnees
```

## 🎮 Lancement de l'application

### Mode développement

```bash
npm run dev
# ou avec yarn
yarn dev
```

L'application sera accessible sur : **http://localhost:3000**

### Mode production

```bash
# Construire l'application
npm run build

# Lancer en production
npm start
```

## 📱 Comment utiliser l'application

### 1. Page d'accueil
- Accédez à http://localhost:3000
- Vous verrez le tableau de bord principal avec les statistiques

### 2. Créer une campagne
1. Cliquez sur **"Nouvelle Campagne"**
2. Remplissez les informations :
   - **Nom de la campagne** : Ex. "Recrutement post-ouragan Miami"
   - **Description** : Décrivez les besoins en main-d'œuvre
   - **Plateformes cibles** : Sélectionnez Facebook, Twitter, etc.
   - **Horaires de publication** : Définissez quand publier

### 3. Générer du contenu automatique
1. Dans votre campagne, cliquez sur **"Générer contenu"**
2. L'IA Blackbox créera automatiquement :
   - Textes adaptés à chaque plateforme
   - Images personnalisées
   - Hashtags optimisés

### 4. Programmer les publications
1. Choisissez les dates et heures de publication
2. Activez la publication automatique
3. L'app publiera automatiquement selon votre planning

### 5. Suivre les performances
- Consultez l'onglet **"Analytics"** pour voir :
  - Nombre de vues et interactions
  - Taux de candidatures
  - Performance par plateforme
  - Tests A/B en cours

### 6. Gestion des réponses
- L'application détecte automatiquement les personnes intéressées
- Répond automatiquement avec des informations de contact
- Archive les candidatures pour suivi

## 🔧 Fonctionnalités principales

### 📊 Tableau de bord
- Vue d'ensemble des campagnes actives
- Statistiques en temps réel
- Alertes et notifications

### 🎨 Générateur de contenu IA
- Création automatique de visuels
- Adaptation du message par plateforme
- Optimisation SEO automatique

### 📅 Planificateur
- Calendrier interactif
- Publication multi-plateformes
- Gestion des fuseaux horaires

### 📈 Analytics avancés
- Métriques détaillées par campagne
- Comparaison A/B automatique
- Rapports exportables

### 🤖 Réponses automatiques
- Détection des candidatures
- Réponses personnalisées
- Suivi des profils intéressants

## 🛠️ Structure du projet

```
disaster-connect/
├── app/                    # Pages Next.js
├── components/             # Composants React réutilisables
│   ├── campaigns/         # Composants de gestion des campagnes
│   └── ui/               # Composants d'interface
├── lib/                   # Logique métier et APIs
│   ├── blackbox-api.ts   # Intégration API Blackbox
│   ├── database.ts       # Gestion des données
│   ├── ab-test-manager.ts # Tests A/B
│   └── response-manager.ts # Gestion des réponses
├── types/                 # Types TypeScript
└── package.json          # Dépendances
```

## 🔑 APIs et intégrations

### API Blackbox
- Génération de contenu textuel
- Création d'images IA
- Analyse de sentiment

### Réseaux sociaux
- **Facebook** : Publication et analytics
- **Twitter** : Tweets et réponses automatiques
- **Instagram** : Stories et posts
- **LinkedIn** : Posts professionnels

## 🐛 Résolution des problèmes courants

### L'application ne démarre pas
```bash
# Vérifier la version de Node.js
node --version  # doit être >= 18

# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Erreurs d'API
- Vérifiez que vos clés API sont correctes dans `.env.local`
- Redémarrez l'application après modification du .env

### Problèmes de publication
- Vérifiez les permissions de vos tokens de réseaux sociaux
- Consultez les logs dans la console du navigateur

## 🚀 Déploiement

### Vercel (recommandé)
```bash
npm install -g vercel
vercel
```

### Autres plateformes
L'application est compatible avec :
- Netlify
- Railway
- Heroku
- Serveurs VPS

## 🤝 Contribution

Pour contribuer au projet :
1. Fork le repository
2. Créez une branche : `git checkout -b feature/nouvelle-fonctionnalite`
3. Commitez : `git commit -m 'Ajout nouvelle fonctionnalité'`
4. Push : `git push origin feature/nouvelle-fonctionnalite`
5. Créez une Pull Request

## 📞 Support

- **Documentation** : Consultez ce README
- **Issues** : Ouvrez une issue sur GitHub
- **Email** : contact@disasterconnect.app

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 🎉 Démo rapide

Pour tester rapidement l'application :

1. **Lancez en mode démo** :
```bash
npm run dev
```

2. **Créez votre première campagne** :
   - Nom : "Test Recrutement"
   - Plateforme : Facebook
   - Activez le mode démo (pas besoin d'API réelles)

3. **Générez du contenu** et regardez l'IA créer automatiquement posts et visuels

4. **Consultez les analytics** pour voir les métriques simulées

L'application fonctionne en mode démo sans nécessiter de clés API réelles !

---

**DisasterConnect** - *Connecter l'aide là où elle est nécessaire* 🌍
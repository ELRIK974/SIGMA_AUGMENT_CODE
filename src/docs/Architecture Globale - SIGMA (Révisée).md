
Architecture Globale - SIGMA (Optimisé pour Augment Code)
Version : 1.1 (Date de révision)
Auteur : [Ton Nom/Équipe] + Mentor IA
Objectif du Document : Fournir une description détaillée et structurée de l'architecture technique du projet SIGMA. Ce document sert de contexte de référence principal pour Augment Code (Agent, Chat) afin d'assurer la cohérence et la pertinence de son assistance lors du développement.

1. Vue d'Ensemble
Nom du Projet : SIGMA
Type d'Application : Outil interne de gestion logistique.
Public Cible : ~30 utilisateurs internes.
Objectif Principal : Optimiser la gestion logistique du matériel (emprunts, stocks, modules, livraisons) pour réduire les coûts, simplifier la prise en main et centraliser le suivi.
Référence Checklist : Le développement suit les étapes définies dans @sigma-tasks.md.

2. Technologies & Services Clés
Cette section détaille les technologies spécifiques utilisées et leurs rôles dans SIGMA.
2.1. Front-End (Interface Utilisateur)
Service Hôte : Google Apps Script (GAS) via HtmlService.
Structure HTML/CSS/JS :
Fichiers HTML multiples (.html) servis par GAS.
CSS Framework : Bootstrap 5 (Utilisation des classes et composants standard). Fichier principal : src/css/styles.css (wrapper css_styles.html).
JavaScript : Vanilla JS pour la logique client et manipulation DOM. Fichiers .js organisés dans src/js/ et inclus via des wrappers .html (js_*.html).
Gestion d'état simple : src/js/stateManager.js.
Note sur la performance : Surveiller les appels google.script.run pour éviter les limitations de quota GAS.


Communication Client -> Serveur (GAS) : google.script.run avec gestionnaires de succès/échec.
2.2. Back-End (Logique Serveur & Données)
Base de Données : Firebase Firestore (Mode production, NoSQL).
Rôle : Persistance des données (emprunts, stocks, etc.), requêtes, synchronisation temps réel.
SDK Client : Firebase JS SDK v9 (modulaire) dans le code client (src/js/).
Cohérence : Transactions Firestore pour les opérations critiques (mouvements de stock, validation emprunt, démantèlement module).
Temps Réel : Listeners Firestore (onSnapshot) côté client pour les mises à jour dynamiques (ex: Dashboard). Optimiser les lectures.


Logique Serveur Simple & Interface : Google Apps Script (.gs)
Rôle : Servir l'UI (doGet), gérer les appels simples depuis le client (google.script.run), interagir avec les services Google Workspace si nécessaire. Fichiers principaux dans src/ (ex: Code.gs, Auth.gs).


Logique Serveur Complexe & Tâches Asynchrones : Firebase Cloud Functions (Node.js)
Rôle : Opérations gourmandes, tâches planifiées (rapports, alertes, sauvegardes), agrégations complexes, génération PDF/exports lourds, triggers Firestore, décharge de GAS. Code dans src/firebase/functions/.
Triggers : Potentiellement utilisés pour des actions réactives (ex: mise à jour de statistiques agrégées lors d'un changement de statut).


2.3. Authentification & Autorisation
Service : Firebase Authentication.
Fournisseurs Principaux : Google Sign-In (fortement recommandé). Email/Password en option.
Gestion des Rôles/Permissions :
Stratégie Choisie : Option B: Via des Firebase Custom Claims (gérés par des Cloud Functions)
Les rôles sont stockés dans les Custom Claims des utilisateurs Firebase Auth, avec une copie dans la collection users de Firestore pour compatibilité et affichage dans l'interface d'administration.


Rôles Définis : admin, regisseur, utilisateur (préciser les permissions de chaque rôle dans docs/Permissions.md).


Sécurité : Contrôle d'accès via les Règles de Sécurité Firestore (src/firebase/firestore.rules) basées sur request.auth.uid et le rôle (champ Firestore ou Custom Claim).
2.4. Sécurité Générale & Performance
Sécurité Firestore : Règles robustes (src/firebase/firestore.rules) incluant la validation des données.
Sécurité Storage : Règles robustes (src/firebase/storage.rules).
Validation Serveur : Validation des données côté serveur (GAS et/ou Cloud Functions) en complément des règles Firestore.
Performance Firestore :
Utilisation d'Indexes Composites (src/firebase/firestore.indexes.json).
Optimisation des requêtes et des listeners.
Utilisation du cache offline de Firestore.
Pagination pour les listes longues.
Surveillance des coûts de lecture/écriture.


Tests de Sécurité : Utilisation systématique de la Firebase Emulator Suite pour tester les règles Firestore et Storage localement.
2.5. Maintenance, Observabilité & Déploiement
Logging & Monitoring : Google Cloud Operations (Stackdriver)
Rôle : Logging centralisé (Client JS, Serveur GAS via console.log, Cloud Functions), monitoring performance/erreurs.
Configuration : Alertes sur erreurs critiques.


Sauvegarde : Cloud Function planifiée sauvegardant Firestore vers Google Cloud Storage (GCS).
Mode Maintenance : Interrupteur simple dans Firestore contrôlant l'accès via src/js/utils/maintenanceMode.js ou logique serveur GAS.
Déploiement GAS : Outil CLASP (.clasp.json, .claspignore).
Déploiement Firebase : Outil Firebase CLI (déploiement règles, indexes, functions, storage rules).
Tests Locaux : Utilisation essentielle de la Firebase Emulator Suite pour Firestore, Auth, Functions, Storage.
CI/CD (Recommandé) : Pipeline (ex: GitHub Actions, Cloud Build) pour automatiser tests et déploiements (clasp push, firebase deploy).

3. Structure de Dossiers (SIGMA_GAS/)
     SIGMA_GAS/
├── .clasp.json             # Configuration CLASP (rootDir: "./src")
├── .claspignore            # Fichiers DANS src/ à ignorer par CLASP lors du push
├── firebase.json           # Configuration Firebase CLI (émulateurs, déploiement)
├── src/                    # <-- RACINE POUR CLASP ET LE CODE SOURCE
│   ├── appsscript.json     # Manifeste Apps Script (scopes, etc.)
│   │
│   ├── # --- Code Serveur GAS ---
│   ├── Code.gs             # Point d'entrée (doGet), includes, config globale
│   ├── Auth.gs             # Logique Auth côté serveur GAS
│   ├── Maintenance.gs      # Logique Maintenance côté serveur GAS
│   ├── Triggers.gs         # Déclencheurs GAS (time-based, etc.)
│   ├── *.gs                # Autres fichiers de logique serveur GAS
│   │
│   ├── # --- Fichiers HTML (UI Templates & Wrappers) ---
│   ├── index.html          # Template HTML principal (Dashboard)
│   ├── emprunts.html       # Template HTML section Emprunts
│   ├── stocks.html         # Template HTML section Stocks
│   ├── modules.html        # Template HTML section Modules
│   ├── livraisons.html     # Template HTML section Livraisons
│   ├── *.html              # Autres templates ou fragments HTML
│   │
│   ├── # --- Wrappers JS/CSS pour inclusion via GAS 'include()' ---
│   ├── js_*.html           # Wrappers pour les fichiers JS de src/js/
│   ├── css_styles.html     # Wrapper pour src/css/styles.css
│   │
│   ├── # --- Code Client (Organisé localement, ignoré par CLASP via .claspignore) ---
│   ├── js/                 # Code source JavaScript Client
│   │   ├── main.js         # Point d'entrée JS principal
│   │   ├── stateManager.js # Gestionnaire d'état simple
│   │   ├── firebaseUtils.js# Initialisation Firebase Client, fonctions utilitaires
│   │   ├── uiUtils.js      # Fonctions utilitaires pour l'UI (Bootstrap, etc.)
│   │   ├── domain/         # Logique métier spécifique par domaine
│   │   │   ├── empruntsData.js
│   │   │   ├── stocksData.js
│   │   │   └── ...
│   │   └── ...             # Autres utilitaires ou modules JS
│   ├── css/                # Code source CSS
│   │   └── styles.css      # Feuille de style principale
│   │
│   ├── img/                # Images (si stockées localement, souvent hébergées ailleurs)
│   │
│   ├── # --- Configuration et Code Firebase (Ignoré par CLASP) ---
│   ├── firebase/
│   │   ├── firestore.indexes.json # Indexes Firestore
│   │   ├── firestore.rules      # Règles de sécurité Firestore
│   │   ├── storage.rules        # Règles de sécurité Firebase Storage
│   │   ├── functions/           # Code Cloud Functions
│   │   │   ├── package.json
│   │   │   ├── index.js         # Point d'entrée des fonctions
│   │   │   └── ...              # Autres fichiers Node.js
│   │   └── migrations/          # Scripts de migration Firestore (optionnel)
│   │       └── ...
│   │
│   ├── # --- Documentation (Ignorée par CLASP) ---
│   ├── docs/
│   │   ├── Architecture.md      # CE FICHIER
│   │   ├── DataModel.md         # Description modèles de données Firestore
│   │   ├── Permissions.md       # Détail des rôles et permissions
│   │   ├── schemas/             # Schémas JSON des collections Firestore
│   │   └── ...
│   │
│   └── # --- Tests (Ignorés par CLASP) ---
│       └── tests/
│           ├── *.test.js        # Tests unitaires JS
│           └── integration/     # Tests d'intégration (avec Emulators)
│
└── README.md                   # README principal du projet

Contenu .claspignore :
     src/js/
src/css/
src/img/
src/firebase/
src/docs/
src/tests/
# Autres fichiers/dossiers spécifiques à ignorer par CLASP

IGNORE_WHEN_COPYING_START
content_copy download
Use code with caution.
IGNORE_WHEN_COPYING_END
(Note : Augment Code indexera ces dossiers localement même s'ils sont dans .claspignore, sauf s'ils sont aussi dans .augmentignore)

4. Points Clés de l'Organisation
Front-End Client (src/js/, src/css/, src/html/) : Code exécuté dans le navigateur, servi par GAS via les wrappers .html.
Back-End Serveur :
GAS (src/*.gs) : Logique simple, service UI, intégration Google Workspace.
Cloud Functions (src/firebase/functions/) : Logique complexe, tâches asynchrones/planifiées (Node.js).


Données & Sécurité (src/firebase/) : Configuration Firestore/Storage (règles, indexes).
Infrastructure & Outils (firebase.json, .clasp.json) : Configuration des outils CLI Firebase et CLASP.
Tests (src/tests/, src/firebase/functions/tests/) : Firebase Emulator Suite est essentiel pour tester localement Firestore, Auth, Functions, et Storage. Tests unitaires et d'intégration dédiés.
Documentation (src/docs/) : Centralisée et maintenue à jour. Inclut ce document d'architecture, le modèle de données (DataModel.md), les permissions (Permissions.md), et les schémas (schemas/).

5. Conventions de Communication avec Augment Code
Pour une collaboration efficace avec l'Agent Augment ou le Chat :
Référencer ce document : Mentionner @docs/Architecture.md dans les prompts pour fournir ce contexte.
Format Standardisé pour les Instructions (new_task) : Utiliser la structure suivante pour les demandes à l'Agent :
      CONTEXTE: [Références @docs/..., @sigma-tasks.md, @handoffs/..., état actuel]
OBJECTIF: [Description claire et concise de ce que l'agent doit accomplir]
ACTION:
1. [Instruction spécifique et détaillée]
2. [Autre instruction]
FICHIERS CIBLES: [`src/js/fichier.js`, `src/firebase/firestore.rules`, etc.]
RESULTAT ATTENDU: [Description précise du livrable, code généré, fichiers modifiés, tests à passer]
CONSEIL: (Optionnel) [Informations utiles, points d'attention]

 IGNORE_WHEN_COPYING_START
 content_copy download
 Use code with caution.Markdown
IGNORE_WHEN_COPYING_END
Vocabulaire Commun : Utiliser les termes définis dans ce document et dans docs/DataModel.md (ex: statuts d'emprunt, types de matériel).

6. Points d'Évolution et Recommandations
Automatisation Handoffs (Idée) : Étudier la possibilité d'une Cloud Function pour aider à générer/mettre à jour les Handoffs.
Référentiel Projet (Bonne Pratique) : Maintenir docs/ à jour, notamment avec les API clés (.gs, Cloud Functions) et les décisions d'architecture.
Schémas de Données (src/docs/schemas/) : Définir et maintenir des schémas JSON pour les collections Firestore principales (emprunts, stocks, modules, users). Utiliser pour la validation (via règles Firestore ou code) et la documentation (DataModel.md).
CI/CD : La mise en place est fortement conseillée pour améliorer la qualité et la fiabilité des déploiements (clasp push et firebase deploy).

Ce document constitue la référence architecturale pour le développement de SIGMA avec l'aide d'Augment Code. Le maintenir à jour est essentiel.


# Architecture de SIGMA

## Vue d'ensemble

SIGMA (Système Informatique de Gestion du Matériel) est construit autour d'une architecture combinant:
- **Google Apps Script (GAS)** pour le backend serveur et le déploiement
- **Firebase Firestore** pour la base de données en temps réel
- **Firebase Authentication** pour la gestion des utilisateurs
- **Firebase Cloud Functions** pour la logique complexe et les tâches asynchrones

## Composants principaux

### 1. Interface Utilisateur
- Servie par Google Apps Script (HTML, CSS, JavaScript)
- Responsive design pour desktop et mobile
- Communication en temps réel avec Firestore

### 2. Backend
- **Google Apps Script** (.gs) pour:
  - Servir l'interface
  - Fournir des API pour le client
  - Intégrer avec les services Google Workspace
- **Firebase Cloud Functions** pour:
  - Logique métier complexe
  - Tâches asynchrones et planifiées
  - Génération de rapports et PDF

### 3. Base de données
- **Firestore** (NoSQL) pour:
  - Stockage des données principales
  - Synchronisation en temps réel
  - Requêtes complexes

### 4. Sécurité
- **Firebase Authentication** pour la gestion des utilisateurs
- **Règles de sécurité Firestore** pour contrôler l'accès aux données

## Structure du projet

```
SIGMA_GAS/
├── src/                  # Code source pour GAS
│   ├── server/           # Scripts côté serveur (GAS)
│   ├── html/             # Templates HTML
│   ├── js/               # JavaScript client
│   │   ├── domain/       # Logique métier
│   │   └── admin/        # UI Administration
│   └── css/              # Styles CSS
├── firebase/             # Configuration Firebase
│   ├── functions/        # Cloud Functions
│   └── rules/            # Règles de sécurité
├── docs/                 # Documentation
└── tests/                # Tests
```

## Flux de données

1. L'utilisateur accède à l'application via URL GAS
2. L'authentification est gérée par Firebase Auth
3. Les données sont lues/écrites directement dans Firestore depuis le client
4. Les opérations complexes ou sensibles passent par:
   - API GAS (`google.script.run`)
   - Cloud Functions Firebase

## Points techniques importants

- Les transactions Firestore sont utilisées pour garantir la cohérence des données
- Les listeners Firestore permettent les mises à jour en temps réel
- Les Cloud Functions déchargent GAS pour les opérations lourdes
- Cloud Operations (Stackdriver) est utilisé pour le logging et monitoring

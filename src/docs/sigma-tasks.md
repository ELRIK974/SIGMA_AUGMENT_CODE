# Checklist de Développement SIGMA

Ce document liste les tâches à accomplir pour le développement de SIGMA. Suivre l'ordre suggéré et vérifier les dépendances avant de commencer une tâche. 

**Instructions :**

1. Choisir la tâche non cochée la plus prioritaire selon les besoins actuels.
2. S'assurer que toutes les dépendances (tâches prérequises) sont cochées.

**Légende :**

*  [  ] : Tâche à faire
*  [x] : Tâche terminée
* (Prérequis : X.Y) : Indique la ou les tâches à compléter avant de commencer celle-ci.
* (CLOUD FUNCTION) : Indique qu'une Cloud Function est impliquée/requise.

🔥## 1. Configuration Initiale et Environnement

*Objectif :* Établir les fondations techniques robustes du projet.

🔥 ### 1.1 Projet Firebase et Services GCP (Prérequis : None)

*   [x] Créer un nouveau projet Firebase et activer Firestore (mode production), Firebase Storage, Firebase Authentication.
*  [x] **(CLOUD FUNCTION) Activer les API Google Cloud Operations (Logging, Monitoring) dans le projet GCP associé.**
*   [x ] Configurer la région Firestore/Functions (Europe).
*   [x ] Créer/configurer les environnements (développement, production si 


🔥 ### 1.2 Projet Google Apps Script et CLASP (Prérequis : None)

*    [ [x ] Installer Node.js, npm, CLASP, Firebase CLI.
*    [ [x ]  Créer un projet Apps Script, initialiser CLASP (`.clasp.json`, `appsscript.json`).
*    [x] Configurer les services avancés et scopes OAuth nécessaires.
*   

🔥 ### 1.3 Définition Structure Dépôts (Prérequis : None)

*   [x] Créer la structure selon l'Architecture Globale Révisée (incluant `firebase/functions`, `tests`, etc.).


🔥 ### 1.4 Configuration et test de la base

*   [x] Créer `src/js/firebaseUtils.js` (init Firebase, `getFirestoreInstance`, `getAuthInstance`, `getFunctionsInstance`).
*   [x] Gérer les clés API Firebase de manière sécurisée (Properties Service GAS ou config).
*   [x] Créer `src/server/Code.gs` (point d'entrée `doGet`, `include`).
*    [x] (CLOUD FUNCTION) Mettre en place une fonction de logging basique vers Cloud Operations (`console.log` dans GAS, fonction utilitaire JS client).
*   [x] **Initialiser Firebase dans le projet local (`firebase init firestore functions storage emulators`).**
*  [x] **Configurer `firebase.json` pour les émulateurs (Firestore, Auth, Functions, Storage, PubSub si besoin).**
*  [x] **Créer/adapter `firestore.rules`, `storage.rules` et `firestore.indexes.json` (fichiers vides ou de base).**
*   [x] **Vérifier le démarrage des émulateurs (`firebase emulators:start`).**


🔥### 1.5 Tests et vérification de base

*   [x]Mettre en place une fonction de test dans le fichier firebasUtils pour vérifier que l’initialisation à bien été faite
*   [x] **Tester la connexion Firebase via `firebaseUtils.js` pointant vers les émulateurs.**
*   [x] **Effectuer des opérations CRUD basiques sur Firestore via les émulateurs.**
*   [x] **Vérifier que les logs initiaux (Client JS, GAS) apparaissent dans Cloud Logging.**
*   Ajout de la fonction : firebasUtils.testInitialisation()
Parfait ! Voici une version améliorée de la section 2 de la checklist, optimisée pour une meilleure interaction avec Augment Code, en intégrant les principes discutés (plus de détails, séparation conception/implémentation, tests spécifiques, références) :

---

🔥 ## 2. Authentification et Gestion des Utilisateurs/Rôles

*Objectif :* Sécuriser l’accès à SIGMA et définir les permissions des utilisateurs.

🔸 ### 2.1 Configuration Initiale Firebase Authentication (Prérequis: 1.1)

*   [x] Activer les fournisseurs d'authentification dans la console Firebase (Google fortement recommandé, Email/Password si nécessaire).
*   [x] Configurer les paramètres de session, les modèles d'emails (si Email/Pass activé), et les options de sécurité de base dans Firebase Auth.
*   [ ] **Vérification Initiale (Manuelle/Simple Test):**
    *   [ ] Confirmer la possibilité de créer un utilisateur via le(s) fournisseur(s) activé(s) (en utilisant l'émulateur Auth ou un test simple).
    *   [ ] Vérifier la configuration de la région/langue des emails d'authentification (si applicable).

🔸### 2.2 Stratégie de Gestion des Rôles (Prérequis: 1.1)

*   [x] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Choisir la stratégie de stockage et de gestion des rôles :
    *   ( ) **Option A:** Collection `users` dans Firestore (champ `role`).
    *   ( ) **Option B:** Firebase Custom Claims (gérés par Cloud Function).
    *   *Justification du choix documentée ici ou dans @docs/Architecture.md:* [Votre justification ici]
*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Définir et documenter précisément les permissions pour chaque rôle (`admin`, `regisseur`, `utilisateur`) dans `@docs/Permissions.md`. Lister quelles actions/collections chaque rôle peut lire/écrire.

🔸### 2.3 Interface Utilisateur (UI) - Authentification & Admin (Prérequis: 1.2, 1.4, 2.1)

*Interface de connexion et section administration des utilisateurs.*

*   [ ] **Création Fichiers de Base:**
    *   [ ] Créer `src/html/login.html` (structure HTML de base pour le formulaire).
    *   [ ] Créer `src/js/auth.js` (logique JS pour la page de connexion).
    *   [ ] Créer `src/html/admin/users.html` (structure HTML de base pour la liste/gestion utilisateurs).
    *   [ ] Créer `src/js/admin/users.js` (logique JS pour la page admin utilisateurs).
*   [ ] **Implémentation Flux Connexion (`login.html` / `auth.js`):**
    *   [ ] Ajouter le bouton/mécanisme "Connexion avec Google" (appel SDK Firebase Auth `signInWithPopup` ou          `       signInWithRedirect`).
    *   [ ] (Si Email/Pass activé) Implémenter le formulaire de connexion Email/Password (appel SDK `signInWithEmailAndPassword`).
    *   [ ] Gérer l'affichage des états (chargement, connecté, déconnecté) et la redirection après succès.
    *   [ ] Implémenter la gestion et l'affichage des erreurs d'authentification courantes.
    *   [ ] (Si Email/Pass activé) Implémenter le flux "Mot de passe oublié" (appel SDK `sendPasswordResetEmail`).
*   [ ] **Implémentation UI Admin Utilisateurs (`admin/users.html` / `admin/users.js`):**
    *   [ ] Afficher la liste des utilisateurs depuis Firestore (si Option A) ou via une Cloud Function (si Option B).
    *   [ ] (Si Option A) Permettre la modification du champ `role` via l'interface (ex: dropdown).
    *   [ ] (Si Option B) Ajouter un bouton/mécanisme pour appeler la Cloud Function qui modifie les Custom Claims d'un utilisateur.
    *   [ ] Ajouter la gestion des erreurs et confirmations pour les actions admin.

🔸### 2.4 Logique Backend & Sécurité (Prérequis: 2.2, @docs/Permissions.md)

*Mise en place de la logique serveur/sécurité pour gérer les rôles et protéger les données.*

*   [ ] **Implémenter Stockage/Gestion Rôle (selon choix 2.2):**
    *   [ ] *(Si Option A)* Définir la structure de la collection `users` dans `@docs/DataModel.md` et/ou `@docs/schemas/users.json`.
    *   [ ] *(Si Option A)* Créer/Modifier `src/js/domain/usersData.js` pour inclure les fonctions de lecture/écriture de base pour la collection `users` (utilisé par `admin/users.js`).
    *   [ ] *(Si Option B)* Développer la Cloud Function (`firebase/functions/`) nécessaire pour assigner/modifier les Custom Claims (ex: une fonction callable `setUserRole`).
    *   [ ] *(Si Option B)* Potentiellement, développer une Cloud Function `onCreateUser` pour assigner un rôle par défaut.
*   [ ] **Écrire Règles de Sécurité Firestore (`firebase/firestore.rules`):**
    *   [ ] Implémenter les règles d'accès pour les collections principales (emprunts, stocks, modules, etc.) basées sur `request.auth.uid` et le rôle (`request.auth.token.role` si Custom Claims, ou lecture du document `users/{request.auth.uid}` si Option A).
    *   [ ] S'assurer que les règles reflètent fidèlement les permissions définies dans `@docs/Permissions.md`.
    *   [ ] Ajouter la validation des données (`request.resource.data`) dans les règles pour les écritures critiques (ex: vérifier le type de `role` si Option A).

🔸### 2.5 Tests d'Intégration & Vérification (Prérequis: 2.3, 2.4, Emulateurs démarrés)

*Vérifier que l'authentification, la gestion des rôles et les règles de sécurité fonctionnent comme prévu.*

*   [ ] **Tester Flux Authentification (UI & Emulateurs):**
    *   [ ] Vérifier la connexion/déconnexion via Google (et Email/Pass si activé) depuis `login.html`.
    *   [ ] Confirmer que l'état de connexion est correctement reflété dans l'UI.
    *   [ ] Tester l'affichage des messages d'erreur en cas d'échec de connexion.
*   [ ] **Tester Accès aux Pages (UI & Emulateurs):**
    *   [ ] Tenter d'accéder à `admin/users.html` (ou autre page protégée) sans être connecté -> Doit rediriger vers `login.html` ou afficher une erreur.
    *   [ ] Se connecter avec un rôle `utilisateur` et tenter d'accéder à `admin/users.html` -> Doit être refusé (page blanche, erreur, ou message d'accès refusé selon l'implémentation).
    *   [ ] Se connecter avec un rôle `admin` -> Doit pouvoir accéder à `admin/users.html`.
*   [ ] **Tester Actions Admin (UI & Emulateurs):**
    *   [ ] (Si UI admin implémentée) Se connecter en tant qu'admin et tester la modification du rôle d'un autre utilisateur. Vérifier que le changement est persisté (Firestore ou Custom Claim via Emulateurs UI).
*   [ ] **Tester Règles Firestore (Simulateur & Tests d'Intégration Emulateurs):**
    *   [ ] Utiliser le Simulateur de Règles Firebase pour tester des scénarios clés (lecture/écriture par chaque rôle sur des collections sensibles).
    *   [ ] **(Actionable pour Agent)** Écrire des tests d'intégration (ex: avec `firebase-functions-test` ou des scripts JS) qui utilisent les émulateurs pour simuler des lectures/écritures avec différents UID/rôles et valider le comportement attendu des règles.




🔥 ## 3. Dashboard avec Vue d'Ensemble (Onglet "Résumé")

*Objectif :* Offrir une vue globale et synthétique en temps réel de l'état du matériel, des opérations en cours et des alertes importantes via des listeners Firestore.
*(Prérequis: 1.4, 1.5, Potentiellement 2.4 pour certains rôles/accès si déjà implémenté)*

🔸### 3.1 Structure UI & Fichiers de Base (Prérequis: 1.2, 1.4)

*   [ ] Créer `src/html/index.html`:
    *   Mettre en place la structure HTML de base (responsive, accessible via Bootstrap 5).
    *   Définir des conteneurs (divs avec ID spécifiques) pour chacun des 7 tableaux du résumé (réf: @docs/L'onglet_Résumé_de_SIGMA.md).
*   [ ] Créer/Modifier `src/css/styles.css` (et wrapper `css_styles.html`):
    *   Ajouter des styles spécifiques au dashboard si nécessaire (ex: indicateurs visuels pour alertes).
*   [ ] Créer `src/js/dashboard.js`:
    *   Logique principale du dashboard (initialisation, gestionnaires d'événements UI si besoin).
    *   Responsable de l'appel des fonctions de rendu UI.
*   [ ] Créer `src/js/domain/dashboardData.js`:
    *   Logique de récupération et de traitement des données Firestore pour le dashboard.
    *   Contiendra les fonctions avec les listeners `onSnapshot`.
*   [ ] Créer les wrappers JS (`js_dashboard.html`, `js_dashboardData.html`, etc.) pour inclusion dans `index.html` via `Code.gs`.

🔸### 3.2 Récupération Données Temps Réel (`dashboardData.js`) (Prérequis: 3.1, @docs/DataModel.md, @docs/L'onglet_Résumé_de_SIGMA.md)

*Objectif :* Implémenter la logique pour écouter les changements Firestore et préparer les données pour chaque tableau.*

*   [ ] **Définir Fonctions de Récupération:** Pour chaque tableau du résumé, créer une fonction dans `dashboardData.js` (ex: `listenStockAlerts(callback)`, `listenOverdueLoans(callback)`, etc.).
*   [ ] **Implémenter Listeners Firestore (`onSnapshot`):**
    *   Dans chaque fonction, implémenter le listener `onSnapshot` correspondant à la collection et aux filtres nécessaires (ex: `stocks` where `quantite <= seuil_alerte`, `emprunts` where `statut == 'Parti'` and `dateRetour < now`).
    *   **Optimiser les requêtes:** Utiliser `where`, `orderBy`, `limit` judicieusement pour ne récupérer que les données strictement nécessaires.
    *   Gérer les erreurs de lecture Firestore.
*   [ ] **Traiter et Transmettre les Données:**
    *   Dans le callback `onSnapshot`, traiter les `snapshot.docs` pour extraire/formater les données utiles à l'affichage.
    *   Appeler la fonction `callback` passée en paramètre avec les données traitées (ex: un tableau d'objets pour le tableau UI).

🔸### 3.3 Mise à Jour Dynamique de l'UI (`dashboard.js` & `index.html`) (Prérequis: 3.1, 3.2, `src/js/uiUtils.js`)

*Objectif :* Mettre à jour l'interface utilisateur dynamiquement lorsque de nouvelles données sont reçues.*

*   [ ] **Initialiser les Listeners:** Dans `dashboard.js`, appeler les fonctions de `dashboardData.js` en leur passant des fonctions de rappel (callbacks) pour gérer les mises à jour UI.
*   [ ] **Implémenter Fonctions de Rendu UI:** Créer des fonctions dans `dashboard.js` (ex: `renderStockAlertsTable(data)`, `renderOverdueLoansTable(data)`).
*   [ ] **Manipuler le DOM:**
    *   Dans les fonctions de rendu, cibler les conteneurs HTML définis en 3.1 (`document.getElementById(...)`).
    *   Vider le contenu précédent du tableau.
    *   Itérer sur les `data` reçues.
    *   Pour chaque item, **utiliser `uiUtils.js`** pour créer les éléments HTML (ex: `<tr>`, `<td>`) de manière cohérente et réutilisable.
    *   Ajouter les éléments créés au DOM.
*   [ ] **Gérer États Vides/Chargement:** Afficher des messages appropriés ("Chargement...", "Aucune alerte de stock") lorsque les données sont en cours de chargement ou qu'il n'y a rien à afficher.

🔸### 3.4 Configuration Index & Tests Performance (Prérequis: 3.2, Emulateurs démarrés)

*   [ ] **Identifier Requêtes Complexes:** Lister les requêtes Firestore utilisées en 3.2 qui nécessitent des index composites (plusieurs `where`, `orderBy` sur champ différent du `where`).
*   [ ] **Définir Index:** Mettre à jour `firebase/firestore.indexes.json` avec les définitions des index composites nécessaires. Déployer les index (`firebase deploy --only firestore:indexes`).
*   [ ] **Tester Performance Requêtes (Emulateurs):**
    *   **(Actionable Agent/Humain)** Créer un script ou utiliser l'UI des émulateurs pour injecter un volume significatif de données de test (ex: 500+ stocks, 100+ emprunts avec différents statuts/dates).
    *   Charger le dashboard et mesurer le temps de chargement initial des données pour chaque tableau.
    *   Monitorer le nombre de lectures Firestore via l'UI des émulateurs lors du chargement.
    *   Vérifier les logs des émulateurs ou la console Firebase (si déployé en test) pour confirmer l'utilisation des index.

🔸### 3.5 Vérification Fonctionnelle Globale (Prérequis: 3.3, 3.4, Emulateurs avec données test)

*   [ ] **Valider Contenu Tableaux:** Vérifier manuellement que les données affichées dans chaque des 7 tableaux correspondent exactement aux données de test injectées dans les émulateurs et aux règles définies dans @docs/L'onglet_Résumé_de_SIGMA.md.
*   [ ] **Tester Réactivité Temps Réel:** Modifier/Ajouter/Supprimer des données pertinentes directement via l'UI des émulateurs (ex: faire passer un stock sous le seuil, ajouter un emprunt en retard) et vérifier que le tableau correspondant sur le dashboard se met à jour quasi instantanément sans rafraîchissement manuel.
*   [ ] **Vérifier Cohérence Visuelle:** S'assurer que le style CSS est correctement appliqué et que l'affichage est cohérent

Okay, voici une version améliorée de la section 4 "Gestion des Emprunts" de la checklist, optimisée pour Augment Code :

---

🔥 ## 4. Gestion des Emprunts

*Objectif :* Implémenter le cycle de vie complet de la gestion des emprunts, de la création à la facturation, en assurant la cohérence des données et une interface utilisateur fonctionnelle.

*(Prérequis: Sections 1 & 2 complétées, Emulateurs prêts)*

🔸 ### 4.1 Conception & Préparation (Prérequis: @docs/DataModel.md, @docs/SpecFonctionnelle_Emprunts.md)

*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Définir et documenter précisément les statuts des emprunts (`Pas prêt`, `Prêt`, `Parti`, `Revenu`, `Inventorié`, `Facturé`, etc.) et les transitions valides entre eux dans `@docs/StatutsEmprunts.md`.
*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Finaliser le modèle de données pour la collection `emprunts` (et sous-collections si nécessaire) dans `@docs/DataModel.md` et `@docs/schemas/emprunts.json`.
*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Identifier précisément quelles logiques seront gérées par :
    *   Client-Side JS (validation formulaire, appels API, màj UI simple)
    *   Server-Side GAS (`EmpruntsAPI.gs` - orchestration, appels simples)
    *   Firestore Transactions (Départ/Retour atomique)
    *   Cloud Functions (PDF, Notifications planifiées, Facturation complexe) -> Lister les CFs prévues.

🔸 ### 4.2 Interface Utilisateur (UI) - Emprunts (Prérequis: 4.1, Base UI [ex: Bootstrap])

*   [ ] **Création Fichiers de Base & Wrappers:**
    *   [ ] Créer `src/html/emprunts/list.html`, `create.html`, `detail.html`, `associateModules.html`.
    *   [ ] Créer `src/js/emprunts/list.js`, `create.js`, `detail.js`, `associateModules.js`.
    *   [ ] Créer les wrappers JS/HTML correspondants (`js_emprunts_*.html`).
*   [ ] **Implémentation UI - Liste (`list.html` / `list.js`):**
    *   [ ] Afficher la liste des emprunts depuis Firestore (avec chargement initial et potentiellement `onSnapshot`).
    *   [ ] Implémenter les filtres (par statut, date, secteur - Côté client ou via requêtes Firestore optimisées).
    *   [ ] Implémenter la pagination (côté client ou basée sur les curseurs Firestore).
    *   [ ] Ajouter les boutons/liens d'action (Voir détail, Créer nouveau).
*   [ ] **Implémentation UI - Création (`create.html` / `create.js`):**
    *   [ ] Mettre en place la structure du formulaire HTML (responsive, Bootstrap).
    *   [ ] Implémenter la logique multi-étapes si nécessaire (Ex: 1. Infos Base -> 2. Matériel -> 3. Validation).
    *   [ ] Ajouter la validation des champs côté client (dates, champs requis).
    *   [ ] Implémenter la sélection de matériel/modules (potentiellement appel à Firestore pour lister les dispos).
    *   [ ] Gérer la sauvegarde (appel API GAS/CF).
    *   [ ] (Optionnel) Implémenter la sauvegarde de brouillon (localStorage ou Firestore).
*   [ ] **Implémentation UI - Détail (`detail.html` / `detail.js`):**
    *   [ ] Afficher les informations détaillées d'un emprunt spécifique depuis Firestore.
    *   [ ] Utiliser des onglets ou sections pour organiser l'info (Général, Matériel, Historique, Actions).
    *   [ ] Afficher l'historique des changements de statut/modifications (si stocké).
    *   [ ] Ajouter les boutons d'actions contextuels (Valider départ, Marquer comme revenu, etc.).
*   [ ] **Implémentation UI - Association Modules (`associateModules.html` / `associateModules.js`):**
    *   [ ] Afficher la liste des modules disponibles/pertinents pour l'emprunt.
    *   [ ] Permettre la sélection/désélection et la sauvegarde de l'association.

🔸 ### 4.3 Logique Serveur - API GAS (`src/server/EmpruntsAPI.gs`) (Prérequis: 4.1, 4.2)

*   [ ] Créer le fichier `src/server/EmpruntsAPI.gs`.
*   [ ] Implémenter les fonctions GAS appelables via `google.script.run` pour :
    *   [ ] Créer/Mettre à jour un emprunt (logique simple, peut appeler CF pour complexité).
    *   [ ] Récupérer la liste des emprunts (avec filtres/pagination si géré côté serveur).
    *   [ ] Récupérer les détails d'un emprunt.
    *   [ ] **Orchestrer l'appel** aux transactions Firestore pour Départ/Retour (passer les bons paramètres).
    *   [ ] **Orchestrer l'appel** aux Cloud Functions (ex: demander génération PDF étiquette).

🔸 ### 4.4 Logique Backend - Firestore & Cloud Functions (Prérequis: 4.1, 4.3)

*   [ ] **Implémenter Transaction Départ (`firebase/functions/` ou logique appelée par GAS):**
    *   [ ] Vérifier statut actuel de l'emprunt (`Prêt`).
    *   [ ] Démarrer transaction Firestore.
    *   [ ] Mettre à jour le statut de l'emprunt -> `Parti`.
    *   [ ] Mettre à jour le statut/localisation du matériel/modules associés (si nécessaire).
    *   [ ] Valider la transaction. Gérer les erreurs atomiquement.
*   [ ] **Implémenter Transaction Retour (`firebase/functions/` ou logique appelée par GAS):**
    *   [ ] Vérifier statut actuel de l'emprunt (`Parti`).
    *   [ ] Démarrer transaction Firestore.
    *   [ ] Mettre à jour le statut de l'emprunt -> `Revenu`.
    *   [ ] (Optionnel) Mettre à jour le statut/localisation du matériel/modules associés.
    *   [ ] Valider la transaction. Gérer les erreurs atomiquement.
*   [ ] **(CLOUD FUNCTION)** Développer la Cloud Function `generateLabelPDF(empruntId)` (callable ou HTTP).
*   [ ] **(CLOUD FUNCTION)** Développer la Cloud Function `checkOverdueLoans()` (planifiée - Pub/Sub Schedule) pour notifier/marquer les retards.
*   [ ] **(CLOUD FUNCTION)** Développer la Cloud Function `generateBillingPDF(empruntId)` (callable ou HTTP) pour facturation matériel manquant.

🔸 ### 4.5 Tests d'Intégration & Vérification (Prérequis: 4.2, 4.3, 4.4, Emulateurs démarrés)

*   [ ] **Tester Cycle de Vie Basique (UI & Emulateurs):**
    *   [ ] Créer un emprunt via l'UI (`create.html`), vérifier sa présence dans Firestore (Emulator UI) et dans `list.html`.
    *   [ ] Modifier l'emprunt créé, vérifier les mises à jour.
    *   [ ] Associer un module via l'UI (`associateModules.html`), vérifier la liaison dans Firestore.
*   [ ] **Tester Transaction Départ (Emulator UI / Script de Test):**
    *   [ ] Mettre un emprunt au statut `Prêt`.
    *   [ ] Déclencher l'action de départ (via UI ou appel direct API GAS/Fonction).
    *   [ ] Vérifier (via Emulator UI ou lecture Firestore) que le statut de l'emprunt est `Parti` ET que les màj matériel/modules (si définies) sont correctes, le tout de manière atomique.
*   [ ] **Tester Transaction Retour (Emulator UI / Script de Test):**
    *   [ ] Mettre un emprunt au statut `Parti`.
    *   [ ] Déclencher l'action de retour.
    *   [ ] Vérifier (via Emulator UI ou lecture Firestore) que le statut de l'emprunt est `Revenu` et autres màj atomiques.
*   [ ] **Tester Cloud Functions (Emulator / `firebase-functions-test`):**
    *   [ ] Appeler `generateLabelPDF` avec un ID d'emprunt valide/invalide, vérifier la sortie (log, PDF simulé si possible).
    *   [ ] Déclencher (manuellement via Emulator ou attendre) `checkOverdueLoans`, vérifier les logs/notifications/màj de statut.
    *   [ ] Appeler `generateBillingPDF`, vérifier la sortie.
*   [ ] **Tester Appels API GAS (Client JS & Emulateurs):**
    *   [ ] Depuis le JS client (`list.js`, `create.js`, etc.), appeler les fonctions de `EmpruntsAPI.gs` et vérifier que les données attendues sont retournées ou que les actions sont bien déclenchées (via logs ou état Firestore).
*   [ ] **Valider Transitions de Statut:** Vérifier que les actions UI/API ne permettent que les transitions valides définies dans `@docs/StatutsEmprunts.md`.



Okay, voici une version améliorée et plus détaillée de la section 5 "Gestion des Stocks et Inventaire", optimisée pour l'interaction avec Augment Code :

---

🔥 ## 5. Gestion des Stocks et Inventaire

*Objectif :* Mettre en place une gestion fiable et en temps réel des articles en stock (consommables et durables), incluant le suivi des mouvements, les alertes de seuil, les suggestions de réassort et les exports.

*(Prérequis: Sections 1 & 2 complétées, @docs/DataModel.md [section Stocks], Emulateurs prêts)*

🔸 ### 5.1 Conception & Préparation (Prérequis: @docs/DataModel.md, @docs/SpecFonctionnelle_Stocks.md)

*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Finaliser le modèle de données pour la collection `stocks` et la sous-collection `mouvements` dans `@docs/DataModel.md` et `@docs/schemas/stocks.json`. Inclure les champs clés : `nom`, `description`, `categorie` ('Consommable', 'Durable'), `quantite`, `seuilAlerte`, `localisation`, `fournisseurRef` (optionnel), `tags` (optionnel).
*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Définir précisément le mécanisme de déclenchement des alertes de stock bas :
    *   ( ) Option A: Vérification *dans* la transaction Firestore qui modifie la `quantite`.
    *   ( ) Option B: Via une Cloud Function déclenchée sur l'écriture (`onWrite` ou `onUpdate`) du document `stocks/{stockId}`.
    *   *Documenter le choix et ses implications (ex: coût, latence).*
*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Identifier la répartition de la logique :
    *   Client JS : Validation formulaires, affichage dynamique (listeners), appels API simples.
    *   Server GAS (`StocksAPI.gs`) : API pour CRUD simple, orchestration appels transaction/CF.
    *   Firestore Transaction : Logique atomique de mise à jour `quantite` + création `mouvement`.
    *   Cloud Functions : Suggestions réassort, rapports complexes, potentiellement trigger alertes (Option B).

🔸 ### 5.2 Interface Utilisateur (UI) - Stocks (Prérequis: 5.1, Base UI [ex: Bootstrap])

*   [ ] **Création Fichiers de Base & Wrappers:**
    *   [ ] Créer `src/html/stocks/list.html`, `edit.html`.
    *   [ ] Créer `src/js/stocks/list.js`, `edit.js`.
    *   [ ] Créer les wrappers JS/HTML correspondants (`js_stocks_*.html`).
*   [ ] **Implémentation UI - Liste (`list.html` / `list.js`):**
    *   [ ] Afficher la liste des articles depuis Firestore (utiliser `onSnapshot` pour mises à jour temps réel).
    *   [ ] Implémenter filtres (par catégorie, localisation, stock bas [basé sur `quantite <= seuilAlerte`], tags). Requêtes Firestore optimisées.
    *   [ ] Implémenter pagination ou chargement infini.
    *   [ ] Ajouter indicateur visuel pour les stocks en alerte.
    *   [ ] Ajouter boutons/liens (Modifier, Voir Mouvements, Créer Nouveau).
*   [ ] **Implémentation UI - Ajout/Modification (`edit.html` / `edit.js`):**
    *   [ ] Mettre en place formulaire HTML (responsive, Bootstrap).
    *   [ ] Implémenter validation client (champs requis, types numériques pour quantité/seuil).
    *   [ ] Permettre ajout/gestion de tags (si implémenté).
    *   [ ] Lier à la sélection de fournisseur (si pertinent).
    *   [ ] Gérer sauvegarde via appel à `StocksAPI.gs`. Afficher confirmations/erreurs.

🔸 ### 5.3 Logique Serveur - API GAS (`src/server/StocksAPI.gs`) (Prérequis: 5.1, 5.2)

*   [ ] Créer le fichier `src/server/StocksAPI.gs`.
*   [ ] Implémenter fonctions GAS (`google.script.run`) pour :
    *   [ ] `getStockItems(filters, paginationOptions)` : Récupérer la liste filtrée/paginée.
    *   [ ] `getStockItem(stockId)` : Récupérer les détails d'un article.
    *   [ ] `saveStockItem(itemData)` : Créer ou mettre à jour un article (ne modifie PAS la quantité directement, sauf création initiale).
    *   [ ] `getStockMovements(stockId, paginationOptions)` : Récupérer l'historique des mouvements.
    *   [ ] `recordManualStockAdjustment(stockId, quantiteChange, motif)` : Fonction pour ajustements manuels qui **appelle la logique de transaction Firestore**.

🔸 ### 5.4 Logique Backend - Firestore & Cloud Functions (Prérequis: 5.1, 5.3)

*   [ ] **Implémenter Logique Transaction `recordStockMovement` (dans CF ou appelée par GAS/autre CF):**
    *   [ ] Fonction acceptant `stockId`, `quantiteChange` (peut être négatif), `typeMouvement` (ex: 'Retour Emprunt', 'Ajustement Manuel', 'Sortie Consommable'), `details` (ex: empruntId).
    *   [ ] Démarrer transaction Firestore.
    *   [ ] Lire le document `stocks/{stockId}`.
    *   [ ] Calculer la nouvelle `quantite`. Valider (`>= 0`).
    *   [ ] **(Si Option A pour alertes)** Vérifier si `nouvelleQuantite <= seuilAlerte`. Mettre à jour un champ `enAlerte: true/false` sur le doc stock.
    *   [ ] Mettre à jour le document `stocks/{stockId}` avec la nouvelle `quantite` (et potentiellement `enAlerte`).
    *   [ ] Créer un nouveau document dans la sous-collection `stocks/{stockId}/mouvements` avec `timestamp`, `quantiteChange`, `typeMouvement`, `details`.
    *   [ ] Valider la transaction. Gérer les erreurs atomiquement.
*   [ ] **(Si Option B pour alertes) (CLOUD FUNCTION)** Développer Cloud Function `checkStockAlertOnWrite(change, context)` :
    *   [ ] Trigger `onWrite` sur `stocks/{stockId}`.
    *   [ ] Comparer `quantite` avant/après.
    *   [ ] Si `quantite` passe sous `seuilAlerte`, déclencher action (ex: notification, mise à jour autre champ).
*   [ ] **(CLOUD FUNCTION)** Développer Cloud Function `suggestReorders()` (planifiée ou callable) :
    *   [ ] Lire les stocks (filtrer ceux en alerte ou proches).
    *   [ ] Analyser potentiellement l'historique `mouvements` pour calculer vélocité.
    *   [ ] Retourner une liste d'articles à réapprovisionner avec quantités suggérées.

🔸 ### 5.5 Exports & Statistiques (Prérequis: 5.1)

*   [ ] **Export CSV Simple (Client JS - `src/js/stocks/reports.js`):**
    *   [ ] Fonction pour exporter la liste actuelle (filtrée) affichée dans `list.html`.
*   [ ] **(CLOUD FUNCTION) Rapports Complexes :**
    *   [ ] Développer CF `generateStockValuationReport()` : Calcule la valeur totale du stock (si prix unitaire stocké).
    *   [ ] Développer CF `generateConsumptionReport(period)` : Analyse les mouvements sortants sur une période donnée.

🔸 ### 5.6 Tests d'Intégration & Vérification (Prérequis: 5.2, 5.3, 5.4, Emulateurs démarrés)

*   [ ] **Tester CRUD Articles (UI & Emulateurs):**
    *   [ ] Créer un article via `edit.html`/`StocksAPI.gs`, vérifier dans Firestore (Emulator UI) et `list.html`.
    *   [ ] Modifier l'article, vérifier la mise à jour.
    *   [ ] Tenter de supprimer (ou désactiver) l'article.
*   [ ] **Tester Transaction `recordStockMovement` (Script de Test / Emulator UI):**
    *   [ ] Appeler la logique (ex: via `recordManualStockAdjustment`) pour une entrée et une sortie.
    *   [ ] Vérifier atomiquement via Emulator UI / lecture Firestore :
        *   La `quantite` du stock est correcte.
        *   Un document `mouvement` est créé dans la sous-collection avec les bonnes infos.
*   [ ] **Tester Déclenchement Alertes (Selon Option Choisie en 5.1):**
    *   [ ] Simuler une transaction faisant passer `quantite` sous `seuilAlerte`.
    *   [ ] *(Si Option A)* Vérifier que le champ `enAlerte` (ou équivalent) est mis à jour dans le document stock via Emulator UI.
    *   [ ] *(Si Option B)* Vérifier les logs de la Cloud Function trigger et l'action effectuée (notification simulée, champ mis à jour).
*   [ ] **Tester Cloud Functions Stocks (Emulator / `firebase-functions-test`):**
    *   [ ] Appeler `suggestReorders` avec des données de stock mock, vérifier la structure et la pertinence de la sortie.
    *   [ ] Appeler les CF de rapports (`generateStockValuationReport`, etc.), vérifier la sortie (logs, structure data retournée).
*   [ ] **Tester Appels API GAS (Client JS & Emulateurs):**
    [ ] Appeler `getStockItems`, `saveStockItem` depuis le JS client et vérifier les données retournées et l'état Firestore.




Okay, voici une version améliorée et plus détaillée de la section 6 "Système de Modules", optimisée pour l'interaction avec Augment Code, en suivant les principes que nous avons établis :

---

🔥 ## 6. Gestion des Modules

*Objectif :* Mettre en place la création, la modification, l'organisation et le suivi des modules (ensembles de matériel préconfigurés), en assurant la cohérence avec les stocks et la gestion des états.

*(Prérequis: Sections 1, 2, 5 [Stocks] complétées, Emulateurs prêts)*

🔸 ### 6.1 Conception & Préparation (Prérequis: @docs/DataModel.md, @docs/SpecFonctionnelle_Modules.md)

*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Finaliser le modèle de données pour la collection `modules` dans `@docs/DataModel.md` et `@docs/schemas/modules.json`. Inclure champs clés: `code` (unique), `nom`, `description`, `secteur`, `conteneurRef` (optionnel), `contenu` (ex: tableau d'objets `{ stockId: '...', quantite: X }`), `estPret` (boolean), `coutEstime` (number), `sousModulesRefs` (si applicable).
*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Définir précisément comment le statut `estPret` est géré :
    *   ( ) Option A: Mis à jour uniquement lors des opérations de modification du `contenu` du module (ajout/retrait d'items) via transaction.
    *   ( ) Option B: Option A + Vérification via Cloud Function Trigger (ex: `onUpdate` sur `modules/{moduleId}`) si des changements externes (stock bas d'un item contenu) doivent impacter `estPret`.
    *   *Documenter le choix et ses implications.*
*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Identifier la répartition de la logique :
    *   Client JS : Affichage listes/détails, validation formulaires, déclenchement actions (API/CF).
    *   Server GAS (`ModulesAPI.gs`) : API simple pour CRUD, orchestration appels Transaction/CF.
    *   Firestore Transaction : Logique atomique pour Création/Modification (màj `contenu` & `estPret`), Démantèlement (màj module & stocks).
    *   Cloud Functions : Génération PDF inventaire, Calcul de coût (si complexe), Duplication (si complexe), potentiellement trigger `estPret` (Option B). Lister les CFs prévues.

🔸 ### 6.2 Interface Utilisateur (UI) - Modules (Prérequis: 6.1, Base UI [ex: Bootstrap])

*   [ ] **Création Fichiers de Base & Wrappers:**
    *   [ ] Créer `src/html/modules/list.html`, `edit.html`.
    *   [ ] Créer `src/js/modules/list.js`, `edit.js`, `print.js` (pour déclencher l'impression).
    *   [ ] Créer les wrappers JS/HTML correspondants (`js_modules_*.html`).
*   [ ] **Implémentation UI - Liste (`list.html` / `list.js`):**
    *   [ ] Afficher la liste des modules depuis Firestore (utiliser `onSnapshot` pour màj temps réel état `estPret`).
    *   [ ] Implémenter filtres (par statut `estPret`, secteur) et recherche (par nom, code). Requêtes Firestore optimisées.
    *   [ ] Implémenter pagination.
    *   [ ] Ajouter indicateur visuel clair pour le statut `estPret`.
    *   [ ] Ajouter boutons/liens (Modifier, Dupliquer, Démanteler, Imprimer Inventaire).
*   [ ] **Implémentation UI - Ajout/Modification (`edit.html` / `edit.js`):**
    *   [ ] Mettre en place formulaire HTML (responsive, Bootstrap).
    *   [ ] Implémenter validation client (champs requis).
    *   [ ] **Implémenter sélection/ajout/suppression d'items de stock pour le `contenu`** (avec quantité). Nécessite recherche/liste d'items de stock (appel `StocksAPI.getStockItems`?).
    *   [ ] (Si applicable) Gérer sélection/ajout de sous-modules.
    *   [ ] Gérer sauvegarde via appel à `ModulesAPI.gs`. Afficher confirmations/erreurs.
*   [ ] **Implémentation UI - Impression Inventaire (`print.js`):**
    *   [ ] Ajouter un gestionnaire d'événement au bouton "Imprimer Inventaire".
    *   [ ] Au clic, appeler la fonction `ModulesAPI.gs` qui déclenche la Cloud Function de génération PDF (`generateModuleInventoryPDF`).
    *   [ ] Gérer l'affichage/téléchargement du PDF retourné (ou lien vers celui-ci si stocké dans Storage).

🔸 ### 6.3 Logique Serveur - API GAS (`src/server/ModulesAPI.gs`) (Prérequis: 6.1, 6.2)

*   [ ] Créer le fichier `src/server/ModulesAPI.gs`.
*   [ ] Implémenter fonctions GAS (`google.script.run`) pour :
    *   [ ] `getModules(filters, paginationOptions)` : Récupérer liste filtrée/paginée.
    *   [ ] `getModuleDetails(moduleId)` : Récupérer détails d'un module.
    *   [ ] `saveModule(moduleData)` : **Orchestre** l'appel à la logique de transaction Firestore pour créer/mettre à jour un module (y compris màj `estPret`).
    *   [ ] `dismantleModule(moduleId)` : **Orchestre** l'appel à la logique de transaction Firestore pour démanteler (màj module & stocks).
    *   [ ] `duplicateModule(moduleId)` : **Orchestre** l'appel à la logique (Transaction ou CF) pour dupliquer.
    *   [ ] `triggerGenerateInventoryPDF(moduleId)` : **Orchestre** l'appel à la Cloud Function `generateModuleInventoryPDF`.

🔸 ### 6.4 Logique Backend - Firestore & Cloud Functions (Prérequis: 6.1, 6.3)

*   [ ] **Implémenter Logique Transaction `saveModuleTransaction` (dans CF ou appelée par GAS):**
    *   [ ] Fonction acceptant `moduleId` (si update) et `moduleData` (incluant `contenu`).
    *   [ ] Démarrer transaction Firestore.
    *   [ ] Si création : Générer `code` unique si besoin, écrire nouveau doc.
    *   [ ] Si update : Lire le doc `modules/{moduleId}`.
    *   [ ] Mettre à jour les champs du module avec `moduleData`.
    *   [ ] **Mettre à jour le statut `estPret` (selon Option A ou B de 6.1).** (Ex: si contenu modifié, potentiellement `estPret = false` jusqu'à réassort manuel?)
    *   [ ] Valider la transaction. Gérer erreurs atomiquement.
*   [ ] **Implémenter Logique Transaction `dismantleModuleTransaction` (dans CF ou appelée par GAS):**
    *   [ ] Fonction acceptant `moduleId`.
    *   [ ] Démarrer transaction Firestore.
    *   [ ] Lire le doc `modules/{moduleId}` pour récupérer le `contenu`.
    *   [ ] Pour chaque item dans `contenu`, **appeler la logique `recordStockMovement` (de Section 5)** pour retourner la `quantite` au stock.
    *   [ ] Mettre à jour/supprimer le doc `modules/{moduleId}`.
    *   [ ] Valider la transaction. Gérer erreurs atomiquement.
*   [ ] **Implémenter Logique Duplication (`duplicateModuleTransactionOrCF`):**
    *   [ ] (Décider si Transaction ou CF basée sur complexité).
    *   [ ] Lire le module original.
    *   [ ] Créer un nouveau document avec un `nom`/`code` modifié (ex: "Copie de ...").
    *   [ ] Copier les références du `contenu` et autres champs pertinents.
    *   [ ] Potentiellement initialiser `estPret` à `false`.
*   [ ] **(CLOUD FUNCTION)** Développer Cloud Function `calculateModuleCost(moduleId)` (callable ou trigger `onWrite`?):
    *   [ ] Lire doc `modules/{moduleId}` pour le `contenu`.
    *   [ ] Pour chaque `stockId` dans `contenu`, lire le prix depuis la collection `stocks`.
    *   [ ] Calculer le coût total et mettre à jour le champ `coutEstime` sur le doc `modules/{moduleId}`.
*   [ ] **(CLOUD FUNCTION)** Développer Cloud Function `generateModuleInventoryPDF(moduleId)` (callable ou HTTP):
    *   [ ] Lire doc `modules/{moduleId}` et les détails des items du `contenu` depuis `stocks`.
    *   [ ] Générer un PDF (ex: avec `pdfmake`) listant le contenu.
    *   [ ] Retourner le PDF ou un lien vers le fichier stocké dans Firebase Storage.
*   [ ] **(Si Option B pour `estPret`) (CLOUD FUNCTION)** Développer CF Trigger `checkModuleReadinessOnUpdate(change, context)`:
    *   [ ] Déclencher sur `onUpdate` de `modules/{moduleId}` ou sur `onWrite` de `stocks/{stockId}`.
    *   [ ] Implémenter la logique de vérification complexe si nécessaire.

🔸 ### 6.5 Tests d'Intégration & Vérification (Prérequis: 6.2, 6.3, 6.4, Emulateurs démarrés)

*   [ ] **Tester CRUD Modules (UI & Emulateurs):**
    *   [ ] Créer un module via `edit.html`/`ModulesAPI.gs`, vérifier dans Firestore (Emulator UI) et `list.html`.
    *   [ ] Modifier le `contenu` et les infos, vérifier la mise à jour.
*   [ ] **Tester Transaction Démantèlement (Script de Test / Emulator UI):**
    *   [ ] Appeler la logique `dismantleModule`.
    *   [ ] Vérifier atomiquement via Emulator UI / lecture Firestore :
        *   Le module est MàJ/supprimé.
        *   Les `quantite` des items de stock correspondants sont correctement incrémentées.
        *   Des documents `mouvement` de type 'Retour Module' sont créés dans `stocks/{stockId}/mouvements`.
*   [ ] **Tester Duplication (UI / Script / Emulator):**
    *   [ ] Déclencher la duplication.
    *   [ ] Vérifier qu'un nouveau module existe dans Firestore avec les bonnes données.
*   [ ] **Tester Mise à Jour Statut `estPret` (Emulator UI / Scénario):**
    *   [ ] Effectuer une action qui doit changer `estPret` (selon décision 6.1, ex: modifier `contenu`).
    *   [ ] Vérifier que le champ `estPret` est correctement mis à jour dans Firestore.
*   [ ] **Tester Cloud Functions Modules (Emulator / `firebase-functions-test`):**
    *   [ ] Appeler `generateModuleInventoryPDF`, vérifier la sortie PDF (simulée) ou le log.
    *   [ ] Appeler `calculateModuleCost`, vérifier que le champ `coutEstime` est mis à jour dans Firestore.
    *   [ ] (Si applicable) Tester le trigger `checkModuleReadinessOnUpdate`.
*   [ ] **Tester Appels API GAS (Client JS & Emulateurs):**
    [ ] Appeler `getModules`, `saveModule`, `dismantleModule` depuis le JS client et vérifier les données retournées et l'état Firestore/Stock.



Okay, voici une version améliorée et plus détaillée de la section 7 "Suivi des Livraisons", optimisée pour l'interaction avec Augment Code :

---

🔥 ## 7. Suivi des Livraisons

*Objectif :* Planifier, suivre en temps réel et confirmer les livraisons physiques du matériel lié aux emprunts, en incluant la gestion des preuves et potentiellement une vue cartographique.

*(Prérequis: Sections 1, 2, 4 [Emprunts] complétées, Emulateurs prêts)*

🔸 ### 7.1 Conception & Préparation (Prérequis: @docs/DataModel.md, @docs/SpecFonctionnelle_Livraisons.md)

*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Finaliser le modèle de données pour la collection `livraisons` dans `@docs/DataModel.md` et `@docs/schemas/livraisons.json`. Inclure champs clés: `empruntRef` (lien vers l'emprunt), `datePlanifiee`, `adresseLivraison`, `contactLivraison`, `statut` (`Planifiée`, `En Cours`, `Livrée`, `Problème`, `Annulée`), `chauffeurAttribue` (optionnel), `vehiculeAttribue` (optionnel), `preuveLivraisonUrl` (lien Storage), `notes`.
*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Définir précisément les statuts de livraison et les transitions valides dans `@docs/StatutsLivraison.md`.
*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Choisir l'API cartographique (Google Maps, Leaflet+OpenStreetMap, etc.) et définir les fonctionnalités attendues (affichage marqueurs, calcul itinéraire simple?). Documenter dans `@docs/SpecFonctionnelle_Livraisons.md`.
*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Identifier la répartition de la logique :
    *   Client JS : Affichage listes/cartes, planification simple, déclenchement upload preuve, appels API.
    *   Server GAS (`LivraisonsAPI.gs`) : API simple pour CRUD, orchestration appels Transaction/CF.
    *   Firestore Transaction : Planification (création livraison + màj emprunt), Confirmation (màj statut + lien preuve).
    *   Firebase Storage : Stockage des preuves (photos, signatures). Règles de sécurité Storage nécessaires.
    *   Cloud Functions : Potentiellement pour notifications de statut, optimisation d'itinéraire si complexe. Lister les CFs prévues.

🔸 ### 7.2 Interface Utilisateur (UI) - Livraisons (Prérequis: 7.1, Base UI [ex: Bootstrap])

*   [ ] **Création Fichiers de Base & Wrappers:**
    *   [ ] Créer `src/html/livraisons/list.html`, `plan.html`, `detail.html` (pourrait inclure la carte), `confirm.html`.
    *   [ ] Créer `src/js/livraisons/list.js`, `plan.js`, `detail.js`, `map.js` (logique carte), `confirm.js`.
    *   [ ] Créer les wrappers JS/HTML correspondants (`js_livraisons_*.html`).
*   [ ] **Implémentation UI - Liste (`list.html` / `list.js`):**
    *   [ ] Afficher la liste des livraisons depuis Firestore (utiliser `onSnapshot` pour màj statut temps réel).
    *   [ ] Implémenter filtres (par statut, date planifiée, secteur emprunt associé) et recherche. Requêtes Firestore optimisées.
    *   [ ] Ajouter liens vers détail livraison et détail emprunt associé.
    *   [ ] Ajouter bouton "Planifier Nouvelle Livraison".
*   [ ] **Implémentation UI - Planification (`plan.html` / `plan.js`):**
    *   [ ] Formulaire pour sélectionner un emprunt éligible à la livraison.
    *   [ ] Champs pour date planifiée, adresse (potentiellement pré-remplie depuis emprunt), contact, notes, attribution chauffeur/véhicule (optionnel).
    *   [ ] Validation client et appel à `LivraisonsAPI.gs` pour enregistrer la planification.
*   [ ] **Implémentation UI - Détail & Carte (`detail.html` / `detail.js` / `map.js`):**
    *   [ ] Afficher les détails de la livraison (statut, infos planification, lien emprunt).
    *   [ ] Intégrer la carte interactive (via API choisie en 7.1).
    *   [ ] Afficher un marqueur pour l'adresse de livraison.
    *   [ ] (Optionnel) Afficher l'itinéraire depuis le dépôt.
    *   [ ] Afficher les boutons d'action contextuels (ex: "Marquer En Cours", "Confirmer Livraison").
*   [ ] **Implémentation UI - Confirmation (`confirm.html` / `confirm.js`):**
    *   [ ] Section pour mettre à jour le statut final (`Livrée`, `Problème`).
    *   [ ] **Composant/Bouton pour uploader la preuve de livraison** (photo/signature) vers Firebase Storage.
    *   [ ] Champ pour notes de confirmation.
    *   [ ] Appel à `LivraisonsAPI.gs` pour finaliser la confirmation.

🔸 ### 7.3 Logique Serveur - API GAS (`src/server/LivraisonsAPI.gs`) (Prérequis: 7.1, 7.2)

*   [ ] Créer le fichier `src/server/LivraisonsAPI.gs`.
*   [ ] Implémenter fonctions GAS (`google.script.run`) pour :
    *   [ ] `getDeliveries(filters, paginationOptions)` : Récupérer liste filtrée/paginée.
    *   [ ] `getDeliveryDetails(deliveryId)` : Récupérer détails.
    *   [ ] `planDelivery(planningData)` : **Orchestre** l'appel à la transaction Firestore de planification.
    *   [ ] `updateDeliveryStatus(deliveryId, newStatus, notes)` : Met à jour le statut (peut appeler transaction si atomique avec autre chose).
    *   [ ] `confirmDelivery(deliveryId, confirmationData)` : **Orchestre** l'appel à la transaction Firestore de confirmation (inclut `preuveLivraisonUrl`).

🔸 ### 7.4 Logique Backend - Firestore & Storage (Prérequis: 7.1, 7.3)

*   [ ] **Implémenter Logique Transaction `planDeliveryTransaction` (appelée par GAS):**
    *   [ ] Fonction acceptant `empruntId` et `deliveryData`.
    *   [ ] Démarrer transaction Firestore.
    *   [ ] Lire le document `emprunts/{empruntId}` pour vérifier son état.
    *   [ ] Créer un nouveau document dans `livraisons` avec `deliveryData` et statut `Planifiée`.
    *   [ ] Mettre à jour le document `emprunts/{empruntId}` pour lier la livraison (ex: champ `deliveryId`, maj statut si pertinent).
    *   [ ] Valider la transaction. Gérer erreurs atomiquement.
*   [ ] **Implémenter Logique Transaction `confirmDeliveryTransaction` (appelée par GAS):**
    *   [ ] Fonction acceptant `deliveryId` et `confirmationData` (incluant `preuveLivraisonUrl`).
    *   [ ] Démarrer transaction Firestore.
    *   [ ] Lire le document `livraisons/{deliveryId}`.
    *   [ ] Mettre à jour le statut (ex: `Livrée`), `preuveLivraisonUrl`, et les notes de confirmation.
    *   [ ] Valider la transaction. Gérer erreurs atomiquement.
*   [ ] **Configurer Règles de Sécurité Firebase Storage (`firebase/storage.rules`):**
    *   [ ] Autoriser l'écriture des preuves de livraison uniquement aux utilisateurs authentifiés (potentiellement avec un rôle spécifique, ex: `regisseur` ou `chauffeur`).
    *   [ ] Définir la structure de stockage (ex: `livraisons/{deliveryId}/preuve.jpg`).
    *   [ ] Gérer les permissions de lecture des preuves.

🔸 ### 7.5 Tests d'Intégration & Vérification (Prérequis: 7.2, 7.3, 7.4, Emulateurs démarrés)

*   [ ] **Tester Transaction Planification (Script de Test / Emulator UI):**
    *   [ ] Appeler la logique `planDelivery`.
    *   [ ] Vérifier atomiquement via Emulator UI / lecture Firestore :
        *   Un document `livraison` est créé avec le bon statut et les bonnes données.
        *   Le document `emprunt` associé est mis à jour correctement.
*   [ ] **Tester Mise à Jour Statut (UI & Emulateurs):**
    *   [ ] Depuis l'UI (`detail.html`), changer le statut d'une livraison (ex: vers `En Cours`).
    *   [ ] Vérifier la mise à jour dans Firestore et sur l'UI (`list.html` si `onSnapshot` actif).
*   [ ] **Tester Upload Preuve & Transaction Confirmation (UI & Emulateurs):**
    *   [ ] Depuis l'UI (`confirm.html`), uploader un fichier de test vers l'émulateur Storage.
    *   [ ] Valider la confirmation.
    *   [ ] Vérifier atomiquement via Emulator UI / lecture Firestore :
        *   Le statut de la livraison est mis à jour (ex: `Livrée`).
        *   Le champ `preuveLivraisonUrl` contient le lien correct vers le fichier dans l'émulateur Storage.
*   [ ] **Tester Récupération/Affichage Preuve (UI & Emulateurs):**
    *   [ ] S'assurer qu'un lien/bouton dans l'UI (`detail.html`?) permet d'afficher la preuve stockée (tester l'accès via l'URL fournie par l'émulateur Storage).
*   [ ] **Tester Intégration Carte (Mocks / E2E Limité):**
    *   [ ] Vérifier que la carte s'affiche dans `detail.html`.
    *   [ ] Vérifier (potentiellement avec des données mockées) que le marqueur s'affiche à l'adresse attendue. (Les tests E2E complets peuvent être complexes/coûteux).
*   [ ] **Tester Appels API GAS (Client JS & Emulateurs):**
    [ ] Appeler `getDeliveries`, `planDelivery`, `confirmDelivery`, etc., depuis le JS client et vérifier les données retournées et l'état Firestore/Storage.



Okay, voici une version améliorée et plus détaillée de la section 8 "Rapports et Exports", optimisée pour l'interaction avec Augment Code :

---

🔥 ## 8. Rapports et Exports

*Objectif :* Fournir des capacités d'exportation de données et de génération de rapports personnalisés et planifiés, en s'appuyant sur les Cloud Functions pour les traitements complexes ou asynchrones.

*(Prérequis: Sections principales [Emprunts, Stocks, Modules] largement complétées, Modèles de données finalisés [@docs/DataModel.md], Emulateurs prêts)*

🔸 ### 8.1 Conception & Préparation (Prérequis: @docs/SpecFonctionnelle_Rapports.md si existant)

*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Définir précisément le contenu, les paramètres (filtres, dates), et le format de sortie (CSV, PDF, Excel, JSON) pour chaque rapport identifié (Emprunts, Stock, Modules, etc.). Documenter dans `@docs/SpecFonctionnelle_Rapports.md`.
*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Choisir la stratégie de déclenchement et de livraison pour les rapports complexes :
    *   Déclenchement : Via UI -> API GAS -> Cloud Function Callable ? Directement via Cloud Function HTTP ?
    *   Livraison : Téléchargement direct ? Lien vers fichier dans Firebase Storage/GCS ? Envoi par email ?
*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Définir la configuration pour les rapports planifiés (fréquence, destinataires, format).
*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Identifier les bibliothèques Node.js à utiliser dans les Cloud Functions pour la génération des fichiers (ex: `papaparse` pour CSV, `pdfmake` pour PDF, `exceljs` pour Excel).

🔸 ### 8.2 Interface Utilisateur (UI) - Rapports (Prérequis: 8.1)

*   [ ] **Création Fichiers de Base & Wrappers:**
    *   [ ] Créer `src/html/reports.html`.
    *   [ ] Créer `src/js/reports/main.js`.
    *   [ ] Créer les wrappers JS/HTML correspondants.
*   [ ] **Implémentation UI - Centre de Rapports (`reports.html` / `main.js`):**
    *   [ ] Lister les rapports disponibles (statiques et potentiellement générés/planifiés).
    *   [ ] Pour chaque rapport à la demande :
        *   [ ] Afficher les options/paramètres de personnalisation (champs de date, filtres de statut, etc.).
        *   [ ] Ajouter un bouton "Générer le Rapport".
    *   [ ] (Optionnel) Section pour gérer les rapports favoris/fréquents.
    *   [ ] (Optionnel) Section pour visualiser/gérer les rapports planifiés.
    *   [ ] Afficher l'état de la génération (ex: "En cours...", "Prêt pour téléchargement", "Erreur").
*   [ ] **Implémentation Logique Client (`main.js`):**
    *   [ ] Gérer la récupération des paramètres saisis par l'utilisateur.
    *   [ ] Implémenter l'appel à l'API GAS (ou directement à la CF callable/HTTP) pour déclencher la génération du rapport.
    *   [ ] Gérer la réception du résultat (lien de téléchargement, affichage d'erreur, etc.).
    *   [ ] **(Pour Exports CSV Simples)** Implémenter la logique de récupération des données (via API GAS existantes?) et de génération/téléchargement CSV directement dans le client.

🔸 ### 8.3 Logique Serveur - API GAS (Orchestration - Si nécessaire) (Prérequis: 8.1, 8.2)

*   [ ] (Si la stratégie choisie est UI -> GAS -> CF) Créer `src/server/ReportsAPI.gs`.
*   [ ] Implémenter les fonctions GAS (`google.script.run`) pour :
    *   [ ] `triggerReportGeneration(reportType, params)` : Fonction qui reçoit la demande du client et **appelle la Cloud Function Callable appropriée** en passant les paramètres. Gérer les réponses/erreurs de la CF.

🔸 ### 8.4 Logique Backend - Cloud Functions (Génération à la demande) (Prérequis: 8.1, 8.3)

*   [ ] **Développer Cloud Function(s) Callable/HTTP pour les Rapports Complexes :**
    *   [ ] `generateLoanReport(params)`: Génère export Emprunts (PDF/Excel). Doit lire Firestore, appliquer filtres (`params`), formater les données, générer le fichier (avec lib choisie), et retourner un lien GCS/Storage ou les données binaires.
    *   [ ] `generateStockReport(params)`: Génère rapport Stock/Inventaire (valorisation, stats). Logique similaire.
    *   [ ] `generateModuleReport(params)`: Génère rapport Modules (utilisation, coûts). Logique similaire.
    *   [ ] `generateDataExport(params)`: Génère export JSON complexe. Logique similaire.
    *   **Note:** Sécuriser les fonctions (vérifier authentification/rôle de l'appelant). Gérer les erreurs de génération robustement.

🔸 ### 8.5 Logique Backend - Cloud Functions (Planification) (Prérequis: 8.1)

*   [ ] **Développer Firebase Scheduled Functions dans `firebase/functions/scheduledReports.js`:**
    *   [ ] `scheduledDailyLoanSummary()`: Exemple de fonction planifiée. Lire les données pertinentes de Firestore, générer le rapport (format défini en 8.1), et l'envoyer par email ou le stocker dans GCS/Storage.
    *   [ ] Implémenter d'autres fonctions planifiées selon les besoins définis en 8.1.
*   [ ] **Configurer la Planification:** Définir les fréquences (`schedule`) dans `firebase.json` ou via la console GCP Cloud Scheduler.
*   [ ] **Gérer les Cibles:** Configurer l'envoi d'email (via SendGrid, etc.) ou les permissions d'écriture vers GCS/Storage.

🔸 ### 8.6 Tests d'Intégration & Vérification (Prérequis: 8.2, 8.3, 8.4, 8.5, Emulateurs démarrés)

*   [ ] **Tester Génération CSV Client (UI):**
    *   [ ] Déclencher l'export CSV simple depuis l'UI et vérifier le contenu/format du fichier téléchargé.
*   [ ] **Tester Cloud Functions de Génération (Emulateurs / `firebase-functions-test`):**
    *   [ ] Invoquer chaque CF de rapport (Callable/HTTP) via l'émulateur avec différents `params` (cas nominaux, vides, limites).
    *   [ ] **Vérifier les logs** de la fonction pour les erreurs.
    *   [ ] **Examiner le fichier généré** (stocké dans l'émulateur Storage/GCS ou vérifier la structure de la réponse) pour confirmer le contenu et le format.
*   [ ] **Tester Scheduled Functions (Emulateurs / Déploiement Test):**
    *   [ ] Déclencher manuellement l'exécution via l'interface des émulateurs ou attendre l'heure planifiée (en déploiement test).
    *   [ ] Vérifier les logs et le résultat (email reçu, fichier dans GCS/Storage).
*   [ ] **Tester le Flux Complet (UI -> API -> CF -> Résultat):**
    *   [ ] Utiliser l'interface utilisateur (`reports.html`) pour générer un rapport complexe.
    *   [ ] Vérifier que l'état s'affiche correctement ("En cours...", "Prêt").
    *   [ ] Vérifier que le résultat final (lien de téléchargement, etc.) est correct et fonctionnel.



Okay, voici une version améliorée et plus détaillée de la section 9 "Maintenance, Sauvegarde et Observabilité", optimisée pour l'interaction avec Augment Code :

---

🔥 ## 9. Maintenance, Sauvegarde et Observabilité

*Objectif :* Mettre en place les systèmes et procédures pour assurer la stabilité, la résilience et la surveillance de l'application SIGMA sur le long terme.

*(Prérequis: Sections principales complétées, Accès GCP configuré)*

🔸 ### 9.1 Sauvegarde & Restauration (Firestore)

*Assurer la capacité de sauvegarder et restaurer les données critiques.*

*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Définir la stratégie de sauvegarde : Utiliser l'export planifié géré par GCP ou une Cloud Function personnalisée ? (Recommandé : Export géré). Documenter la fréquence (ex: quotidienne) et la politique de rétention dans GCS (ex: 7 jours, 30 jours).
*   [ ] **(CLOUD FUNCTION/GCP CONFIG)** Mettre en place la Sauvegarde Automatique :
    *   *(Si Export Géré)* Configurer l'export planifié Firestore vers un bucket GCS via la console GCP ou `gcloud`.
    *   *(Si CF Personnalisée)* Développer la Cloud Function planifiée `triggerFirestoreBackup` qui utilise l'API Admin pour lancer un export vers GCS.
*   [ ] **(GCP CONFIG)** Configurer les permissions IAM nécessaires pour que le service d'export ou la CF puisse écrire dans le bucket GCS désigné.
*   [ ] **(GCP CONFIG)** Configurer la politique de rétention sur le bucket GCS cible.
*   [ ] **(DÉCISION & DOCUMENTATION - Humain/Mentor)** Définir et documenter la procédure de restauration Firestore depuis une sauvegarde GCS. Préciser les étapes manuelles (`gcloud` ou Console GCP) et les précautions (restaurer vers un projet *test* d'abord).
*   [ ] **(Optionnel - CLOUD FUNCTION/SCRIPT)** Développer un script `gcloud` ou une Cloud Function (callable, sécurisée) `initiateFirestoreRestore(backupPath)` pour faciliter le déclenchement de la restauration (principalement pour environnements de test).

🔸 ### 9.2 Observabilité (Logging, Monitoring, Alerting)

*Mettre en place les outils pour comprendre le comportement de l'application et détecter les problèmes.*

*   [ ] **Implémenter Logging Structuré (Client JS):**
    *   [ ] Créer fonction utilitaire `logClientEvent(level, message, contextData)` dans `src/js/utils/logger.js`.
    *   [ ] Intégrer des appels `logClientEvent` pour les erreurs (try/catch), les actions utilisateur clés (connexion, sauvegarde, etc.), en incluant l'UID et des données contextuelles si possible.
*   [ ] **Améliorer Logging Serveur (GAS & CF):**
    *   [ ] (GAS) Utiliser `console.log`, `console.warn`, `console.error` de manière structurée (ex: `console.log(JSON.stringify({ message: '...', userId: '...', data: ... }))`) dans les fichiers `.gs` critiques.
    *   [ ] (CF) Utiliser les fonctions de logging intégrées (`functions.logger.info`, `.warn`, `.error`) dans le code Node.js, en incluant des données structurées.
*   [ ] **(GCP CONFIG)** Configurer Métriques Clés (Cloud Monitoring):
    *   [ ] Identifier et suivre les métriques pertinentes : Nombre d'exécutions/erreurs des CFs critiques, Latence lectures/écritures Firestore, Utilisation des quotas GAS (si possible via métriques custom ou logs).
*   [ ] **(GCP CONFIG)** Configurer Alertes (Cloud Monitoring):
    *   [ ] Mettre en place des politiques d'alerte pour : Taux d'erreur élevé des CFs, Latence Firestore anormale, Erreurs spécifiques dans les logs (via filtres), Approche des limites de quota GAS.
    *   [ ] Définir les canaux de notification (Email, PagerDuty, Slack...).

🔸 ### 9.3 Maintenance Opérationnelle

*Fournir des outils pour la gestion et la maintenance courante.*

*   [ ] **Implémenter UI Admin - Maintenance (`admin/maintenance.html`, `js/admin/maintenance.js`):**
    *   [ ] Ajouter des boutons/contrôles pour déclencher des actions manuelles (ex: "Lancer une sauvegarde maintenant" via appel CF, "Vider cache X", etc.).
    *   [ ] Afficher l'état du système (ex: statut du mode maintenance).
*   [ ] **Implémenter Mode Maintenance:**
    *   [ ] (Firestore) Créer un document de configuration (ex: `config/status`) avec un champ `maintenanceEnabled: boolean`.
    *   [ ] (Client JS) Créer `src/js/utils/maintenanceChecker.js` qui lit ce flag au démarrage et affiche un bandeau/bloque l'UI si activé.
    *   [ ] (Serveur GAS/CF) Ajouter une vérification de ce flag au début des fonctions critiques si nécessaire.

🔸 ### 9.4 Vérification Fonctionnelle (Maintenance & Observabilité) (Prérequis: 9.1, 9.2, 9.3, Emulateurs/Test Env)

*Valider que les systèmes mis en place fonctionnent comme attendu.*

*   [ ] **Tester Sauvegarde Firestore:**
    *   [ ] Déclencher une sauvegarde (manuellement via UI Admin ou attendre/simuler la planification).
    *   [ ] Vérifier la présence du fichier de sauvegarde dans le bucket GCS attendu.
*   [ ] **Tester Restauration Firestore (ESSENTIEL - dans un environnement de TEST isolé):**
    *   [ ] Suivre la procédure documentée (9.1) pour restaurer une sauvegarde vers un projet Firebase de test.
    *   [ ] Vérifier l'intégrité et la présence des données restaurées.
*   [ ] **Vérifier Logs Cloud Logging:**
    *   [ ] Effectuer des actions dans l'UI (connexion, erreur simulée).
    *   [ ] Exécuter une fonction GAS et une Cloud Function.
    *   [ ] Consulter Cloud Logging et confirmer la présence des logs structurés provenant de JS, GAS, et CF avec les informations attendues.
*   [ ] **Tester Alertes Cloud Monitoring:**
    *   [ ] Simuler une condition d'alerte (ex: générer des erreurs dans une CF, dépasser un seuil).
    *   [ ] Vérifier la réception de la notification via le canal configuré.
*   [ ] **Valider Mode Maintenance:**
    *   [ ] Activer le mode maintenance via Firestore (ou UI Admin).
    *   [ ] Recharger l'application et vérifier que l'accès est bloqué/restreint comme prévu.
    *   [ ] Désactiver le mode et vérifier le retour à la normale.
*   [ ] **Tester Actions UI Admin Maintenance:**
    *   [ ] Utiliser les boutons de l'UI Admin (ex: déclencher sauvegarde) et vérifier que l'action correspondante est bien exécutée (via logs ou état système).




Okay, la mise en place d'une CI/CD est une étape clé ! Voici une version améliorée de la section 10, plus détaillée et structurée pour mieux guider le processus, même si la configuration CI/CD elle-même est souvent une tâche de configuration manuelle ou assistée par l'Agent pour des *parties* spécifiques du script.

---

🔥 ## 10. Mise en Place CI/CD (Continuous Integration / Continuous Deployment)

*Objectif :* Automatiser les processus de test, de build et de déploiement pour améliorer la qualité, la fiabilité et la fréquence des livraisons.

*(Prérequis: Code source géré dans Git, Tests unitaires et d'intégration (avec émulateurs) fonctionnels localement)*

🔸 ### 10.1 Fondations & Choix Stratégiques

*   [ ] **(DÉCISION - Humain/Mentor)** Configurer le dépôt Git : S'assurer que le dépôt (ex: GitHub, GitLab, Bitbucket) est prêt et que le code y est poussé.
*   [ ] **(DÉCISION - Humain/Mentor)** Choisir et configurer l'outil CI/CD : Sélectionner la plateforme (ex: GitHub Actions, GitLab CI, Google Cloud Build) et effectuer la configuration initiale (liaison au dépôt, activation).
*   [ ] **(DÉCISION - Humain/Mentor)** Définir et documenter la stratégie de branches : Choisir un modèle (ex: Gitflow, GitHub Flow) et s'assurer qu'il est compris par l'équipe. Définir quelles branches déclenchent quels workflows CI/CD (ex: push sur `develop` lance tests, push/tag sur `main`/`release` lance déploiement).

🔸 ### 10.2 Définition & Implémentation du Pipeline

*Création du fichier de configuration du pipeline (ex: `.github/workflows/main.yml`, `cloudbuild.yaml`).*

*   [ ] **Définir les Déclencheurs (Triggers):** Configurer quand le pipeline doit s'exécuter (ex: `on: push: branches: [main, develop]`, `on: pull_request`).
*   [ ] **Étape 1: Environnement & Installation :**
    *   [ ] Configurer l'environnement d'exécution (ex: `runs-on: ubuntu-latest`).
    *   [ ] Action de checkout du code (`actions/checkout@vX`).
    *   [ ] Mettre en place Node.js (`actions/setup-node@vX`).
    *   [ ] Installer les dépendances Node.js (`npm ci` pour `firebase/functions/` et potentiellement pour des outils racine).
    *   [ ] Installer les outils CLI requis (`npm install -g firebase-tools @google/clasp`).
*   [ ] **Étape 2: Qualité du Code :**
    *   [ ] Exécuter le Linting (ex: `npm run lint`).
    *   [ ] Exécuter le Formatage (ex: `npm run format:check`).
*   [ ] **Étape 3: Tests Automatisés :**
    *   [ ] Exécuter les Tests Unitaires (ex: `npm test --prefix firebase/functions`, tests JS client si applicable).
    *   [ ] **Configurer et Exécuter les Tests d'Intégration avec Firebase Emulators :**
        *   *(Nécessite potentiellement un service ou une action pour démarrer les émulateurs dans le CI)*.
        *   Exécuter le script de test d'intégration qui utilise les émulateurs (ex: `npm run test:integration`).
*   [ ] **Étape 4: Build (si nécessaire) :**
    *   [ ] Compiler le code TypeScript des Cloud Functions (si utilisé).
    *   [ ] Autres étapes de build spécifiques au projet.
*   [ ] **Étape 5: Déploiement (Conditionné par la branche/tag) :**
    *   [ ] **Déployer les composants Firebase (`firebase deploy`) :**
        *   Déployer *uniquement* ce qui est nécessaire (ex: `--only functions,firestore:rules,firestore:indexes,storage`).
        *   Gérer les différents environnements Firebase (dev/prod) via des configurations ou des secrets.
    *   [ ] **Déployer le code Google Apps Script (`clasp push`) :**
        *   Assurer l'authentification de CLASP via un fichier `.clasprc.json` généré ou des variables d'environnement.
        *   Potentiellement, créer une nouvelle version GAS après le push.

🔸 ### 10.3 Sécurité & Validation du Pipeline

*   [ ] **Gérer les Secrets de manière Sécurisée :**
    *   Configurer les secrets nécessaires dans l'outil CI/CD (ex: `FIREBASE_TOKEN`, secrets pour l'authentification CLASP, clés API spécifiques à l'environnement).
    *   S'assurer qu'aucun secret n'est écrit en clair dans les logs du pipeline.
*   [ ] **Validation du Pipeline :**
    *   [ ] Déclencher manuellement ou via un push/PR une première exécution complète du pipeline.
    *   [ ] Vérifier que chaque étape s'exécute avec succès dans l'ordre défini.
    *   [ ] Confirmer que les artefacts (code déployé sur GAS, fonctions/règles Firebase) sont correctement mis à jour dans l'environnement cible (développement d'abord).
    *   [ ] Effectuer des vérifications post-déploiement simples (smoke tests) pour s'assurer que l'application de base fonctionne après un déploiement CI/CD.



## 11. Tests Continus et Assurance Qualité

*Objectif :* s’assurer de la qualité du code en permanence

### 11.1 Mise en place

*Définir les tests et leurs objectif *
*   \[ \] **Maintenir et enrichir les tests unitaires (logique pure).**
*   \[ \] **Prioriser les tests d'intégration avec les Firebase Emulators (flux métier, transactions, règles, functions).**
*   \[ \] Développer des tests UI ciblés pour les composants critiques/complexes.
*   \[ \] **Définir une stratégie pour tester le code serveur GAS (`.gs`)** (mocks, tests manuels ciblés, privilégier logique dans Cloud Functions si testabilité complexe).
*   \[ \] *(Optionnel)* Mettre en place quelques tests E2E pour les flux utilisateurs clés.

### 11.2 vérification et intégration

*Vérification que les tests sont correcte et leurs intégration dans le workflow*
*   \[ \] **Intégrer tous les tests automatisés dans le pipeline CI/CD.**
*   \[ \] Mettre en place la revue de code systématique.
*   \[ \] Monitorer la couverture de test (si pertinent).
*   \[ \] Effectuer des tests de non-régression avant chaque release.
*   \[ \] Planifier des sessions de tests manuels exploratoires.
*   \[ \] **Effectuer des tests de performance ciblés.**

## 12. Déploiement Final et Accompagnement

*Objectif :* préparer le projet pour le lancement

### 12.1 préparation

*Préparation du lancement*
*   \[ \] Valider la configuration de l'environnement de production.
*   \[ \] Finaliser les listes de vérification pré/post-déploiement.
*   \[ \] Confirmer les scripts/procédures de migration de données (si applicable).
*   \[ \] Finaliser la procédure de rollback.

### 12.2 Mise en Production

*Le lancement du projet*
*   \[ \] Communiquer le plan de déploiement aux utilisateurs.
*   \[ \] Exécuter le déploiement en production (idéalement via CI/CD).
*   \[ \] Effectuer les vérifications post-déploiement (smoke tests).
*   \[ \] Monitorer activement l'application après le déploiement (Cloud Operations).


### 12.3 la gestion des utilisateurs

*Gestion des formations *
*   \[ \] Finaliser les supports de formation (guides, tutoriels).
*   \[ \] Mener les sessions de formation pour les différents rôles.
*   \[ \] Mettre en place le plan de support post-déploiement.
*   \[ \] Collecter le feedback utilisateur initial.

## 13. Gestion de Projet et Suivi 

*Objectif :* suivi constant de l’évolution

### 13.1 Méthodologie et organisation
### 13.2 Gestion des risques
### 13.3 Communication et reporting

## 14. Évolutivité et Maintenance Future (Identique à l'original)

*Objectif :* Assurer la viabilité du projet sur le long terme

### 14.1 Architecture évolutive
### 14.2 Monitoring et amélioration continue
### 14.3 Plan de maintenance

## 15. Fonctionnalités Spécifiques au Métier (Identique à l'original)

*Objectif :* L’adaptation aux besoins

### 15.1 Gestion de la durée de vie du matériel
### 15.2 Gestion des fournisseurs
### 15.3 Gestion des événements et animations




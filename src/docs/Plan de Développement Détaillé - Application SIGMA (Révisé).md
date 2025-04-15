Plan de Développement Détaillé - Application SIGMA (Révisé)
Introduction
Ce document présente un plan de développement complet et révisé pour SIGMA, intégrant les meilleures pratiques et outils pour assurer la robustesse, la maintenabilité et la performance de l'application. Il s'appuie sur une architecture Firebase et Google Apps Script, optimisée pour les besoins identifiés.
Sommaire des Tâches et Sous-Tâches - Projet SIGMA
(Le sommaire reste globalement le même, mais les détails des tâches sont enrichis)
Configuration Initiale et Environnement
Authentification et Gestion des Utilisateurs/Rôles
Dashboard avec Vue d'Ensemble (Onglet "Résumé")
Gestion des Emprunts
Gestion des Stocks et Inventaire
Système de Modules
Suivi des Livraisons
Rapports et Exports (Optimisés Cloud Functions)
Maintenance, Sauvegarde et Observabilité
Mise en Place CI/CD et Déploiement Initial (Nouvelle phase pour structurer le déploiement)
Tests Continus et Assurance Qualité (Renforcement et intégration des tests)
(Les anciennes tâches de test sont intégrées dans chaque phase et dans la phase 11)

Chronologie et Planification des Fonctionnalités (Révisée)
1. Configuration Initiale et Environnement
Description et objectifs: Établir les fondations techniques robustes, configurer Firebase, GAS, la structure du projet, les outils de test locaux (Emulators) et l'observabilité (Cloud Operations).
Sous-tâches détaillées:
Étapes de conception:
Finaliser la structure du projet (cf. Architecture Globale Révisée).
Concevoir le schéma Firestore initial.
Planifier les règles de sécurité Firestore initiales.
Définir la stratégie de logging vers Google Cloud Operations (Stackdriver).
Planifier l'utilisation de Firebase Emulator Suite.


Étapes de développement:
1.1 Créer projet Firebase, activer Firestore (production), Storage, et configurer les API Google Cloud Operations (Logging, Monitoring).
Fichiers: Configuration Console Firebase/GCP.
Points d'attention: Régions, quotas initiaux.


1.2 Initialiser projet GAS, configurer CLASP (.clasp.json, appsscript.json).
Points d'attention: Scopes OAuth corrects.


1.3 Mettre en place la structure de dossiers complète (cf. Architecture Globale Révisée).
1.4 Créer scripts de base connexion Firebase (firebaseUtils.js, Code.gs).
Points d'attention: Gestion sécurisée clés API (via Properties Service GAS ou config).


1.5 Configurer Firebase CLI localement (firebase login, firebase init).
1.6 Configurer Firebase Emulator Suite (firebase init emulators, configuration firebase.json pour Firestore, Auth, Functions).
1.7 Mettre en place une fonction de logging basique vers Cloud Operations depuis GAS (console.log) et Client JS.


Étapes de test (TDD & Configuration):
Tester la connexion Firebase via firebaseUtils.js en utilisant les émulateurs.
Tester le démarrage et l'interaction basique avec les émulateurs (Firestore, Auth).
Vérifier que les logs initiaux apparaissent dans Google Cloud Logging.
Tester CRUD basique sur une collection test via Emulators.


Dépendances techniques et métier:
Compte Google Workspace, Node.js/npm, CLI Firebase/Clasp installés.


Estimation de la complexité: Moyenne (ajout configuration émulateurs et logging).
Livrables attendus:
Projet Firebase/GCP configuré (Firestore, Auth, Functions, Cloud Ops).
Structure de dossiers et projet CLASP initialisés.
Scripts de connexion Firebase fonctionnels.
Environnement Firebase Emulator Suite configuré et fonctionnel.
Système de logging initial vers Cloud Operations en place.
Documentation docs/setup.md mise à jour.




2. Authentification et Gestion des Utilisateurs/Rôles
Description et objectifs: Implémenter l'authentification Firebase, la gestion des rôles et sécuriser l'accès via les règles Firestore, en testant intensivement avec les émulateurs.
Sous-tâches détaillées:
Étapes de conception:
Définir structure rôles (Admin, Régisseur, Utilisateur - Clarifier permissions Utilisateur).
Choisir stratégie de stockage rôles (Firestore collection users ou Firebase Custom Claims via Cloud Function si gestion centralisée souhaitée).
Concevoir interfaces (Login, Admin Users).


Étapes de développement:
2.1 Configurer Firebase Authentication (Google fortement recommandé, email/password optionnel).
2.2 Développer interface de connexion (login.html, auth.js).
2.3 Implémenter gestion rôles (Collection users ou Custom Claims via une Cloud Function onCreateUser ou dédiée).
2.4 Développer règles sécurité Firestore (firestore.rules) basées sur rôles et UID authentifié.
2.5 Créer interface admin utilisateurs (admin/users.html, admin/users.js).


Étapes de test (TDD & Sécurité):
Tests unitaires pour fonctions auth.js.
Tester les règles de sécurité de manière exhaustive avec Firebase Emulator Suite et le simulateur de règles. Simuler différents rôles et accès non autorisés.
Tests d'interface pour scénarios de connexion/gestion utilisateurs.
Tester la création d'utilisateur et l'assignation de rôle via les émulateurs.


Dépendances: Phase 1 terminée.
Estimation de la complexité: Moyenne.
Livrables: Système d'authentification et rôles fonctionnel, interfaces, règles Firestore testées via émulateurs.


3. Dashboard avec Vue d'Ensemble (Onglet "Résumé")
Description et objectifs: Développer le dashboard temps réel, en étant vigilant sur les performances Firestore et la complexité de l'UI GAS.
Sous-tâches détaillées:
Étapes de conception:
Concevoir UI dashboard (7 tableaux).
Définir requêtes Firestore optimisées pour chaque tableau (indexes composites).
Planifier stratégies d'optimisation des listeners (requêtes ciblées, dégroupage si pertinent, limites).
(Optionnel) Évaluer si une section du dashboard bénéficierait d'un micro-framework JS.


Étapes de développement:
3.1 Développer structure HTML (index.html) - Penser à la structure pour mises à jour dynamiques.
3.2 Implémenter styles CSS (styles.css).
3.3 Développer scripts JS (dashboard.js, domain/dashboardData.js) pour récupérer données via listeners Firestore (onSnapshot).
Implémenter les 7 tableaux avec mise à jour dynamique. Utiliser uiUtils.js pour éléments répétitifs.
Implémenter debouncing/throttling si les mises à jour UI sont trop fréquentes.
3.5 Configurer indexes Firestore (firestore.indexes.json).


Étapes de test (TDD & Performance):
Tests unitaires pour les fonctions de formatage/logique dashboardData.js.
Tester le rendu et les mises à jour du dashboard avec des données simulées dans les émulateurs.
Mesurer le nombre de lectures Firestore générées par le dashboard.
Tests d'interface pour interactions (tri, filtres).


Dépendances: Phase 1 & 2. Collections Firestore de base (stocks, emprunts, modules) créées (même vides).
Estimation de la complexité: Élevée (temps réel + potentielle optimisation performance).
Livrables: Dashboard fonctionnel avec données temps réel (testées via émulateurs), indexes Firestore configurés.


4. Gestion des Emprunts
Description et objectifs: Développer le module Emprunts, en utilisant les transactions Firestore pour les opérations critiques et Cloud Functions pour la logique complexe.
Sous-tâches détaillées:
Étapes de conception:
Modéliser cycle de vie (statuts, transitions).
Concevoir interfaces (Liste, Création, Détail, Association). Noter les UI potentiellement complexes.
Structure données Firestore (collection emprunts, sous-collections historique, materiel).
Identifier clairement la logique à placer dans Cloud Functions (ex: génération étiquettes complexes, notifications de retard, calculs facturation lourds).


Étapes de développement:
4.1 UI Liste emprunts (emprunts.html, js/emprunts/list.js).
4.2 Formulaire Création (create.html, create.js). (Potentiel pour micro-framework).
4.3 UI Détail emprunt (detail.html, detail.js).
4.4 UI Association modules (modules.html, modules.js).
4.5 Logique Départ/Retour (workflow.js) utilisant des transactions Firestore. Appels via google.script.run vers EmpruntsAPI.gs.
4.6 Gestion retards (logique dans alerts.js, potentielle Cloud Function planifiée pour notifications).
4.7 Facturation (logique facturation.js, génération PDF via Cloud Function).


Étapes de test (TDD & Intégration):
Tests unitaires pour logique métier (calculs, validations).
Tester le cycle de vie complet d'un emprunt avec des scénarios complexes (erreurs, annulations) en utilisant les émulateurs Firestore et Functions.
Tester les transactions Firestore pour garantir l'atomicité.
Tester les Cloud Functions liées aux emprunts localement via Emulators.
Tests UI pour la navigation et les interactions.
Tester les appels google.script.run vers EmpruntsAPI.gs (peut nécessiter des mocks pour Firestore si test unitaire).


Dépendances: Phase 1, 2, 3. Collections modules/stocks.
Estimation de la complexité: Élevée.
Livrables: Module Emprunts complet, testé via émulateurs, documentation.


5. Gestion des Stocks et Inventaire
Description et objectifs: Développer le module Stocks, avec suivi précis des mouvements via transactions et alertes potentiellement gérées par Cloud Functions.
Sous-tâches détaillées:
Étapes de conception:
Structure données Firestore (stock, sous-collection mouvements).
Conception UI (Liste, Ajout/Modif). (Potentiel pour micro-framework sur tableau dynamique).
Planifier comment les alertes sont déclenchées (transaction Firestore + écriture alertes ou via Trigger Firestore sur Cloud Function).
Logique de suggestion réassort -> Cloud Function.


Étapes de développement:
5.1 UI Liste stocks (stocks.html, js/stocks/list.js).
5.2 Formulaires Ajout/Modif (edit.html, edit.js).
5.3 Suivi mouvements (movements.js) via transactions Firestore (ex: fonction recordStockMovement comme dans le plan initial, appelée depuis StocksAPI.gs).
5.4 Alertes/Notifications (logique alerts.js, potentiellement Cloud Function pour notifications push/email).
5.5 Export/Stats (logique reports.js, export CSV/Excel simple via JS client, générations complexes/stats via Cloud Function).
5.6 Gestion consommables/non-consommables (logique métier dans JS et .gs).


Étapes de test (TDD & Intégration):
Tests unitaires pour logique stock.
Tester les opérations CRUD et les mouvements de stock avec transactions via Emulators.
Tester la génération d'alertes (écriture dans collection alertes ou déclenchement Function) via Emulators.
Tester les Cloud Functions liées aux stocks via Emulators.
Tests UI pour filtres, recherche, alertes visuelles.


Dépendances: Phase 1, 2. Module Emprunts pour liens.
Estimation de la complexité: Élevée.
Livrables: Module Stocks complet, testé via émulateurs, documentation.


6. Système de Modules
Description et objectifs: Développer le module Modules, en assurant la cohérence lors des modifications/démantèlements via transactions.
Sous-tâches détaillées:
Étapes de conception:
Structure données Firestore (modules, sous-collection materiel, références).
Conception UI (Liste, Création/Modif, Impression).
Logique de calcul de coût -> Cloud Function si complexe ou besoin d'historique.
Logique de vérification "estPret" après modification -> Transaction Firestore ou Cloud Function Trigger.


Étapes de développement:
6.1 UI Liste modules (modules.html, js/modules/list.js).
6.2 Création/Modif (edit.html, edit.js). Transaction pour création/ajout matériel.
6.3 Démantèlement (dismantle.js) via transaction Firestore (mise à jour stock + module).
6.4 Impression inventaire (génération simple via JS/CSS print, PDF complexe via Cloud Function).
6.5 Gestion coûts (calcul simple JS, logique avancée via Cloud Function dans costs.js).
6.6 Duplication rapide (duplicate.js) via transaction ou Cloud Function.


Étapes de test (TDD & Intégration):
Tests unitaires logique module.
Tester création, modification, démantèlement, duplication avec transactions via Emulators.
Tester la mise à jour automatique du statut "estPret" via Emulators.
Tester les Cloud Functions liées aux modules via Emulators.
Tests UI pour interactions.


Dépendances: Phase 1, 2, 5. Module Emprunts.
Estimation de la complexité: Élevée.
Livrables: Module Modules complet, testé via émulateurs, documentation.


7. Suivi des Livraisons
Description et objectifs: Développer le module Livraisons, potentiellement avec des mises à jour de statut via Cloud Functions si besoin de logique externe.
Sous-tâches détaillées:
Étapes de conception:
Structure données Firestore (livraisons, liens emprunts).
Conception UI (Liste, Carte, Planification).
Intégration API cartographique.


Étapes de développement:
7.1 UI Liste livraisons (livraisons.html, js/livraisons/list.js).
7.2 Carte interactive (map.js).
7.3 Planification (plan.html, plan.js) avec transaction pour lier à l'emprunt.
7.4 Suivi état (status.js). Mise à jour via UI ou potentiellement Cloud Function si déclencheur externe.
7.5 Confirmation livraison (confirm.html, confirm.js). Stockage preuve via Firebase Storage si nécessaire.


Étapes de test (TDD & Intégration):
Tests unitaires logique livraison.
Tester le cycle de vie d'une livraison (planification, départ, confirmation) avec transactions via Emulators.
Tester l'intégration cartographique (peut nécessiter tests E2E ou mocks).
Tests UI pour carte et formulaires.


Dépendances: Phase 1, 2, 4. API cartographique configurée.
Estimation de la complexité: Moyenne.
Livrables: Module Livraisons complet, testé via émulateurs, documentation.


8. Rapports et Exports (Optimisés Cloud Functions)
Description et objectifs: Développer les exports/rapports, en déléguant systématiquement les générations lourdes ou planifiées aux Cloud Functions.
Sous-tâches détaillées:
Étapes de conception:
Identifier besoins rapports/formats.
Conception UI centrale rapports.
Définir quelles générations sont faites côté client (CSV simple) vs Cloud Functions (PDF, Excel complexe, agrégations lourdes).


Étapes de développement:
8.1 UI Centrale rapports (reports.html, js/reports/main.js).
8.2 Exports emprunts (Génération PDF/Excel via Cloud Function appelée depuis js/reports/emprunts.js).
8.3 Rapports stock/inventaire (Génération via Cloud Function).
8.4 Rapports modules (Génération via Cloud Function).
8.5 Export données brutes (CSV simple via JS client, JSON complexe/filtré via Cloud Function dans js/reports/export.js).
8.6 Rapports planifiés via Firebase Scheduled Functions (firebase/functions/scheduledReports.js).


Étapes de test (TDD & Intégration):
Tests unitaires pour logique de formatage simple côté client.
Tester les Cloud Functions de génération de rapports (structure, contenu, performance) via Emulators.
Tester les Scheduled Functions via Emulators ou déploiement test.
Vérifier les formats des fichiers exportés.


Dépendances: Modules principaux terminés. Cloud Functions setup.
Estimation de la complexité: Moyenne à Élevée (selon complexité rapports).
Livrables: Fonctionnalités de rapports/exports, Cloud Functions dédiées, documentation.


9. Maintenance, Sauvegarde et Observabilité
Description et objectifs: Mettre en place les outils et procédures pour la maintenance, en priorisant Cloud Operations pour l'observabilité et Cloud Functions/Storage pour les sauvegardes.
Sous-tâches détaillées:
Étapes de conception:
Stratégie de sauvegarde automatisée vers GCS via Cloud Function.
Stratégie de logging centralisée sur Cloud Operations. Définir niveaux et informations clés à logger.
Plan mode maintenance.
Stratégie de monitoring et alertes via Cloud Operations.


Étapes de développement:
9.1 Développer Cloud Function de sauvegarde planifiée vers GCS. Script Maintenance.gs pour actions manuelles simples.
9.2 Implémenter logging structuré vers Cloud Operations depuis Client JS, Serveur GAS (console.log), et Cloud Functions.
9.3 UI Admin maintenance (admin/maintenance.html, js/admin/maintenance.js).
9.4 Mode maintenance (js/utils/maintenanceMode.js).
9.5 Développer script/procédure de restauration depuis GCS (potentiellement via Cloud Function ou gcloud).
9.6 Configurer des métriques et alertes clés dans Cloud Monitoring.


Étapes de test (TDD & Ops):
Tester la Cloud Function de sauvegarde via Emulators (mock GCS) ou déploiement test.
Tester la procédure de restauration complète dans un environnement de test.
Vérifier que les logs de différents niveaux et sources apparaissent correctement dans Cloud Logging.
Tester le déclenchement des alertes Cloud Monitoring.
Tester le mode maintenance.


Dépendances: Application de base fonctionnelle. Accès GCS.
Estimation de la complexité: Moyenne à Élevée (surtout sauvegarde/restauration robustes).
Livrables: Système de sauvegarde auto, logging Cloud Ops, mode maintenance, procédures restauration, monitoring/alertes de base.


10. Mise en Place CI/CD et Déploiement Initial (Nouvelle Phase)
Description et objectifs: Automatiser les processus de test et de déploiement pour garantir la qualité et la cohérence.
Sous-tâches détaillées:
Étapes de conception:
Choisir outil CI/CD (GitHub Actions, Cloud Build).
Définir les étapes du pipeline (lint, tests unitaires, tests intégration Emulators, build, déploiement clasp, déploiement firebase).
Stratégie de branches (git flow).


Étapes de développement:
10.1 Configurer dépôt Git.
10.2 Écrire les scripts pour chaque étape du pipeline CI/CD.
10.3 Configurer l'outil CI/CD pour déclencher le pipeline sur push/merge.
10.4 Gérer les secrets (clés API, tokens) de manière sécurisée dans le CI/CD.
10.5 Effectuer le déploiement initial en production via le pipeline.


Étapes de test (CI/CD):
Tester chaque étape du pipeline CI/CD.
Vérifier que les déploiements via CI/CD sont corrects.
Tester le rollback manuel ou via CI/CD si possible.


Dépendances: Application testable. Accès aux plateformes CI/CD et déploiement.
Estimation de la complexité: Moyenne.
Livrables: Pipeline CI/CD fonctionnel pour les tests et déploiements clasp et firebase. Documentation du processus.


11. Tests Continus et Assurance Qualité (Renforcement)
Description et objectifs: Assurer la qualité globale par des tests continus intégrés au développement et au CI/CD.
Sous-tâches détaillées:
Stratégie Globale: Maintenir et enrichir les tests unitaires, d'intégration (avec Emulators), et UI tout au long du projet.
Tests Serveur GAS (.gs): Développer des stratégies pour tester le code .gs (ex: mocker google.script.run ou les services GAS, utiliser des bibliothèques de test GAS si disponibles, privilégier la logique pure facilement testable).
Tests End-to-End (E2E): (Optionnel) Mettre en place quelques scénarios E2E critiques (ex: création emprunt complet) si la complexité le justifie (ex: avec Puppeteer ou Cypress contre l'app déployée ou les émulateurs).
Revue de Code: Intégrer la revue de code systématique dans le processus de développement.
Tests de Non-Régression: Assurer que les tests existants sont exécutés régulièrement (via CI/CD) pour détecter les régressions.
Tests de Performance: Réaliser des tests de charge ciblés sur les points critiques (Dashboard, requêtes complexes) avant la mise en production ou lors d'évolutions majeures.
Complexité: Continue (intégrée au développement).
Livrables: Suite de tests robuste, intégrée au CI/CD, documentation des stratégies de test.



Conclusion (Révisée)
Ce plan de développement révisé intègre des pratiques modernes pour améliorer la robustesse et la maintenabilité de SIGMA. L'accent mis sur l'utilisation des Firebase Emulators, la centralisation de l'observabilité avec Cloud Operations, l'automatisation via CI/CD, et l'utilisation stratégique des Cloud Functions permettra de construire une application plus fiable et plus facile à gérer sur le long terme, tout en respectant l'architecture GAS + Firebase initiale.
--- END OF REVISED FILE Plan de Développement Détaillé - Application SIGMA (Révisé) ---


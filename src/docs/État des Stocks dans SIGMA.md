État des Stocks dans SIGMA
1. Introduction
L'onglet État des Stocks permet une gestion centralisée et optimisée des articles consommables et non consommables dans SIGMA. Il fournit une interface claire pour visualiser, modifier et réapprovisionner les stocks, tout en assurant un suivi précis des mouvements de matériel. Grâce à l'intégration de Firebase Firestore, la gestion des stocks bénéficie désormais d'une performance et d'une fiabilité accrues.
2. Objectifs
Éviter les ruptures grâce à un suivi précis et en temps réel.


Gérer les articles hors modules pour un inventaire complet.


Optimiser le réassort et l'approvisionnement selon les besoins historiques et les seuils critiques.


Suivre les mouvements de stock pour anticiper les besoins.


Automatiser les réapprovisionnements en fonction des seuils d'alerte.


Exporter les données pour des analyses externes.


Garantir la synchronisation en temps réel entre tous les utilisateurs grâce à Firebase.


3. Fonctionnalités
3.1 Affichage et structure des stocks
Tableau dynamique affichant tous les articles avec des filtres avancés optimisés par les capacités de requête de Firestore.


Regroupement des articles par :


Catégorie (consommables, non-consommables).


Type d'objet.


Localisation.


Fournisseur.


Alerte visuelle en cas de seuil critique atteint.


Mises à jour en temps réel des données de stock sans nécessité de rafraîchir la page.


3.2 Ajout, modification et suppression d'articles
Seuls les régisseurs et administrateurs peuvent gérer les stocks, contrôlé par les règles de sécurité Firebase.


Journalisation des suppressions dans une collection d'archives Firestore pour garder une trace des modifications.


Formulaire d'ajout/modification comprenant :


Nom de l'article.


Catégorie (consommable/non-consommable).


Quantité disponible.


Seuil d'alerte (niveau critique déclenchant un réassort).


Localisation (lieu de stockage).


Référence fournisseur.


Lien de commande fournisseur.


Validation des données en temps réel avant enregistrement dans Firestore.


3.3 Gestion des seuils d'alerte et réassorts
Alerte affichée lorsque le stock atteint un seuil critique, avec possibilité de notifications push.


Suggestion automatique de réassort en fonction des besoins historiques, calculée via des requêtes d'agrégation Firestore.


Suivi des mouvements de stock (entrées/sorties) stocké dans une sous-collection Firestore pour un historique complet.


Abonnement aux changements via les listeners Firestore pour une mise à jour instantanée de l'interface.


3.4 Lien avec les fournisseurs
Champ dédié pour la référence fournisseur et lien direct vers la commande.


Gestion des fournisseurs intégrée dans une collection dédiée Firestore.


Relations entre collections pour une intégrité référentielle entre articles et fournisseurs.


3.5 Interaction avec les autres modules
Lien avec les emprunts : Lorsqu'un module revient, le réassort est effectué via des transactions Firestore garantissant la cohérence des données.


Matériel manquant : Marqué comme indisponible et facturé en interne.


Une fois le réassort validé, l'utilisateur peut marquer le matériel comme remplacé, mettant à jour toutes les collections concernées en une seule transaction.


3.6 Recherche et filtrage avancé
Recherche multi-critères par :


Nom de l'article.


Catégorie (consommable, non consommable).


Seuil critique (alerte stock faible).


Fournisseur.


Localisation.


Système de tags pour une navigation plus intuitive, implémenté via des champs indexés Firestore.


Recherche instantanée grâce aux indexes composites Firestore pour des performances optimales.


3.7 Export et statistiques
Export des données au format CSV / Excel.


Tableau de bord avec :


Évolution des stocks visualisée via des graphiques dynamiques.


Consommations par période.


Tendances (ex. : pics de consommation).


Suggestions automatiques pour optimiser les stocks (ex. : minimisation des stocks dormants, redistribution des articles sous-utilisés).


Calculs statistiques réalisés côté serveur via Firebase Functions pour ne pas surcharger le client.


4. Contraintes Techniques
Base de données Firebase Firestore remplaçant Google Sheets.


Structure de collections optimisée pour les opérations fréquentes:


Collection principale articles
Sous-collection mouvements pour l'historique
Indexes composites pour les recherches fréquentes
Intégration avec les autres modules SIGMA (Emprunts, Modules, Fournisseurs) via des références entre collections.


Interface simplifiée et évolutive communiquant avec Firestore via les APIs appropriées.


Mise en cache côté client pour les opérations fréquentes.


5. Évolutions Futures
Améliorations visuelles :


Barres de progression pour visualiser les seuils critiques.


Interface plus ergonomique avec animations fluides.


Rapports avancés sur la gestion des stocks et les coûts, générés via Firebase Functions.


Mode hors ligne permettant de consulter et modifier les stocks même sans connexion.


Alertes push en cas de changements critiques dans les stocks.


Analyse prédictive des besoins en stock basée sur l'historique des consommations.


Avantages de Firebase Firestore
Performance accrue même avec un grand volume de données.


Synchronisation en temps réel entre tous les utilisateurs.


Sécurité renforcée avec des règles d'accès granulaires.


Résilience aux pannes avec sauvegarde automatique des données.


Scalabilité permettant de gérer un nombre croissant d'articles et d'utilisateurs.


Résumé des Points Clés
✅ Suivi des consommables et non consommables en temps réel ✅ Alerte en cas de stock critique avec notifications possibles ✅ Réassort automatique basé sur les besoins historiques ✅ Lien direct avec les fournisseurs et commandes ✅ Export des données pour analyse externe ✅ Intégration avec les emprunts et modules via un système de références robuste ✅ Performance et fiabilité accrues grâce à Firebase Firestore
Ce document détaille toutes les fonctionnalités de l'onglet État des Stocks de SIGMA utilisant Firebase Firestore et les prochaines évolutions possibles.


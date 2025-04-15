L'onglet "Résumé" de SIGMA
L'onglet "Résumé" de SIGMA est conçu pour offrir une vue d'ensemble rapide des tâches en cours et des points critiques liés à la gestion du matériel. Il est structuré sous forme de plusieurs tableaux contenant des informations clés, actualisées en temps réel grâce à l'intégration de Firebase Firestore.
 Détail des tableaux présents dans l'onglet "Résumé" :
1️ Alertes Stock !
Ce tableau liste les articles dont le stock est critique ou proche de l'épuisement.
Contenu du tableau :
Matériel concerné (nom de l'article)
Stock actuel (quantité restante)
Seuil d'alerte (niveau défini nécessitant un réassort)
Localisation (où se trouve l'article)
Objectif : Anticiper les ruptures de stock et déclencher les réapprovisionnements
Fonction Firebase : Les données sont actualisées instantanément grâce aux listeners Firestore qui surveillent les changements dans la collection des stocks.
2️ ❌ Matériel spécifique manquant
Liste des matériels spécifiques qui doivent être commandés car non disponibles en stock.
Permet de préparer des commandes spécifiques pour éviter des blocages logistiques.
Actualisation automatique : Grâce aux requêtes Firestore qui identifient les articles marqués comme "à commander" ou "épuisés".
3️ 🚨 Emprunts non revenus
Tableau récapitulant les emprunts sortis mais pas encore retournés.
Contenu :
Nom de la manipulation
Lieu d'utilisation (où est parti le matériel)
Date de départ souhaitée
Date de retour prévue
Secteur utilisateur
Nom de l'emprunteur (responsable de la manipulation)
Objectif : Suivi précis des emprunts en cours pour éviter les pertes
Fonction Firebase : Une requête Firestore filtre automatiquement les emprunts ayant le statut "Parti" dont la date de retour est dépassée ou proche.
4️ Prochains emprunts (départ dans moins de 30 jours ou date de départ passée)
Liste des demandes d'emprunts à venir qui nécessitent une action (préparation, vérification).
Contenu :
Nom de la demande
Date prévue du départ
État de préparation
Objectif : Permettre au régisseur d'anticiper et de s'assurer que tout est prêt
Fonction Firebase : Une Cloud Function est programmée pour calculer quotidiennement les emprunts à venir dans les 30 prochains jours et actualiser ce tableau.
5️⃣ 📌 Modules non opérationnels
Ce tableau affiche les malles à réassortir.
Sert à organiser les interventions pour rendre les modules de nouveau disponibles.
Synchronisation : Les changements de statut des modules sont reflétés en temps réel grâce aux abonnements Firestore.
6️⃣ 🔧 Matériel non opérationnel
Liste du matériel dégradé ou en réparation.
Objectif : Planifier les réparations ou le remplacement du matériel.
Mise à jour : Les utilisateurs autorisés peuvent modifier le statut directement depuis ce tableau, avec enregistrement instantané dans Firestore.
7️ Emprunts en attente d'inventaire et/ou de facturation
Rassemble les emprunts qui :
Ne sont pas encore inventoriés
Ne sont pas encore facturés
Contenu :
Nom de l'emprunt
Date de retour
État (Inventorié / Non inventorié / Facturé / Non facturé)
Objectif : Assurer une gestion efficace des emprunts et éviter les retards
Automatisation : Les emprunts passent automatiquement dans ce tableau dès leur changement de statut en "Revenu" grâce aux triggers Firestore.
🎯 Utilité de cet onglet "Résumé"
🔹 Il agit comme une check-list pour le régisseur, lui permettant de voir rapidement les tâches à faire.
🔹 Il donne une vue d'ensemble de l'état du matériel, qu'il soit en stock, en emprunt, en attente de retour, ou en maintenance.
🔹 Il centralise les alertes et suivis importants pour éviter les oublis et améliorer la gestion logistique.
💪 Avantages de l'architecture Firebase pour le Résumé
🔹 Mise à jour en temps réel : Tous les tableaux s'actualisent instantanément sans nécessité de rafraîchir la page.
🔹 Performance optimisée : Les données sont chargées de manière asynchrone sans bloquer l'interface utilisateur.
🔹 Alertes paramétrables : Les seuils d'alerte peuvent être configurés individuellement et modifiés à tout moment avec effet immédiat.
🔹 Accès multi-utilisateurs : Plusieurs régisseurs peuvent consulter le résumé simultanément avec des données toujours à jour.
🔹 Mode hors connexion : Les dernières données consultées restent accessibles même en cas de perte temporaire de connexion internet.
🔹 Notifications possibles : Configuration d'alertes via Firebase Cloud Messaging pour notifier les utilisateurs des points critiques nécessitant une attention immédiate.


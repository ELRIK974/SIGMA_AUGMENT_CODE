Gestion des Emprunts dans SIGMA
1. Création et Validation d'un Emprunt
1.1 Formulaire de Demande
Un emprunt est créé via un formulaire qui doit contenir les informations suivantes :
Nom de la manipulation
Lieu de la manipulation
Date de départ (Format : JJ/MM/AAAA)
Date de retour (Format : JJ/MM/AAAA)
Secteur
Référent
Emprunteur
Matériel et module à associer à l'emprunt
Seuls les régisseurs logistiques et les personnes autorisées peuvent créer, modifier ou supprimer un emprunt, avec des permissions gérées par les règles de sécurité Firebase.
Toutes les données d'emprunt sont désormais stockées dans une collection Firestore dédiée pour un accès rapide et fiable.
1.2 Validation de l'Emprunt
Pour qu'un emprunt soit marqué comme "Prêt", le régisseur doit valider le matériel et le lier à la commande. Pour un module, un module unique disponible doit être sélectionné et ajouté à la commande.
Les changements de statut sont synchronisés en temps réel entre tous les utilisateurs grâce aux mises à jour instantanées de Firestore.
1.3 Génération Automatique d'Étiquettes
Chaque emprunt peut être associé à une étiquette contenant :
Numéro de commande
Nom de la manipulation
Lieu de la manipulation
Dates de départ et de retour
Référent
Modules inclus
Un bouton permet d'imprimer rapidement ces étiquettes.
1.4 Pré-enregistrement de Commandes Types
Possibilité de sauvegarder des modèles d'emprunts récurrents dans une collection Firestore dédiée.
Un type d'animation ayant besoin des mêmes modules et matériels peut être pré-enregistré.
Lors de la création d'un emprunt, un modèle peut être sélectionné pour remplir automatiquement les champs nécessaires.
2. Suivi et Gestion des Emprunts
2.1 Interface de Suivi
Affichage d'une liste claire des emprunts avec des détails tels que : numéro de l'emprunt, le nom de la manipulation, le lieu, date de départ, date de retour prévue, emprunteur, le secteur et l'état de la commande (Prête, Pas prête, Partie).
Une fonctionnalité de recherche avancée permet de filtrer rapidement les emprunts par différents critères, optimisée par les index Firestore pour des performances maximales.
Une icône ou un bouton permet un retour rapide à la liste des emprunts après la consultation d'un détail.
Les mises à jour des données sont affichées en temps réel grâce aux listeners Firestore sans nécessité de rafraîchir la page.
2.2 Gestion des Emprunts en Retard
Les dates de départ dépassées apparaissent en rouge.
Dans l'onglet "Résumé", les dates de retour dépassées sont mises en évidence.
Possibilité d'envoyer une alerte automatique via Firebase Cloud Messaging ou par email.
Des requêtes Firestore automatisées identifient les emprunts en retard et génèrent des notifications.
2.3 Détail d'un Emprunt
En cliquant sur une icône, une interface détaillée affiche :
Les informations générales : numéro d'emprunt, nom et lieu de la manipulation, dates de départ et retour, secteur, référent, emprunteur, notes, etc.
Les modules empruntés : statut d'association, localisation et actions possibles.
Le matériel emprunté : détail des types de matériel, quantité, type, et localisation.
Les données sont chargées via des références entre collections Firestore pour une maintenance simplifiée.
3. Améliorations de la page de détail d'un emprunt
3.1 Ergonomie et accessibilité
Affichage structuré sous forme d'onglets ou de sections distinctes.
Mise en évidence des statuts critiques avec des couleurs distinctes (ex. rouge pour "Pas prêt", vert pour "Prêt", orange pour "Parti").
Bouton d'accès rapide pour modifier rapidement l'état de l'emprunt.
Interface réactive utilisant les mises à jour en temps réel de Firestore.
3.2 Améliorations fonctionnelles
Association rapide des modules et du matériel directement depuis la page de détail.
Gestion des erreurs d'association avec des messages clairs lorsqu'un matériel ou module n'est pas encore associé.
Historique des modifications pour suivre les actions effectuées sur l'emprunt, stocké dans une sous-collection Firestore pour une traçabilité complète.
Transactions Firestore utilisées pour garantir l'intégrité des données lors des modifications.
3.3 Automatisation et suivi
Bouton de validation en un clic pour valider directement un emprunt.
Rappels et notifications pour les emprunts proches de leur date de retour ou en retard, générés par Firebase Cloud Functions.
Vérification de la disponibilité du matériel en lien avec l'emprunt depuis cette page.
4. Améliorations de la page d'association des modules
4.1 Ergonomie et accessibilité
Présentation de la liste des modules sous forme de tableau interactif avec tri et filtres (par localisation, disponibilité, référence).
Mise en évidence des statuts en couleurs (rouge pour indisponible, vert pour disponible).
Bouton d'accès rapide permettant de revenir à la liste des emprunts sans devoir repasser par plusieurs écrans.
Chargement optimisé des données via des requêtes Firestore indexées.
4.2 Améliorations fonctionnelles
Recherche dynamique des modules par nom ou référence, utilisant les capacités de recherche avancée de Firestore.
Affichage explicite des erreurs lorsqu'un module n'est pas disponible, avec une suggestion d'alternative.
Association rapide des modules en un seul clic, avec mise à jour en temps réel de l'interface.
4.3 Automatisation et suivi
Mise à jour automatique des statuts lors de l'association d'un module via des transactions Firestore.
Affichage d'un historique des associations de modules pour un meilleur suivi, stocké dans une sous-collection dédiée.
Suggestion automatique de modules alternatifs basés sur la localisation et le type de matériel.
5. Cycle de Vie des Emprunts
Statut
Description
Pas prêt
Matériel non encore validé
Prêt
Matériel validé et affecté à la commande
Parti
Matériel sorti du stock
Revenu
Matériel retourné au stock
Inventorié
Matériel vérifié et disponible

Les changements de statut déclenchent des événements Firebase qui mettent à jour automatiquement toutes les collections liées.
5.1 Modification d'un Emprunt
Contrairement au SIGMA actuel, un emprunt pourra être modifié même après le départ.
Il sera possible d'ajouter du matériel à un emprunt déjà parti.
Toutes les modifications sont tracées avec horodatage dans une sous-collection d'historique.
5.2 Annulation et Erreurs de Retour
Annuler un retour erroné grâce aux transactions Firestore qui garantissent la cohérence des données.
Supprimer un emprunt si besoin (droits réservés aux régisseurs, contrôlés par les règles de sécurité Firestore).
6. Gestion du Matériel et des Modules
6.1 Emprunts Multi-Modules
Possibilité d'ajouter plusieurs modules dans un même emprunt.
Les relations entre emprunts et modules sont gérées par des références entre collections Firestore.
6.2 Modification des emprunts
Modifier le contenu d'un emprunt déjà emprunté.
Les modifications sont synchronisées en temps réel sur tous les appareils connectés.
6.3 Transfert d'Emprunts
Transfert d'un emprunt vers un autre lieu sans retour en stock.
Opération effectuée via une transaction Firestore pour maintenir l'intégrité des données.
7. Retour et Inventaire
7.1 Vérification des Retours
Comparaison du contenu retourné avec l'inventaire initial, facilité par les requêtes Firestore.
Tout matériel manquant est automatiquement ajouté à la facturation de l'emprunteur.
Possibilité de vérifier si l'oubli est temporaire avant facturation.
Les données d'inventaire sont mises à jour en temps réel et accessibles à tous les utilisateurs autorisés.
8. Facturation et Gestion Financière
8.1 Gestion des Consommables et Matériel Non Retourné
Si un emprunt ne revient pas, il doit être facturé entièrement.
Possibilité de facturer uniquement les objets manquants.
Les données de facturation sont stockées dans une collection dédiée avec références aux articles concernés.
8.2 Validation Avant Archivage
L'emprunt est archivé une fois la facturation validée par le responsable.
L'archivage déplace les données dans une collection spécifique tout en maintenant les références pour d'éventuelles consultations futures.
9. Intégration avec les Autres Modules
9.1 Lien avec l'État des Stocks
Mise à jour automatique du stock lors de l'ajout ou du retour de matériel.
Les collections Firestore sont liées par des références pour garantir la cohérence des données entre modules.
9.2 Suivi des Livraisons
Liaison avec l'onglet "Livraisons" pour suivre le transport du matériel.
Les données de livraison sont synchronisées avec les emprunts via des relations entre collections Firestore.
9.3 Exportation des Emprunts
Possibilité d'exporter les emprunts en PDF ou Excel.
Les fonctions d'exportation peuvent être optimisées via Firebase Functions pour traiter des volumes importants sans surcharger le client.
10. Avantages de l'Architecture Firebase
Performance accrue : Temps de réponse rapide même avec de nombreux emprunts et modules.
Mise à jour en temps réel : Modifications visibles instantanément par tous les utilisateurs.
Traçabilité : Historique complet des actions sur chaque emprunt.
Fiabilité : Transactions garantissant l'intégrité des données lors des opérations complexes.
Sécurité renforcée : Contrôle précis des accès selon les rôles utilisateurs.
Fonctionnement hors-ligne : Possibilité de consulter et préparer des emprunts même sans connexion internet.


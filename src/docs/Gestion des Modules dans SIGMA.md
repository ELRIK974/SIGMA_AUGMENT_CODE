Gestion des Modules dans SIGMA
1. Introduction
L'onglet Gestion des Modules de SIGMA permet de créer, modifier, organiser et suivre l'utilisation des modules, qui sont des ensembles préconfigurés de matériel. Cette fonctionnalité est essentielle pour assurer une gestion fluide des ressources matérielles et leur disponibilité pour les animations. Grâce à l'intégration de Firebase Firestore, la gestion des modules gagne en performance, fiabilité et réactivité.
2. Structure et Organisation des Modules
2.1 Composition des Modules
Un module peut contenir différents types de matériel, notamment :
●	Matériel durable : Équipements réutilisables (ex. : instruments de mesure, équipements électroniques).
●	Consommables : Matériel à usage unique ou nécessitant un réassort (ex. : papier, ampoules, piles).
●	Conteneurs : Éléments de rangement et transport (ex. : malles, boîtes).
Tous ces éléments sont désormais gérés via des références entre collections Firestore pour garantir l'intégrité et la cohérence des données.
2.2 Identification des Modules
Chaque module est défini par les éléments suivants, stockés dans une collection Firestore dédiée :
●	Code module : Identifiant unique du module.
●	Nom du module : Intitulé descriptif.
●	Description : Informations sur son contenu et son utilisation.
●	Secteur d'activité : Domaine d'application (ex. : Astronomie, Environnement).
●	Conteneur : Type de rangement utilisé pour stocker le matériel associé.
●	Sous-modules : Un module peut inclure d'autres modules plus petits sans affecter la structure principale.
Les relations hiérarchiques entre modules et sous-modules sont gérées par des références entre documents Firestore, permettant des requêtes performantes.
2.3 Démantèlement des Modules
●	Lorsqu'un module est démantelé, son contenu est automatiquement réintégré dans le stock.
●	L'inventaire est mis à jour pour refléter cette modification.
●	Cette opération est réalisée via une transaction Firestore qui garantit que toutes les modifications sont appliquées ensemble ou pas du tout, évitant ainsi les incohérences de données.
3. Création et Modification des Modules
3.1 Création d'un Module
Les champs obligatoires pour créer un module sont :
●	Code module (identifiant unique).
●	Nom du module.
●	Secteur (ex. : Astronomie, Environnement).
●	Description.
●	Conteneur (ex. : malle, boîte de rangement).
Les nouveaux modules sont instantanément disponibles pour tous les utilisateurs grâce à la synchronisation en temps réel de Firestore.
3.2 Modification d'un Module
●	Il est possible d'ajouter du matériel à un module existant sans recréation.
●	Un module peut être modifié à tout moment, qu'il soit affecté à un emprunt ou non.
●	Modification de l'inventaire du module : Chaque modification de l'inventaire met à jour automatiquement l'état du module.
●	Si un module était marqué comme prêt, il sera automatiquement repassé en état "pas prêt" si du matériel est ajouté ou retiré.
●	Lors du réassort, l'utilisateur devra indiquer au système que le nouveau matériel a bien été ajouté au module pour le remettre en état "prêt".
●	Un module doit être libéré avant suppression s'il est lié à une animation.
●	Duplication rapide : possibilité de cloner un module existant pour créer des variantes facilement.
Toutes les modifications sont enregistrées avec horodatage dans une sous-collection d'historique, permettant une traçabilité complète des changements. Les mises à jour sont propagées instantanément à tous les utilisateurs connectés.
4. Gestion des Coûts et Facturation
4.1 Estimation Automatique des Coûts
Le coût total d'un module est calculé automatiquement en fonction de :
●	Matériel consommable : Articles qui doivent être remplacés après utilisation.
●	Conteneurs : Matériel de rangement et transport.
●	Matériel durable : Équipements réutilisables inclus dans le module.
●	Coûts supplémentaires éventuels : Remplacement de pièces perdues ou endommagées.
Les calculs complexes peuvent être réalisés via Firebase Functions pour ne pas surcharger l'interface client.
4.2 Facturation
●	Si du matériel est manquant lors du retour, il est automatiquement facturé à l'emprunteur.
●	Les informations de facturation sont stockées dans une collection dédiée avec des références au module et à l'emprunteur concernés.
5. Recherche et Suivi des Modules
5.1 Critères de Recherche
●	Code module.
●	Nom du module.
●	Contenu du module (recherche par éléments inclus).
●	Statut de disponibilité.
Les recherches sont optimisées par les index Firestore pour des résultats instantanés même avec un grand volume de données.
5.3 Prévisualisation Rapide
●	Possibilité d'afficher un aperçu détaillé d'un module avant modification.
●	Les données sont chargées rapidement grâce à la structure optimisée de la base de données Firestore.
5.4 Impression de l'Inventaire du Module
●	Ajout d'une icône Imprimer devant chaque module.
●	Lors du clic, une page d'inventaire apparaît, affichant tout le contenu du module.
●	L'utilisateur peut imprimer cette page et la placer dans le module pour référence.
●	La génération de documents PDF peut être gérée par Firebase Functions pour garantir la performance et la cohérence du format.
5.5 Consultation de la Liste des Modules
●	Ajout d'une icône de consultation devant chaque module.
●	Lors du clic, une page s'ouvre affichant la liste des modules correspondants, leur localisation et leur état opérationnel.
●	Cette fonctionnalité permet une meilleure gestion et traçabilité des modules disponibles.
●	Les données sont affichées en temps réel et mises à jour instantanément en cas de changements effectués par d'autres utilisateurs.
6. Intégration avec les Autres Fonctionnalités
6.1 Liens avec les Animations et Emprunts
●	Tous les modules passent par la gestion des emprunts.
●	Une fois emprunté, un module ne peut pas être partagé entre plusieurs animations.
●	Lors du retour, un module doit être contrôlé avant d'être à nouveau disponible.
●	Les relations entre modules et emprunts sont gérées par des références entre collections Firestore, permettant des requêtes efficaces et des mises à jour cohérentes.
6.2 Gestion des Stocks et Déplacement des Modules
●	Déplacement d'un module possible sans emprunt.
●	L'inventaire est mis à jour en temps réel en cas de changement de stockage.
●	Les transactions Firestore garantissent la cohérence des données même lors d'opérations complexes impliquant plusieurs collections.
7. Sécurité et Permissions
7.1 Niveaux d'Accès
●	Administrateur : Accès total, gestion des modules et des droits d'utilisateurs.
●	Régisseur logistique : Création, modification et suppression des modules dans le cadre des emprunts.
●	Utilisateur classique : Consultation uniquement, sans modification possible.
●	Ces niveaux d'accès sont gérés par les règles de sécurité Firestore, garantissant que chaque utilisateur n'a accès qu'aux fonctionnalités appropriées à son rôle.
7.2 Historique des Modifications
●	Enregistrement des modifications pour assurer une traçabilité des actions.
●	Chaque changement est horodaté et associé à l'utilisateur qui l'a effectué, stocké dans une sous-collection dédiée à l'historique.
8. Notifications et Automatisation
8.1 Alertes et Suivi
●	Notification en cas d'indisponibilité d'un module.
●	Alerte de réapprovisionnement automatique pour les consommables.
●	Les notifications peuvent être gérées via Firebase Cloud Messaging pour une diffusion immédiate aux utilisateurs concernés.
8.2 Automatisation de la Gestion des Stocks
●	Une partie de la gestion sera automatisée tout en laissant un contrôle manuel sur certaines étapes critiques.
●	Des Firebase Cloud Functions peuvent être programmées pour exécuter des tâches automatiques basées sur des déclencheurs spécifiques, comme le retour d'un module ou l'atteinte d'un seuil critique de stock.
9. Avantages de l'Architecture Firebase
9.1 Performance et Fiabilité
●	Temps de réponse optimisés même avec un grand nombre de modules.
●	Haute disponibilité grâce à l'infrastructure cloud de Firebase.
●	Sauvegarde automatique des données pour éviter les pertes.
9.2 Synchronisation en Temps Réel
●	Mises à jour instantanées visibles par tous les utilisateurs connectés.
●	Mode hors ligne permettant de consulter et préparer des modifications même sans connexion.
●	Résolution automatique des conflits lors de modifications simultanées.
9.3 Évolutivité
●	Structure de données flexible pouvant s'adapter à l'évolution des besoins.
●	Capacité à gérer un volume croissant de modules et d'utilisateurs sans dégradation des performances.
●	Intégration facilitée avec d'autres services Google et applications tierces.
10. Conclusion et Améliorations Futures
Ce système de gestion des modules modernisé avec Firebase Firestore vise à optimiser l'organisation et l'utilisation des ressources tout en assurant une meilleure traçabilité et une automatisation intelligente de certaines tâches. Des améliorations futures pourraient inclure :
●	Statistiques d'utilisation avancées exploitant les capacités d'agrégation de Firebase pour mieux comprendre les besoins.
●	Tableaux de bord interactifs pour une vision plus claire de l'état des modules.
●	Amélioration de l'ergonomie pour simplifier encore davantage la gestion au quotidien.
●	Application mobile complémentaire utilisant la même base de données Firestore pour une gestion sur le terrain.
●	Intelligence artificielle pour prédire les besoins en modules selon les saisons ou types d'animations.
Avec ces améliorations et l'architecture Firebase, SIGMA offrira une gestion optimisée, performante et fiable des modules tout en garantissant une expérience utilisateur fluide et réactive.


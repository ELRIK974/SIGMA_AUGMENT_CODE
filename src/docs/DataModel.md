# Modèle de données de SIGMA

Ce document décrit la structure des collections Firestore utilisées dans SIGMA.

## Collections principales

### 1. `users` - Utilisateurs
```javascript
{
  uid: "string",         // ID utilisateur Firebase Auth
  email: "string",       // Email de l'utilisateur
  displayName: "string", // Nom affiché
  role: "string",        // Rôle: "admin", "regisseur", "utilisateur"
  createdAt: timestamp,  // Date de création
  lastLogin: timestamp   // Dernière connexion
}
```

### 2. `emprunts` - Emprunts
```javascript
{
  nom: "string",              // Nom de la manipulation
  lieu: "string",             // Lieu d'utilisation
  dateDepart: timestamp,      // Date de départ prévue
  dateRetourPrevue: timestamp,// Date de retour prévue
  dateRetourEffective: timestamp, // Date de retour réelle (si revenu)
  secteur: "string",          // Secteur d'activité
  referent: "string",         // Personne référente
  emprunteur: "string",       // Personne/entité empruntant
  notes: "string",            // Notes additionnelles
  statut: "string",           // "Pas prêt", "Prêt", "Parti", "Revenu", "Inventorié"
  estInventorie: boolean,     // Si l'inventaire au retour a été fait
  estFacture: boolean,        // Si la facturation a été effectuée
  createdBy: "string",        // UID du créateur
  createdAt: timestamp,       // Date de création
  updatedAt: timestamp        // Date de dernière mise à jour
}
```

#### Sous-collection: `emprunts/{id}/materiel`
```javascript
{
  idMateriel: "string",    // ID du matériel ou module
  type: "string",          // "module" ou "stock"
  quantite: number,        // Quantité (pour stock)
  estRetourne: boolean,    // Si retourné
  estComplet: boolean,     // Si complet au retour
  notes: "string"          // Notes éventuelles
}
```

#### Sous-collection: `emprunts/{id}/historique`
```javascript
{
  date: timestamp,         // Date de l'action
  action: "string",        // Type d'action
  utilisateur: "string",   // UID utilisateur
  notes: "string"          // Détails
}
```

### 3. `modules` - Modules
```javascript
{
  code: "string",          // Code unique du module
  nom: "string",           // Nom descriptif
  description: "string",   // Description détaillée
  secteur: "string",       // Secteur d'activité
  typeConteneur: "string", // Type de rangement
  estPret: boolean,        // Si le module est prêt à l'utilisation
  localisation: "string",  // Lieu de stockage actuel
  createdAt: timestamp,    // Date de création
  updatedAt: timestamp     // Date de dernière mise à jour
}
```

#### Sous-collection: `modules/{id}/contenu`
```javascript
{
  idMateriel: "string",    // ID du matériel ou sous-module
  type: "string",          // "module" (sous-module) ou "stock"
  quantite: number,        // Quantité (pour stock)
  estObligatoire: boolean  // Si nécessaire au fonctionnement
}
```

### 4. `stocks` - Articles en stock
```javascript
{
  nom: "string",             // Nom de l'article
  description: "string",     // Description
  categorie: "string",       // Catégorie
  estConsommable: boolean,   // Si consommable ou réutilisable
  quantite: number,          // Quantité disponible
  seuilAlerte: number,       // Seuil déclenchant une alerte
  localisation: "string",    // Lieu de stockage
  estOperationnel: boolean,  // Si en état de fonctionnement
  refFournisseur: "string",  // Référence fournisseur
  prixUnitaire: number,      // Prix à l'unité
  aCommander: boolean,       // Si à commander
  createdAt: timestamp,      // Date de création
  updatedAt: timestamp       // Date de dernière mise à jour
}
```

#### Sous-collection: `stocks/{id}/mouvements`
```javascript
{
  date: timestamp,           // Date du mouvement
  type: "string",            // "entree" ou "sortie"
  quantite: number,          // Quantité concernée
  motif: "string",           // Raison du mouvement
  refEmprunt: "string",      // ID emprunt associé (si applicable)
  utilisateur: "string"      // UID utilisateur ayant effectué l'action
}
```

### 5. `fournisseurs` - Fournisseurs
```javascript
{
  nom: "string",             // Nom du fournisseur
  adresse: "string",         // Adresse
  telephone: "string",       // Téléphone
  email: "string",           // Email
  siteWeb: "string",         // Site web
  notes: "string"            // Notes additionnelles
}
```

### 6. `livraisons` - Livraisons
```javascript
{
  datePrevu: timestamp,      // Date prévue
  lieuDepart: "string",      // Lieu de départ
  lieuArrivee: "string",     // Lieu d'arrivée
  statut: "string",          // "Planifiée", "En cours", "Effectuée"
  refEmprunt: "string",      // ID emprunt associé
  transporteur: "string",    // Personne/entreprise de transport
  notes: "string",           // Notes additionnelles
  createdAt: timestamp,      // Date de création
  updatedAt: timestamp       // Date de dernière mise à jour
}
```

## Relations entre collections

- Un **emprunt** peut contenir plusieurs **modules** et **articles** (via `emprunts/{id}/materiel`)
- Un **module** peut contenir des **sous-modules** et des **articles** (via `modules/{id}/contenu`)
- Un **article** peut avoir plusieurs **mouvements** (via `stocks/{id}/mouvements`)
- Une **livraison** est associée à un **emprunt** (via `refEmprunt`)
- Un **article** peut avoir un **fournisseur** associé (via `refFournisseur`)

## Indexation

Les index composites recommandés incluent:
- `emprunts`: (statut, dateRetourPrevue) pour les emprunts en retard
- `emprunts`: (statut, dateDepart) pour les prochains emprunts
- `stocks`: (estConsommable, quantite, seuilAlerte) pour les alertes stock
- `modules`: (secteur, estPret) pour filtrer les modules par secteur et disponibilité

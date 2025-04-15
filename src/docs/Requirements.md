# Exigences fonctionnelles et techniques de SIGMA

## Objectifs du projet

SIGMA (Système Informatique de Gestion du Matériel) vise à:
- Centraliser la gestion du matériel utilisé lors des animations
- Simplifier le suivi des emprunts et des stocks
- Fluidifier l'organisation logistique des animations

## Fonctionnalités principales

### 1. Dashboard (Résumé)
- Vue d'ensemble avec alertes et tâches importantes
- Mise à jour en temps réel
- 7 tableaux d'information incluant alertes stock, emprunts en retard, etc.

### 2. Gestion des Emprunts
- Cycle de vie complet: création, validation, départ, retour, inventaire, facturation
- Association de modules et matériels
- Suivi des retards et matériel manquant

### 3. Gestion des Stocks
- Suivi des consommables et non-consommables
- Gestion des seuils d'alerte
- Historique des mouvements

### 4. Gestion des Modules
- Création et modification de kits préconfigurés
- Démantèlement et duplication
- Impression d'inventaire

### 5. Suivi des Livraisons
- Planification des transports
- Carte interactive
- Confirmation de livraison

## Exigences techniques

### Infrastructure
- Application web déployée via Google Apps Script
- Base de données Firebase Firestore
- Authentification Firebase
- Cloud Functions pour les opérations complexes
- Cloud Operations pour le monitoring

### Performance
- Temps de réponse < 2 secondes pour 95% des opérations
- Support pour ~30 utilisateurs simultanés
- Mise à jour des données en temps réel

### Sécurité
- Accès basé sur les rôles (Admin, Régisseur, Utilisateur)
- Protection des données sensibles
- Validation côté serveur des opérations critiques

### Compatibilité
- Navigateurs modernes (Chrome, Firefox, Edge, Safari)
- Design responsive pour desktop et mobile
- Fonctionnalités de base accessibles hors-ligne

## Contraintes
- Budget limité (utilisation du plan gratuit Firebase si possible)
- Besoin d'intégration avec l'écosystème Google
- Maintenance future par une équipe restreinte

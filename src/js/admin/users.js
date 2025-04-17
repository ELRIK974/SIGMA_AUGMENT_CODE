/**
 * Administration des utilisateurs pour SIGMA
 *
 * Ce fichier contient:
 * - Logique pour afficher la liste des utilisateurs
 * - Appels aux Cloud Functions pour la gestion des utilisateurs (list, set role, etc.)
 */

/**
 * Initialise la page de gestion des utilisateurs.
 * Appelée depuis users.html après vérification du rôle admin.
 */
function initUserManagement() {
  console.log("Initialisation de la gestion des utilisateurs...");
  loadUsersList();

  // Ajouter ici les écouteurs d'événements pour les boutons (Ajouter, Sauvegarder, Supprimer)
  // et les modals si nécessaire.
}

/**
 * Charge la liste des utilisateurs depuis la Cloud Function.
 */
async function loadUsersList() {
  const tableBody = document.getElementById('users-table-body');
  if (!tableBody) {
    console.error("Élément 'users-table-body' introuvable.");
    showAlert('Erreur interne : impossible d\'afficher la liste.', 'danger');
    return;
  }

  // Afficher l'indicateur de chargement
  tableBody.innerHTML = '<tr><td colspan="5" class="text-center"><div class="spinner-border spinner-border-sm" role="status"><span class="visually-hidden">Chargement...</span></div> Chargement des utilisateurs...</td></tr>';
  hideAlert(); // Masquer les alertes précédentes

  try {
    const functions = await getFunctionsInstance(); // Fonction de js/auth.js ou firebaseUtils.js
    if (!functions) {
      throw new Error("Instance Firebase Functions non disponible.");
    }

    // Adapter l'appel pour utiliser le nouveau nom exporté
    const listAuthUsersFunction = functions.httpsCallable('userManagement.listAuthUsers');
    const result = await listAuthUsersFunction();

    if (result.data && result.data.success) {
      renderUsersTable(result.data.users);
    } else {
      throw new Error(result.data.message || 'Erreur lors de la récupération des utilisateurs.');
    }

  } catch (error) {
    console.error("Erreur lors de l'appel à listAuthUsers:", error);
    let errorMessage = "Impossible de charger la liste des utilisateurs.";
    if (error.message) {
      errorMessage += ` Détail : ${error.message}`;
    }
     if (error.code === 'permission-denied') {
       errorMessage = "Vous n'avez pas les permissions nécessaires pour voir cette liste.";
     }
    tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">${errorMessage}</td></tr>`;
    showAlert(errorMessage, 'danger'); // Afficher aussi dans l'alerte principale
  }
}

/**
 * Affiche les utilisateurs dans le tableau HTML.
 * @param {Array} users - Le tableau d'objets utilisateur retourné par la CF.
 */
function renderUsersTable(users) {
  const tableBody = document.getElementById('users-table-body');
  if (!tableBody) return; // Sécurité

  tableBody.innerHTML = ''; // Vider le contenu (chargement ou erreur précédente)

  if (!users || users.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" class="text-center">Aucun utilisateur trouvé.</td></tr>';
    return;
  }

  users.forEach(user => {
    const row = document.createElement('tr');
    row.setAttribute('data-user-uid', user.uid); // Ajouter l'UID pour référence future

    const statusBadge = user.disabled
      ? '<span class="badge bg-danger">Désactivé</span>'
      : '<span class="badge bg-success">Activé</span>';

    // Formater les dates (optionnel, peut être amélioré)
    const creationDate = user.creationTime ? new Date(user.creationTime).toLocaleDateString() : 'N/A';
    const lastSignInDate = user.lastSignInTime ? new Date(user.lastSignInTime).toLocaleDateString() : 'Jamais';

    row.innerHTML = `
      <td>${user.displayName || user.email}</td>
      <td>${user.email}</td>
      <td>${user.role || 'N/A'}</td>
      <td>${statusBadge}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary edit-user-btn" title="Modifier ${user.email}">
          <i class="bi bi-pencil-square"></i>
        </button>
        <button class="btn btn-sm btn-outline-danger delete-user-btn" title="Supprimer ${user.email}">
          <i class="bi bi-trash"></i>
        </button>
        <button class="btn btn-sm btn-outline-secondary view-details-btn" title="Détails ${user.email}">
          <i class="bi bi-info-circle"></i>
        </button>
      </td>
    `;

    // Ajouter les écouteurs d'événements pour les boutons d'action ici
    // row.querySelector('.edit-user-btn').addEventListener('click', () => handleEditUser(user.uid));
    // row.querySelector('.delete-user-btn').addEventListener('click', () => handleDeleteUser(user.uid, user.email));
    // row.querySelector('.view-details-btn').addEventListener('click', () => showUserDetails(user));

    tableBody.appendChild(row);
  });
}

// --- Fonctions utilitaires pour les alertes (peuvent être dans uiUtils.js) ---

/** Affiche une alerte dans le conteneur dédié */
function showAlert(message, type = 'info') {
  const alertContainer = document.getElementById('alert-container');
  if (alertContainer) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fermer"></button>
    `;
    // Vider les anciennes alertes avant d'ajouter la nouvelle
    alertContainer.innerHTML = '';
    alertContainer.appendChild(alertDiv);
  } else {
    console.warn("Conteneur d'alerte 'alert-container' non trouvé.");
  }
}

/** Masque les alertes */
function hideAlert() {
  const alertContainer = document.getElementById('alert-container');
  if (alertContainer) {
    alertContainer.innerHTML = '';
  }
}

// --- Fonctions de gestion des actions (Edit, Delete, View) ---
// À implémenter dans les prochaines tâches

function handleEditUser(uid) {
  console.log(`TODO: Implémenter l'édition pour l'utilisateur ${uid}`);
  // Ouvrir le modal 'user-modal' pré-rempli avec les infos de l'utilisateur
  // Charger les infos de l'utilisateur si nécessaire
  // Modifier le titre du modal
}

function handleDeleteUser(uid, email) {
  console.log(`TODO: Implémenter la suppression pour l'utilisateur ${uid} (${email})`);
  // Afficher le modal 'delete-modal' avec les infos de l'utilisateur
  // Ajouter un écouteur sur le bouton de confirmation pour appeler une CF de suppression
}

function showUserDetails(user) {
   console.log(`TODO: Implémenter l'affichage des détails pour l'utilisateur`, user);
   // Afficher un modal ou une section avec plus d'informations (dates, etc.)
   alert(`Détails pour ${user.displayName || user.email}:\nUID: ${user.uid}\nRôle: ${user.role}\nCréé le: ${new Date(user.creationTime).toLocaleString()}\nDernière connexion: ${new Date(user.lastSignInTime).toLocaleString()}\nStatut: ${user.disabled ? 'Désactivé' : 'Activé'}`);
}

// Assurez-vous que les fonctions utilitaires comme getFunctionsInstance sont disponibles
// (elles devraient l'être via les inclusions dans users.html)

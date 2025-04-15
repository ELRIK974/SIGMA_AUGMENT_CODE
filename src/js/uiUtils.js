/**
 * Utilitaires UI pour SIGMA
 * 
 * Ce fichier contient:
 * - Fonctions de manipulation du DOM
 * - Création d'éléments d'interface
 * - Gestion des événements UI
 */

/**
 * Crée un élément de tableau avec contenu et classes
 */
function createTableRow(data, options = {}) {
  const tr = document.createElement('tr');
  
  // Ajouter des classes éventuelles
  if (options.rowClass) {
    tr.className = options.rowClass;
  }
  
  // Ajouter un attribut data-id si fourni
  if (options.dataId) {
    tr.setAttribute('data-id', options.dataId);
  }
  
  // Créer les cellules
  data.forEach(cell => {
    const td = document.createElement('td');
    
    // Contenu de la cellule (texte ou HTML)
    if (typeof cell === 'object' && cell.html) {
      td.innerHTML = cell.html;
    } else {
      td.textContent = cell;
    }
    
    // Ajouter des classes éventuelles pour la cellule
    if (typeof cell === 'object' && cell.class) {
      td.className = cell.class;
    }
    
    tr.appendChild(td);
  });
  
  return tr;
}

/**
 * Affiche un message de notification
 */
function showNotification(message, type = 'info') {
  // Créer l'élément de notification
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Ajouter au conteneur de notifications (à créer dans le HTML)
  const container = document.getElementById('notifications') || document.body;
  container.appendChild(notification);
  
  // Supprimer après un délai
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

/**
 * Vide un élément DOM
 */
function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

/**
 * Formate une date pour l'affichage
 */
function formatDate(timestamp) {
  if (!timestamp) return '';
  
  // Si c'est un timestamp Firestore
  if (timestamp.toDate) {
    timestamp = timestamp.toDate();
  }
  
  // Si c'est une chaîne de caractères
  if (typeof timestamp === 'string') {
    timestamp = new Date(timestamp);
  }
  
  return timestamp.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

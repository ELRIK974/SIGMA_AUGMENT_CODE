/**
 * Utilitaires de test pour SIGMA
 * 
 * Ce fichier contient des fonctions pour faciliter les tests
 * et le débogage de l'application
 */

/**
 * Récupère le contenu de la page de connexion pour les tests
 * @return {string} Contenu HTML de la page de connexion
 */
function getLoginPageContent() {
  try {
    // Log pour le suivi
    console.log('Récupération du contenu de login_simple.html pour les tests');
    
    // Récupérer le contenu de la page
    const template = HtmlService.createTemplateFromFile('login_simple');
    const content = template.evaluate().getContent();
    
    console.log(`Contenu récupéré avec succès (${content.length} caractères)`);
    return content;
  } catch (error) {
    console.error('Erreur lors de la récupération du contenu de login_simple.html:', error);
    throw new Error(`Erreur lors de la récupération du contenu: ${error.message}`);
  }
}

/**
 * Vérifie si un fichier existe dans le projet
 * @param {string} filename - Nom du fichier à vérifier
 * @return {boolean} True si le fichier existe, false sinon
 */
function fileExists(filename) {
  try {
    // Tenter de récupérer le fichier
    const files = DriveApp.getFilesByName(filename);
    return files.hasNext();
  } catch (error) {
    console.error(`Erreur lors de la vérification de l'existence du fichier ${filename}:`, error);
    return false;
  }
}

/**
 * Liste tous les fichiers du projet
 * @return {Array} Liste des noms de fichiers
 */
function listProjectFiles() {
  try {
    const files = [];
    const iterator = DriveApp.getFiles();
    
    while (iterator.hasNext()) {
      const file = iterator.next();
      files.push(file.getName());
    }
    
    return files;
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste des fichiers:', error);
    return [];
  }
}

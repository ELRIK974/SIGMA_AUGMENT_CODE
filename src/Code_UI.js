/**
 * Point d'entrée principal de l'application SIGMA
 * 
 * Ce fichier contient:
 * - La fonction doGet qui génère l'interface utilisateur
 * - La fonction include pour intégrer des fichiers HTML
 * - La gestion sécurisée de la configuration Firebase via Properties Service
 */

/**
 * Fonction principale qui génère l'interface web
 * @param {Object} e - Paramètres de la requête (optionnels)
 * @return {HtmlOutput} Interface HTML à afficher
 */
function doGet(e) {
  // Vérifier si l'application est en mode maintenance
  if (isMaintenanceMode()) {
    return HtmlService.createTemplateFromFile('maintenance')
      .evaluate()
      .setTitle('SIGMA - Maintenance')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  
  // Page à afficher (par défaut: index)
  let page = 'index';
  
  // Vérifier si une page spécifique est demandée
  if (e && e.parameter && e.parameter.page) {
    // Valider le paramètre pour éviter les injections
    const requestedPage = e.parameter.page.replace(/[^a-zA-Z0-9_-]/g, '');
    
    // Vérifier si la page demandée existe
    try {
      // Tenter de récupérer le fichier pour vérifier s'il existe
      HtmlService.createTemplateFromFile(requestedPage);
      page = requestedPage;
    } catch (error) {
      // Si la page n'existe pas, conserver la page par défaut
      console.log(`Page demandée non trouvée: ${requestedPage}`, error);
    }
  }
  
  // Log pour le suivi des accès (utile pour le debugging et statistiques)
  console.log(`Accès à l'application - Page: ${page}`);
  
  // Créer et retourner la page HTML
  return HtmlService.createTemplateFromFile(page)
    .evaluate()
    .setTitle('SIGMA - Système Informatique de Gestion du Matériel')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Fonction pour inclure des fichiers HTML
 * @param {string} filename - Nom du fichier à inclure
 * @return {string} Contenu du fichier
 */
function include(filename) {
  try {
    // Sécurité : Empêcher l'inclusion directe des fichiers serveur critiques
    if (filename.startsWith('firebase/functions/')) {
        console.error(`Tentative d'inclusion non autorisée du fichier serveur: ${filename}`);
        return `<!-- Erreur: Inclusion non autorisée du fichier ${filename} -->`;
    }
    // Si le fichier commence par 'html/', le charger tel quel
    // Sinon, chercher à la racine (pour les wrappers js_*.html, css_*.html)
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  } catch (error) {
    console.error(`Erreur lors de l'inclusion du fichier ${filename}:`, error);
    return `<!-- Erreur: Impossible d'inclure le fichier ${filename} -->`;
  }
}

/**
 * Vérifie si l'application est en mode maintenance
 * @return {boolean} True si le mode maintenance est activé
 */
function isMaintenanceMode() {
  try {
    const maintenanceMode = PropertiesService.getScriptProperties().getProperty('MAINTENANCE_MODE');
    return maintenanceMode === 'true';
  } catch (error) {
    console.error('Erreur lors de la vérification du mode maintenance:', error);
    return false; // Par défaut, ne pas bloquer l'accès en cas d'erreur
  }
}

/**
 * Récupère la configuration Firebase de manière sécurisée
 * Les clés API sont stockées dans Script Properties plutôt qu'en dur dans le code
 * @param {boolean} includeEmulatorConfig - Si true, inclut la configuration pour les émulateurs
 * @return {Object} Configuration Firebase
 */
function getFirebaseConfig(includeEmulatorConfig = false) {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    
    // Récupérer les propriétés individuellement (plus sécurisé que getProperties())
    const config = {
      apiKey: scriptProperties.getProperty('FIREBASE_API_KEY'),
      authDomain: scriptProperties.getProperty('FIREBASE_AUTH_DOMAIN'),
      projectId: scriptProperties.getProperty('FIREBASE_PROJECT_ID'),
      storageBucket: scriptProperties.getProperty('FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: scriptProperties.getProperty('FIREBASE_MESSAGING_SENDER_ID'),
      appId: scriptProperties.getProperty('FIREBASE_APP_ID'),
      functionsRegion: scriptProperties.getProperty('FIREBASE_FUNCTIONS_REGION') || 'europe-west1'
    };
    
    // Ajouter databaseURL si elle existe
    const databaseURL = scriptProperties.getProperty('FIREBASE_DATABASE_URL');
    if (databaseURL) {
      config.databaseURL = databaseURL;
    }
    
    // Vérifier que toutes les propriétés nécessaires sont définies
    for (const [key, value] of Object.entries(config)) {
      if (!value && key !== 'functionsRegion' && key !== 'databaseURL') { // functionsRegion et databaseURL sont optionnels
        console.error(`Propriété Firebase manquante: ${key}`);
        // Ne pas lancer d'erreur pour éviter de bloquer le chargement, mais logger l'erreur
      }
    }
    
    // Ajouter la configuration des émulateurs si demandé
    if (includeEmulatorConfig) {
      // Récupérer la configuration des émulateurs depuis les propriétés
      const useEmulators = scriptProperties.getProperty('FIREBASE_USE_EMULATORS') === 'true';
      
      if (useEmulators) {
        const emulatorHost = scriptProperties.getProperty('FIREBASE_EMULATOR_HOST') || 'localhost';
        
        config.useEmulators = true;
        config.emulators = {
          firestore: {
            host: emulatorHost,
            port: parseInt(scriptProperties.getProperty('FIREBASE_EMULATOR_FIRESTORE_PORT') || '8080')
          },
          auth: {
            host: emulatorHost,
            port: parseInt(scriptProperties.getProperty('FIREBASE_EMULATOR_AUTH_PORT') || '9099')
          },
          functions: {
            host: emulatorHost,
            port: parseInt(scriptProperties.getProperty('FIREBASE_EMULATOR_FUNCTIONS_PORT') || '5001')
          },
          storage: {
            host: emulatorHost,
            port: parseInt(scriptProperties.getProperty('FIREBASE_EMULATOR_STORAGE_PORT') || '9199')
          }
        };
        
        console.log('Configuration émulateurs Firebase activée:', JSON.stringify(config.emulators));
      }
    }
    
    return config;
  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration Firebase:', error);
    
    // En cas d'erreur, retourner un objet vide plutôt que null pour éviter les erreurs client
    return {
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: ''
    };
  }
}

/**
 * Configure les propriétés du script pour Firebase (à exécuter une seule fois)
 * Cette fonction est utile pour initialiser les propriétés lors de la configuration
 * @param {Object} config - Configuration Firebase
 * @param {Object} [emulatorConfig] - Configuration facultative pour les émulateurs
 * @return {boolean} true si la configuration a réussi, false sinon
 */
function setFirebaseConfig(config, emulatorConfig) {
  try {
    const scriptProperties = PropertiesService.getScriptProperties();
    
    // Définir chaque propriété individuellement
    scriptProperties.setProperty('FIREBASE_API_KEY', config.apiKey || '');
    scriptProperties.setProperty('FIREBASE_AUTH_DOMAIN', config.authDomain || '');
    scriptProperties.setProperty('FIREBASE_PROJECT_ID', config.projectId || '');
    scriptProperties.setProperty('FIREBASE_STORAGE_BUCKET', config.storageBucket || '');
    scriptProperties.setProperty('FIREBASE_MESSAGING_SENDER_ID', config.messagingSenderId || '');
    scriptProperties.setProperty('FIREBASE_APP_ID', config.appId || '');
    
    // Configurer databaseURL si présent
    if (config.databaseURL) {
      scriptProperties.setProperty('FIREBASE_DATABASE_URL', config.databaseURL);
    }
    
    // Définir la région des fonctions si spécifiée
    if (config.functionsRegion) {
      scriptProperties.setProperty('FIREBASE_FUNCTIONS_REGION', config.functionsRegion);
    }
    
    // Configurer les émulateurs si demandé
    if (emulatorConfig) {
      scriptProperties.setProperty('FIREBASE_USE_EMULATORS', emulatorConfig.useEmulators ? 'true' : 'false');
      
      if (emulatorConfig.host) {
        scriptProperties.setProperty('FIREBASE_EMULATOR_HOST', emulatorConfig.host);
      }
      
      if (emulatorConfig.ports) {
        if (emulatorConfig.ports.firestore) {
          scriptProperties.setProperty('FIREBASE_EMULATOR_FIRESTORE_PORT', emulatorConfig.ports.firestore.toString());
        }
        if (emulatorConfig.ports.auth) {
          scriptProperties.setProperty('FIREBASE_EMULATOR_AUTH_PORT', emulatorConfig.ports.auth.toString());
        }
        if (emulatorConfig.ports.functions) {
          scriptProperties.setProperty('FIREBASE_EMULATOR_FUNCTIONS_PORT', emulatorConfig.ports.functions.toString());
        }
        if (emulatorConfig.ports.storage) {
          scriptProperties.setProperty('FIREBASE_EMULATOR_STORAGE_PORT', emulatorConfig.ports.storage.toString());
        }
      }
      
      console.log('Configuration des émulateurs Firebase enregistrée');
    }
    
    console.log('Configuration Firebase enregistrée avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de la configuration des propriétés Firebase:', error);
    return false;
  }
}

/**
 * Fonction utilitaire pour configurer rapidement les émulateurs Firebase
 * Utilisée principalement pour le développement et les tests
 * @param {boolean} useEmulators - Activer ou désactiver les émulateurs
 * @param {Object} [portConfig] - Configuration optionnelle des ports
 * @return {boolean} true si la configuration a réussi, false sinon
 */
function configureEmulators(useEmulators, portConfig = {}) {
  try {
    const emulatorConfig = {
      useEmulators: useEmulators,
      host: 'localhost',
      ports: {
        firestore: portConfig.firestore || 8080,
        auth: portConfig.auth || 9099,
        functions: portConfig.functions || 5001,
        storage: portConfig.storage || 9199
      }
    };
    
    const scriptProperties = PropertiesService.getScriptProperties();
    
    scriptProperties.setProperty('FIREBASE_USE_EMULATORS', useEmulators ? 'true' : 'false');
    scriptProperties.setProperty('FIREBASE_EMULATOR_HOST', emulatorConfig.host);
    scriptProperties.setProperty('FIREBASE_EMULATOR_FIRESTORE_PORT', emulatorConfig.ports.firestore.toString());
    scriptProperties.setProperty('FIREBASE_EMULATOR_AUTH_PORT', emulatorConfig.ports.auth.toString());
    scriptProperties.setProperty('FIREBASE_EMULATOR_FUNCTIONS_PORT', emulatorConfig.ports.functions.toString());
    scriptProperties.setProperty('FIREBASE_EMULATOR_STORAGE_PORT', emulatorConfig.ports.storage.toString());
    
    console.log(`Émulateurs Firebase ${useEmulators ? 'activés' : 'désactivés'}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de la configuration des émulateurs:', error);
    return false;
  }
}

/**
 * Fonction pour configurer rapidement Firebase avec vos paramètres spécifiques
 * À exécuter UNE SEULE FOIS pour initialiser la configuration
 */
function setupFirebaseConfig() {
  // Configuration Firebase pour Sigma Nova
  const config = {
    apiKey: "AIzaSyCwMFmQNCOf7LHA2iKKMrU77kIM2rAvC9w",
    authDomain: "sigma-nova.firebaseapp.com", 
    databaseURL: "https://sigma-nova-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "sigma-nova",
    storageBucket: "sigma-nova.firebasestorage.app", 
    messagingSenderId: "421595462220", 
    appId: "1:421595462220:web:d69ac8eb028c01ee4512e",
    functionsRegion: "europe-west1"
  };
  
  // Appel à la fonction de configuration
  const result = setFirebaseConfig(config);
  
  // Configuration des émulateurs (désactivés par défaut)
  configureEmulators(false);
  
  console.log("Configuration Firebase terminée avec résultat:", result);
  return result;
}
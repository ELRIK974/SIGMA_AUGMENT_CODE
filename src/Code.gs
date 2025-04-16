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
  try {
    console.log('doGet appelé avec paramètres:', e ? JSON.stringify(e) : 'aucun paramètre');

    // Vérifier si l'application est en mode maintenance
    if (isMaintenanceMode()) {
      console.log('Application en mode maintenance');
      return HtmlService.createTemplateFromFile('maintenance')
        .evaluate()
        .setTitle('SIGMA - Maintenance')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }

    // --- DÉBUT DU BLOC REMPLACÉ ---
    let pageToServe = 'index'; // Page par défaut

    if (e && e.parameter && e.parameter.page) {
      const requestedPage = e.parameter.page.replace(/[^a-zA-Z0-9_-]/g, '');
      console.log(`Page demandée: ${requestedPage}`);

      let filePath;
      // *** Définir explicitement les chemins pour les pages dans des sous-dossiers ***
      if (requestedPage === 'login') {
        filePath = 'html/login'; // CORRECTION : Pointer vers html/login.html
      } else if (requestedPage === 'admin_users') {
         filePath = 'html/admin/users'; // ASSUMPTION : admin_users.html est dans html/admin/
                                         // Si ce n'est pas le cas, ajuste ce chemin !
      } else {
        // Pour les autres pages (index, emprunts, stocks, modules, etc.)
        // Supposer qu'elles sont à la racine de src/
        filePath = requestedPage;
      }

      try {
        console.log(`Tentative de chargement du template depuis: ${filePath}`);
        // Vérifier l'existence du fichier via createTemplateFromFile
        HtmlService.createTemplateFromFile(filePath);
        pageToServe = filePath; // Le chemin est valide, on l'utilise
        console.log(`Page à servir définie sur: ${pageToServe}`);
      } catch (error) {
        console.error(`Impossible de trouver ou charger le fichier template: ${filePath}`, error);
        // Si le fichier demandé n'est pas trouvé, afficher une page d'erreur
        return createErrorPage('Page non trouvée',
                               `La page demandée (${requestedPage}) n'existe pas ou n'est pas accessible. Chemin tenté: ${filePath}`,
                               'Retourner à l\'accueil');
      }
    }
    // --- FIN DU BLOC REMPLACÉ ---

    console.log(`Accès à l'application - Page servie: ${pageToServe}`);

    // Créer et retourner la page HTML
    console.log(`Création de la page HTML à partir du fichier: ${pageToServe}`);
    try {
      const template = HtmlService.createTemplateFromFile(pageToServe);
      console.log(`Template créé avec succès pour ${pageToServe}`);

      const evaluated = template.evaluate();
      console.log(`Template évalué avec succès pour ${pageToServe}`);

      return evaluated
        .setTitle('SIGMA - Système Informatique de Gestion du Matériel')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    } catch (error) {
      console.error(`Erreur lors de la création/évaluation du template pour ${pageToServe}:`, error);
      return createErrorPage('Erreur de chargement',
                           `Impossible de charger la page ${pageToServe}. Erreur: ${error.message}`,
                           'Retourner à l\'accueil');
    }
  } catch (error) {
    // Gestion des erreurs globales
    console.error('Erreur critique dans doGet:', error);
    return createErrorPage('Erreur système',
                         'Une erreur inattendue s\'est produite lors du chargement de la page.',
                         'Retourner à l\'accueil');
  }
}

/**
 * Fonction pour inclure des fichiers HTML
 * @param {string} filename - Nom du fichier à inclure
 * @return {string} Contenu du fichier
 */
function include(filename) {
  try {
    console.log(`Tentative d'inclusion du fichier: ${filename}`);

    // Sécurité : Empêcher l'inclusion directe des fichiers serveur critiques
    if (filename.startsWith('firebase/functions/')) {
        console.error(`Tentative d'inclusion non autorisée du fichier serveur: ${filename}`);
        return `<!-- Erreur: Inclusion non autorisée du fichier ${filename} -->`;
    }

    // Gestion simplifiée des chemins de fichiers
    let content;

    try {
      // Essayer de charger le fichier tel quel
      content = HtmlService.createHtmlOutputFromFile(filename).getContent();
      console.log(`Fichier ${filename} chargé avec succès`);
    } catch (error) {
      console.error(`Erreur lors du chargement du fichier ${filename}:`, error);
      throw error; // Propager l'erreur pour une gestion plus claire
    }

    // Log pour le débogage
    if (content) {
      console.log(`Fichier ${filename} inclus avec succès (${content.length} caractères)`);
    } else {
      console.warn(`Fichier ${filename} inclus mais contenu vide ou null`);
    }

    return content;
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
    const config = {};
    const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const optionalKeys = ['databaseURL', 'functionsRegion']; // databaseURL est souvent nécessaire, mais techniquement optionnel pour certains SDKs
    const allKeys = [...requiredKeys, ...optionalKeys];

    console.log("--- Début récupération configuration Firebase ---");

    // Récupérer et logger chaque propriété
    allKeys.forEach(key => {
      const value = scriptProperties.getProperty(key);
      console.log(`Lecture Property '${key}': ${value === null ? 'null' : '"' + value + '"'}`);
      if (value !== null) {
        config[key] = value;
      }
    });

    // Valeur par défaut pour functionsRegion si non définie
    if (!config.functionsRegion) {
      config.functionsRegion = 'europe-west1';
      console.log(`Utilisation de la valeur par défaut pour functionsRegion: "${config.functionsRegion}"`);
    }

    // Vérifier que toutes les propriétés essentielles sont définies
    const missingKeys = requiredKeys.filter(key => !config[key]);

    if (missingKeys.length > 0) {
      const errorMessage = `Configuration Firebase incomplète. Clé(s) manquante(s) dans Script Properties: ${missingKeys.join(', ')}`;
      console.error(errorMessage);
      // Retourner directement l'erreur au client
      return { error: errorMessage };
    }

    // Ajouter la configuration des émulateurs si demandé
    if (includeEmulatorConfig) {
      const useEmulators = scriptProperties.getProperty('FIREBASE_USE_EMULATORS') === 'true';
      console.log(`Lecture Property 'FIREBASE_USE_EMULATORS': ${useEmulators}`);

      if (useEmulators) {
        const emulatorHost = scriptProperties.getProperty('FIREBASE_EMULATOR_HOST') || 'localhost';
        const firestorePort = parseInt(scriptProperties.getProperty('FIREBASE_EMULATOR_FIRESTORE_PORT') || '8080');
        const authPort = parseInt(scriptProperties.getProperty('FIREBASE_EMULATOR_AUTH_PORT') || '9099');
        const functionsPort = parseInt(scriptProperties.getProperty('FIREBASE_EMULATOR_FUNCTIONS_PORT') || '5001');
        const storagePort = parseInt(scriptProperties.getProperty('FIREBASE_EMULATOR_STORAGE_PORT') || '9199');

        console.log(`Lecture Property 'FIREBASE_EMULATOR_HOST': ${emulatorHost}`);
        console.log(`Lecture Property 'FIREBASE_EMULATOR_FIRESTORE_PORT': ${firestorePort}`);
        console.log(`Lecture Property 'FIREBASE_EMULATOR_AUTH_PORT': ${authPort}`);
        console.log(`Lecture Property 'FIREBASE_EMULATOR_FUNCTIONS_PORT': ${functionsPort}`);
        console.log(`Lecture Property 'FIREBASE_EMULATOR_STORAGE_PORT': ${storagePort}`);

        config.useEmulators = true;
        config.emulators = {
          firestore: { host: emulatorHost, port: firestorePort },
          auth: { host: emulatorHost, port: authPort },
          functions: { host: emulatorHost, port: functionsPort },
          storage: { host: emulatorHost, port: storagePort }
        };
        console.log('Configuration émulateurs Firebase activée et ajoutée:', JSON.stringify(config.emulators));
      }
    }

    console.log('--- Configuration Firebase finale retournée au client ---');
    console.log(JSON.stringify(config, null, 2)); // Utilise JSON.stringify avec indentation pour meilleure lisibilité dans les logs
    return config;

  } catch (error) {
    console.error('Erreur critique inattendue lors de la récupération de la configuration Firebase:', error.message || error, error.stack);
    // En cas d'erreur imprévue, retourner un objet indiquant l'erreur
    return {
      error: `Erreur serveur inattendue lors de la récupération de la configuration Firebase: ${error.message || error}`
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
 * Crée une page d'erreur personnalisée
 * @param {string} title - Titre de l'erreur
 * @param {string} message - Message d'erreur
 * @param {string} buttonText - Texte du bouton de retour
 * @return {HtmlOutput} Page d'erreur formatée
 */
function createErrorPage(title, message, buttonText) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>SIGMA - Erreur</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
          body {
            background-color: #f8f9fa;
            font-family: Arial, sans-serif;
            padding-top: 50px;
          }
          .error-container {
            max-width: 600px;
            margin: 0 auto;
            text-align: center;
            padding: 30px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          .error-icon {
            font-size: 60px;
            color: #dc3545;
            margin-bottom: 20px;
          }
          .error-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #343a40;
          }
          .error-message {
            margin-bottom: 30px;
            color: #6c757d;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error-container">
            <div class="error-icon">⚠️</div>
            <h1 class="error-title">${title}</h1>
            <p class="error-message">${message}</p>
            <a href="<?= ScriptApp.getService().getUrl(); ?>" class="btn btn-primary">${buttonText}</a>
          </div>
        </div>
      </body>
    </html>
  `;

  return HtmlService.createTemplate(htmlContent)
    .evaluate()
    .setTitle('SIGMA - Erreur')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
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
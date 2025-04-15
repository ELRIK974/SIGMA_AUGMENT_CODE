/**
 * Utilitaires de test pour les fonctionnalités Firebase dans SIGMA
 * 
 * Ce fichier contient des fonctions pour tester la connexion Firebase
 * et les opérations CRUD de base sur Firestore.
 * 
 * À utiliser uniquement en développement et test, ne pas inclure en production.
 */

/**
 * Active ou désactive le mode émulateur Firebase
 * @param {boolean} enable - True pour activer les émulateurs, false pour désactiver
 */
function toggleEmulatorMode(enable) {
  try {
    localStorage.setItem('SIGMA_USE_EMULATORS', enable ? 'true' : 'false');
    logInfo(`Mode émulateur ${enable ? 'activé' : 'désactivé'}, rafraîchissez la page pour appliquer les changements`);
    return true;
  } catch (error) {
    logError('Erreur lors de la configuration du mode émulateur', error);
    return false;
  }
}

/**
 * Exécute un test complet de la connexion Firebase et des opérations CRUD
 * @return {Promise<Object>} Résultat des tests
 */
async function testFirebaseConnection() {
  const results = {
    initialization: false,
    document: {
      creation: false,
      reading: false,
      update: false,
      deletion: false
    },
    query: false,
    transaction: false,
    errors: []
  };
  
  try {
    // 1. Tester l'initialisation Firebase
    try {
      console.log('Attempting to call ensureFirebaseInitialized. firebaseUtils is:', typeof firebaseUtils, firebaseUtils);
      await firebaseUtils.ensureFirebaseInitialized();
      results.initialization = true;
      logInfo('Test d\'initialisation Firebase réussi');
    } catch (error) {
      results.errors.push({ stage: 'initialization', error: error.toString() });
      logError('Échec du test d\'initialisation Firebase', error);
      // On arrête les tests si l'initialisation échoue
      return results;
    }
    
    // 2. Tester les opérations CRUD sur un document
    // Créer un objet test avec un horodatage unique pour éviter les conflits
    const testDocData = {
      name: 'Document Test',
      value: Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString()
    };
    
    let testDocumentId; // Renommage de la variable
    
    // 2.1 Création
    try {
      // addDocument retourne maintenant directement l'ID (string)
      testDocumentId = await firebaseUtils.addDocument('tests', testDocData); // Utilisation de la variable renommée
      results.document.creation = !!testDocumentId; // Utilisation de la variable renommée
      logInfo(`Test de création de document réussi, ID: ${testDocumentId}`); // Utilisation de la variable renommée
    } catch (error) {
      results.errors.push({ stage: 'document.creation', error: error.toString() });
      logError('Échec du test de création de document', error);
      return results;
    }
    
    // 2.2 Lecture
    try {
      console.log('[DEBUG] Type de testDocumentId avant getDocument:', typeof testDocumentId, 'Valeur:', testDocumentId); // Utilisation de la variable renommée
      console.log('[DEBUG Test] Avant Lecture - testDocumentId:', testDocumentId, 'Type:', typeof testDocumentId); // Utilisation de la variable renommée
      await new Promise(resolve => setTimeout(resolve, 500)); // Ajout d'une pause de 500ms
      const doc = await firebaseUtils.getDocument('tests', testDocumentId); // Utilisation de la variable renommée
      results.document.reading = doc && doc.name === testDocData.name;
      if (results.document.reading) {
        logInfo('Test de lecture de document réussi');
      } else {
        throw new Error('Document lu incorrect');
      }
    } catch (error) {
      results.errors.push({ stage: 'document.reading', error: error.toString() });
      logError('Échec du test de lecture de document', error);
    }
    
    // 2.3 Mise à jour
    try {
      const updateData = { value: 999, updated: true };
      console.log('[DEBUG Test] Avant Mise à Jour - testDocumentId:', testDocumentId, 'Type:', typeof testDocumentId); // Utilisation de la variable renommée
      await new Promise(resolve => setTimeout(resolve, 500)); // Ajout d'une pause de 500ms
      await firebaseUtils.updateDocument('tests', testDocumentId, updateData); // Utilisation de la variable renommée
      
      // Vérifier la mise à jour
      const updatedDoc = await firebaseUtils.getDocument('tests', testDocumentId); // Utilisation de la variable renommée
      results.document.update = updatedDoc && updatedDoc.value === 999 && updatedDoc.updated === true;
      
      if (results.document.update) {
        logInfo('Test de mise à jour de document réussi');
      } else {
        throw new Error('Mise à jour incorrecte');
      }
    } catch (error) {
      results.errors.push({ stage: 'document.update', error: error.toString() });
      logError('Échec du test de mise à jour de document', error);
    }
    
    // 3. Tester une requête
    try {
      const dbQuery = await firebaseUtils.getFirestoreDb();
      const querySnapshot = await dbQuery.collection('tests').where('updated', '==', true).limit(10).get();
      const queryResult = querySnapshot.docs.map(doc => doc.data());
      // Adapte la vérification 'results.query' pour utiliser 'queryResult'
      results.query = Array.isArray(queryResult); // Ou vérifie la longueur si tu préfères
      logInfo(`Test de requête terminé, ${queryResult.length} documents trouvés`);
    } catch (error) {
      console.error("[DEBUG] Erreur brute (Query):", error); // Log de l'erreur brute
      results.errors.push({ stage: 'query', error: error.toString() });
      logError('Échec du test de requête', error); // Garder le log existant
    }
    
    // 4. Tester une transaction
    try {
      console.log('[DEBUG Test] Avant Transaction - testDocumentId:', testDocumentId, 'Type:', typeof testDocumentId); // Utilisation de la variable renommée
      await new Promise(resolve => setTimeout(resolve, 500)); // Ajout d'une pause de 500ms
      const dbTransac = await firebaseUtils.getFirestoreDb();
      const transactionResult = await dbTransac.runTransaction(async (transaction) => {
        // Utilise dbTransac pour la référence
        const docRef = dbTransac.collection('tests').doc(testDocumentId); // Utilisation de la variable renommée
        const docSnapshot = await transaction.get(docRef);
        // Utilise la propriété .exists (pas la fonction)
        if (!docSnapshot.exists) { // Correction: .exists est une propriété
          throw new Error('Document non trouvé pour la transaction');
        }
        const newData = docSnapshot.data();
        newData.transactionTest = true;
        newData.transactionValue = 42;
        transaction.update(docRef, newData);
        return 'Transaction réussie'; // Retourne quelque chose depuis la fonction transaction
      });
      // Adapte la vérification 'results.transaction' pour utiliser 'transactionResult' et le document mis à jour
      const transactionDoc = await firebaseUtils.getDocument('tests', testDocumentId); // Utilisation de la variable renommée
      results.transaction = transactionDoc && transactionDoc.transactionTest === true && transactionDoc.transactionValue === 42;
      if (results.transaction) {
          logInfo('Test de transaction réussi');
      } else {
          // Optionnel : logguer pourquoi la vérification a échoué
          console.warn('Vérification post-transaction échouée', transactionDoc);
          throw new Error('Transaction incorrecte');
      }
    } catch (error) {
      console.error("[DEBUG] Erreur brute (Transaction):", error); // Log de l'erreur brute
      results.errors.push({ stage: 'transaction', error: error.toString() });
      logError('Échec du test de transaction', error); // Garder le log existant
    }
    
    // 2.4 Suppression (effectuée en dernier pour le nettoyage)
    try {
      await firebaseUtils.deleteDocument('tests', testDocumentId); // Utilisation de la variable renommée
      
      // Vérifier la suppression
      const deletedDoc = await firebaseUtils.getDocument('tests', testDocumentId); // Utilisation de la variable renommée
      results.document.deletion = deletedDoc === null;
      
      if (results.document.deletion) {
        logInfo('Test de suppression de document réussi');
      } else {
        throw new Error('Suppression incorrecte');
      }
    } catch (error) {
      results.errors.push({ stage: 'document.deletion', error: error.toString() });
      logError('Échec du test de suppression de document', error);
    }
    
  } catch (error) {
    results.errors.push({ stage: 'global', error: error.toString() });
    logError('Erreur générale lors des tests Firebase', error);
  }
  
  // Résumé des tests
  const allTests = [
    results.initialization,
    results.document.creation,
    results.document.reading,
    results.document.update,
    results.document.deletion,
    results.query,
    results.transaction
  ];
  
  const totalTests = allTests.length;
  const passedTests = allTests.filter(result => result === true).length;
  
  logInfo(`Tests Firebase complétés: ${passedTests}/${totalTests} tests réussis`);
  
  return results;
}

/**
 * Affiche un rapport détaillé des résultats des tests Firebase
 * @param {Object} results - Résultats des tests retournés par testFirebaseConnection
 */
function displayTestResults(results) {
  console.log('--- Résultats des tests Firebase ---');
  
  console.log(`Initialisation: ${results.initialization ? '✅' : '❌'}`);
  
  console.log('--- Opérations sur documents ---');
  console.log(`Création: ${results.document.creation ? '✅' : '❌'}`);
  console.log(`Lecture: ${results.document.reading ? '✅' : '❌'}`);
  console.log(`Mise à jour: ${results.document.update ? '✅' : '❌'}`);
  console.log(`Suppression: ${results.document.deletion ? '✅' : '❌'}`);
  console.log('-----------------------------'); // Fin groupe 'Opérations sur documents'
  
  console.log(`Requête: ${results.query ? '✅' : '❌'}`);
  console.log(`Transaction: ${results.transaction ? '✅' : '❌'}`);
  
  if (results.errors.length > 0) {
    console.group('Erreurs');
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. Étape: ${error.stage}, Erreur: ${error.error}`);
    });
    console.groupEnd();
  }
  
  console.groupEnd();
}

/**
 * Exécute et affiche les résultats des tests Firebase
 * Combine testFirebaseConnection et displayTestResults pour plus de commodité
 * @return {Promise<Object>} Résultat des tests
 */
async function runFirebaseTests() {
  const results = await testFirebaseConnection();
  displayTestResults(results);
  return results;
}

// --- Fonctions CRUD manuelles pour la page de test ---

const TEST_COLLECTION = 'testCollection'; // Nom de la collection pour les tests manuels

/**
 * Crée un document de test dans Firestore.
 * @returns {Promise<string|null>} L'ID du document créé ou null en cas d'erreur.
 */
async function createTestData() {
  console.log(`[CRUD Test] Tentative de création d'un document dans ${TEST_COLLECTION}...`);
  try {
    await firebaseUtils.ensureFirebaseInitialized(); // S'assurer que Firebase est prêt
    const docData = {
      name: "Test Document Manuel",
      timestamp: new Date(),
      value: Math.random()
    };
    const docId = await firebaseUtils.addDocument(TEST_COLLECTION, docData);
    console.log(`[CRUD Test] Document créé avec succès dans ${TEST_COLLECTION}. ID: ${docId}`);
    appendToResults(`Document créé dans ${TEST_COLLECTION} avec ID: ${docId}`, 'success');
    return docId;
  } catch (error) {
    console.error('[CRUD Test] Erreur lors de la création du document:', error);
    appendToResults(`Erreur lors de la création du document: ${error.message}`, 'error');
    return null;
  }
}

/**
 * Lit un document de test depuis Firestore par son ID.
 * @param {string} docId - L'ID du document à lire.
 * @returns {Promise<Object|null>} Les données du document ou null si non trouvé ou en cas d'erreur.
 */
async function readTestData(docId) {
  console.log(`[CRUD Test] Tentative de lecture du document ${docId} depuis ${TEST_COLLECTION}...`);
  if (!docId) {
    const errorMsg = '[CRUD Test] ID de document manquant pour la lecture.';
    console.error(errorMsg);
    appendToResults('Veuillez fournir un ID de document pour la lecture.', 'error');
    return null;
  }
  try {
    await firebaseUtils.ensureFirebaseInitialized();
    const docData = await firebaseUtils.getDocument(TEST_COLLECTION, docId);
    if (docData) {
      console.log(`[CRUD Test] Document ${docId} lu avec succès:`, docData);
      appendToResults(`Document ${docId} lu: ${JSON.stringify(docData)}`, 'success');
      return docData;
    } else {
      console.warn(`[CRUD Test] Document ${docId} non trouvé dans ${TEST_COLLECTION}.`);
      appendToResults(`Document ${docId} non trouvé dans ${TEST_COLLECTION}.`, 'error');
      return null;
    }
  } catch (error) {
    console.error(`[CRUD Test] Erreur lors de la lecture du document ${docId}:`, error);
    appendToResults(`Erreur lors de la lecture du document ${docId}: ${error.message}`, 'error');
    return null;
  }
}

/**
 * Met à jour un document de test dans Firestore.
 * @param {string} docId - L'ID du document à mettre à jour.
 * @returns {Promise<boolean>} True si la mise à jour réussit, false sinon.
 */
async function updateTestData(docId) {
  console.log(`[CRUD Test] Tentative de mise à jour du document ${docId} dans ${TEST_COLLECTION}...`);
   if (!docId) {
    const errorMsg = '[CRUD Test] ID de document manquant pour la mise à jour.';
    console.error(errorMsg);
    appendToResults('Veuillez fournir un ID de document pour la mise à jour.', 'error');
    return false;
  }
  try {
    await firebaseUtils.ensureFirebaseInitialized();
    const updateData = {
      updated: true,
      updateTimestamp: new Date()
    };
    await firebaseUtils.updateDocument(TEST_COLLECTION, docId, updateData);
    console.log(`[CRUD Test] Document ${docId} mis à jour avec succès.`);
    appendToResults(`Document ${docId} mis à jour avec succès.`, 'success');
    return true;
  } catch (error) {
    console.error(`[CRUD Test] Erreur lors de la mise à jour du document ${docId}:`, error);
    appendToResults(`Erreur lors de la mise à jour du document ${docId}: ${error.message}`, 'error');
    return false;
  }
}



/**
 * Supprime un document de test de Firestore.
 * @param {string} docId - L'ID du document à supprimer.
 * @returns {Promise<boolean>} True si la suppression réussit, false sinon.
 */
async function deleteTestData(docId) {
  console.log(`[CRUD Test] Tentative de suppression du document ${docId} de ${TEST_COLLECTION}...`);
   if (!docId) {
    const errorMsg = '[CRUD Test] ID de document manquant pour la suppression.';
    console.error(errorMsg);
    appendToResults('Veuillez fournir un ID de document pour la suppression.', 'error');
    return false;
  }
  try {
    await firebaseUtils.ensureFirebaseInitialized();
    await firebaseUtils.deleteDocument(TEST_COLLECTION, docId);
    console.log(`[CRUD Test] Document ${docId} supprimé avec succès de ${TEST_COLLECTION}.`);
    appendToResults(`Document ${docId} supprimé avec succès.`, 'success');
    return true;
  } catch (error) {
    console.error(`[CRUD Test] Erreur lors de la suppression du document ${docId}:`, error);
    appendToResults(`Erreur lors de la suppression du document ${docId}: ${error.message}`, 'error');
    return false;
  }
}

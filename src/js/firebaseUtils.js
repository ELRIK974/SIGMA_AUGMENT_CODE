// src/js/firebaseUtils.js

/**
 * @file firebaseUtils.js
 * @description Utility functions for Firebase integration (Auth, Firestore).
 * To be included in HTML templates via GAS `include()` function.
 * Relies on Firebase SDKs being loaded globally.
 */

// Ensure this script doesn't accidentally overwrite existing global variables
var firebaseUtils = (function () {
    'use strict';

    let firebaseApp = null;
    let firestoreDb = null;
    let firebaseAuth = null;
    let firebaseFunctions = null;
    let isInitialized = false;
    let initializationPromise = null;

    /**
     * Initializes Firebase connection using configuration fetched from the server.
     * @returns {Promise<void>} A promise that resolves when Firebase is initialized.
     */
    async function initFirebase() {
        if (isInitialized) {
            console.info("Firebase already initialized.");
            return Promise.resolve();
        }
        if (initializationPromise) {
            console.info("Firebase initialization already in progress.");
            return initializationPromise;
        }

        console.info("Initializing Firebase...");

        initializationPromise = new Promise((resolve, reject) => {
            // Fetch Firebase config from GAS backend
            google.script.run
                .withSuccessHandler(config => {
                    try {
                        if (!config || !config.apiKey) {
                            console.error("Firebase config received from server is invalid:", config);
                            throw new Error("Invalid Firebase configuration received from server.");
                        }
                        console.info("Firebase config received:", /*config*/ "Config received (details omitted for brevity)"); // Avoid logging sensitive keys if possible

                        // Check if Firebase app is already initialized (e.g., by another script)
                        if (!firebase.apps.length) {
                            firebaseApp = firebase.initializeApp(config);
                            console.info("Firebase App initialized successfully.");
                        } else {
                            firebaseApp = firebase.app(); // Get default app
                            console.info("Using existing Firebase App instance.");
                        }

                        firestoreDb = firebase.firestore();
                        firebaseAuth = firebase.auth();

                        // Initialize Firebase Functions if available
                        if (typeof firebase.functions === 'function') {
                            firebaseFunctions = firebase.functions();
                            console.info("Firebase Functions service obtained.");
                        } else {
                            console.warn("Firebase Functions SDK not loaded. Functions will not be available.");
                        }

                        isInitialized = true;
                        console.info("Firebase services initialized successfully.");
                        resolve();
                    } catch (error) {
                        console.error("Error initializing Firebase:", error);
                        reject(error);
                    } finally {
                        initializationPromise = null; // Reset promise after completion/failure
                    }
                })
                .withFailureHandler(error => {
                    console.error("Failed to fetch Firebase config from server:", error);
                    reject(new Error("Failed to fetch Firebase config: " + error.message));
                    initializationPromise = null; // Reset promise after failure
                })
                .getFirebaseConfig(); // Call the GAS function
        });

        return initializationPromise;
    }

    /**
     * Ensures Firebase is initialized before proceeding.
     * @returns {Promise<void>} A promise that resolves when Firebase is ready.
     */
    async function ensureFirebaseInitialized() {
        if (!isInitialized) {
            console.info("Firebase not initialized. Calling initFirebase...");
            try {
                await initFirebase();
            } catch (error) {
                console.error("Firebase initialization failed:", error);
                // Potentially show an error message to the user here
                throw error; // Re-throw the error to stop dependent operations
            }
        }
         console.info("Firebase is initialized and ready.");
         return Promise.resolve();
    }

    /**
     * Gets the Firestore database instance. Ensures initialization first.
     * @returns {Promise<firebase.firestore.Firestore>} Firestore instance.
     */
    async function getFirestoreDb() {
        await ensureFirebaseInitialized();
        if (!firestoreDb) {
             console.error("Firestore DB instance is not available after initialization.");
             throw new Error("Firestore DB instance is not available.");
        }
        return firestoreDb;
    }

    /**
     * Gets the Firebase Auth instance. Ensures initialization first.
     * @returns {Promise<firebase.auth.Auth>} Firebase Auth instance.
     */
    async function getFirebaseAuth() {
        await ensureFirebaseInitialized();
         if (!firebaseAuth) {
             console.error("Firebase Auth instance is not available after initialization.");
             throw new Error("Firebase Auth instance is not available.");
        }
        return firebaseAuth;
    }

    /**
     * Gets the Firebase Functions instance. Ensures initialization first.
     * @returns {Promise<firebase.functions.Functions|null>} Firebase Functions instance or null if not available.
     */
    async function getFirebaseFunctions() {
        await ensureFirebaseInitialized();
        if (!firebaseFunctions) {
            console.warn("Firebase Functions instance is not available. Make sure the Functions SDK is loaded.");
            return null;
        }
        return firebaseFunctions;
    }

    // --- Firestore Operations ---

    /**
     * Fetches a document from Firestore.
     * @param {string} collectionPath - Path to the collection.
     * @param {string} docId - ID of the document.
     * @returns {Promise<firebase.firestore.DocumentSnapshot>} The document snapshot.
     */
    async function getDocument(collectionPath, docId) {
        const db = await getFirestoreDb();
        try {
            const docRef = db.collection(collectionPath).doc(docId);
            const docSnap = await docRef.get();
            console.log('[DEBUG firebaseUtils.getDocument] Ligne 137 - Type de docSnap:', typeof docSnap, 'Valeur:', docSnap);
            if (docSnap.exists) {
                console.info(`Document fetched: ${collectionPath}/${docId}`, docSnap.data());
                return docSnap.data(); // Retourner les données si le document existe
            } else {
                console.info(`Document fetched: ${collectionPath}/${docId}`, 'Does not exist');
                return null; // Retourner null si le document n'existe pas
            }
        } catch (error) {
            console.error(`Error getting document ${collectionPath}/${docId}:`, error);
            throw error;
        }
    }

    /**
     * Fetches all documents from a collection.
     * @param {string} collectionPath - Path to the collection.
     * @returns {Promise<firebase.firestore.QuerySnapshot>} The query snapshot containing documents.
     */
    async function getCollection(collectionPath) {
        const db = await getFirestoreDb();
        try {
            const querySnapshot = await db.collection(collectionPath).get();
            console.info(`Collection fetched: ${collectionPath}, size: ${querySnapshot.size}`);
            return querySnapshot;
        } catch (error) {
            console.error(`Error getting collection ${collectionPath}:`, error);
            throw error;
        }
    }

    /**
     * Adds a document to a Firestore collection with an auto-generated ID.
     * @param {string} collectionPath - Path to the collection.
     * @param {object} data - Data object for the new document.
     * @returns {Promise<string>} ID of the newly created document.
     */
    async function addDocument(collectionPath, data) {
        const db = await getFirestoreDb();
        try {
            const docRef = await db.collection(collectionPath).add(data);
            console.info(`Document added to ${collectionPath} with ID: ${docRef.id}`);
            return docRef.id; // <<< CORRECTION : Retourner seulement l'ID (string)
        } catch (error) {
            console.error(`Error adding document to ${collectionPath}:`, error);
            throw error;
        }
    }

     /**
     * Sets (overwrites) a document in a Firestore collection with a specific ID.
     * Creates the document if it doesn't exist.
     * @param {string} collectionPath - Path to the collection.
     * @param {string} docId - ID of the document to set.
     * @param {object} data - Data object for the document.
     * @param {firebase.firestore.SetOptions} [options] - Optional. e.g., { merge: true }
     * @returns {Promise<void>}
     */
    async function setDocument(collectionPath, docId, data, options) {
        const db = await getFirestoreDb();
        try {
            await db.collection(collectionPath).doc(docId).set(data, options || {});
            console.info(`Document set: ${collectionPath}/${docId}`);
        } catch (error) {
            console.error(`Error setting document ${collectionPath}/${docId}:`, error);
            throw error;
        }
    }

    /**
     * Updates specific fields of a document in Firestore.
     * Fails if the document doesn't exist.
     * @param {string} collectionPath - Path to the collection.
     * @param {string} docId - ID of the document to update.
     * @param {object} data - Object with fields to update.
     * @returns {Promise<void>}
     */
    async function updateDocument(collectionPath, docId, data) {
        const db = await getFirestoreDb();
        try {
            await db.collection(collectionPath).doc(docId).update(data);
            console.info(`Document updated: ${collectionPath}/${docId}`);
        } catch (error) {
            console.error(`Error updating document ${collectionPath}/${docId}:`, error);
            throw error;
        }
    }

    /**
     * Deletes a document from Firestore.
     * @param {string} collectionPath - Path to the collection.
     * @param {string} docId - ID of the document to delete.
     * @returns {Promise<void>}
     */
    async function deleteDocument(collectionPath, docId) {
        const db = await getFirestoreDb();
        try {
            await db.collection(collectionPath).doc(docId).delete();
            console.info(`Document deleted: ${collectionPath}/${docId}`);
        } catch (error) {
            console.error(`Error deleting document ${collectionPath}/${docId}:`, error);
            throw error;
        }
    }


    // --- Auth Operations ---

    /**
     * Gets the currently signed-in user.
     * @returns {Promise<firebase.User|null>} The user object or null if not signed in.
     */
    async function getCurrentUser() {
        const auth = await getFirebaseAuth();
        return new Promise((resolve) => {
            const unsubscribe = auth.onAuthStateChanged(user => {
                unsubscribe(); // Unsubscribe after getting the initial state
                console.info("Current user:", user ? user.uid : 'None');
                resolve(user);
            });
        });
    }

    /**
     * Listens for changes in authentication state.
     * @param {function(firebase.User|null)} callback - Function to call when auth state changes.
     * @returns {function} An unsubscribe function to stop listening.
     */
    function onAuthStateChanged(callback) {
         // We need to ensure auth is ready before attaching the listener,
         // but the listener itself needs to be attached synchronously to capture
         // the initial state correctly. This is tricky.
         // Let's assume initFirebase is called early in the app lifecycle.
         if (!firebaseAuth) {
             console.warn("Firebase Auth not yet initialized. Listener might miss initial state. Call initFirebase() early.");
             // Attempt to initialize if not already doing so
             if (!initializationPromise && !isInitialized) {
                 initFirebase().catch(err => console.error("Lazy init failed in onAuthStateChanged:", err));
             }
             // Return a no-op unsubscribe function for now
             return () => {};
         }
         console.info("Attaching Auth state listener.");
         return firebaseAuth.onAuthStateChanged(callback);
    }

    /**
     * Signs out the current user.
     * @returns {Promise<void>}
     */
    async function signOut() {
        const auth = await getFirebaseAuth();
        try {
            await auth.signOut();
            console.info("User signed out successfully.");
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    }


    /**
     * Tests Firebase initialization and logging to Cloud Logging.
     * This function verifies that Firebase is properly initialized and that logs
     * are correctly sent to Google Cloud Logging (Stackdriver).
     *
     * @returns {Promise<Object>} An object containing test results
     */
    async function testInitialisation() {
        const results = {
            firebaseInitialized: false,
            firestoreConnected: false,
            authServiceAvailable: false,
            loggingTest: {
                info: false,
                warning: false,
                error: false
            },
            errors: []
        };

        try {
            // 1. Test Firebase initialization
            try {
                await ensureFirebaseInitialized();
                results.firebaseInitialized = isInitialized;
                console.info("[Test] Firebase initialization check: " + (results.firebaseInitialized ? "SUCCESS" : "FAILED"));

                // Send a test log to Cloud Logging
                if (typeof logInfo === 'function') {
                    logInfo("Firebase initialization test", { test: "initialization", timestamp: new Date().toISOString() });
                    results.loggingTest.info = true;
                } else {
                    console.warn("[Test] logInfo function not available, skipping logging test");
                }
            } catch (error) {
                results.errors.push({ stage: 'initialization', error: error.toString() });
                console.error("[Test] Firebase initialization failed:", error);
                return results; // Stop testing if initialization fails
            }

            // 2. Test Firestore connection
            try {
                const db = await getFirestoreDb();
                results.firestoreConnected = !!db;
                console.info("[Test] Firestore connection check: " + (results.firestoreConnected ? "SUCCESS" : "FAILED"));

                // Send a warning test log
                if (typeof logWarning === 'function') {
                    logWarning("Firestore connection test", { test: "firestore", timestamp: new Date().toISOString() });
                    results.loggingTest.warning = true;
                }
            } catch (error) {
                results.errors.push({ stage: 'firestore', error: error.toString() });
                console.error("[Test] Firestore connection failed:", error);
            }

            // 3. Test Auth service
            try {
                const auth = await getFirebaseAuth();
                results.authServiceAvailable = !!auth;
                console.info("[Test] Auth service check: " + (results.authServiceAvailable ? "SUCCESS" : "FAILED"));

                // Send an error test log (this is just a test, not a real error)
                if (typeof logError === 'function') {
                    logError("Auth service test", { test: "auth", timestamp: new Date().toISOString() });
                    results.loggingTest.error = true;
                }
            } catch (error) {
                results.errors.push({ stage: 'auth', error: error.toString() });
                console.error("[Test] Auth service check failed:", error);
            }

        } catch (error) {
            results.errors.push({ stage: 'global', error: error.toString() });
            console.error("[Test] Global error in testInitialisation:", error);
        }

        // Log a summary of the test results
        console.info("[Test] Firebase initialization test results:", results);
        return results;
    }

    // Public API
    return {
        initFirebase,
        ensureFirebaseInitialized,
        getFirestoreDb,
        getFirebaseAuth,
        getFirebaseFunctions,
        getDocument,
        getCollection,
        addDocument,
        setDocument,
        updateDocument,
        deleteDocument,
        getCurrentUser,
        onAuthStateChanged,
        signOut,
        testInitialisation, // Expose the new test function
        // Expose initialization state for potential checks elsewhere
        isFirebaseInitialized: () => isInitialized
    };

})(); // Immediately invoke the IIFE

console.info("firebaseUtils.js loaded."); // Log to confirm script execution

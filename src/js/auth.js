/**
 * Fonctions d'authentification pour SIGMA
 *
 * Ce fichier gère:
 * - La connexion et déconnexion
 * - La gestion des utilisateurs
 * - La vérification des rôles
 */

// Observer l'état d'authentification
async function initAuth() {
  try {
    const auth = await getAuthInstance();

    if (!auth) {
      logError("Instance Auth non disponible dans initAuth");
      return;
    }

    auth.onAuthStateChanged(user => {
      if (user) {
        // Utilisateur connecté
        logInfo('Utilisateur connecté', {
          email: user.email,
          displayName: user.displayName
        });

        // Mettre à jour l'état de l'application
        updateState({ user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        }});

        // Vérifier les rôles de l'utilisateur
        getUserRole(user);
      } else {
        // Utilisateur déconnecté
        logInfo('Utilisateur déconnecté');
        updateState({ user: null, userRole: null });

        // Vérifier si nous sommes sur une page protégée
        const currentPath = window.location.search;
        if (currentPath.includes('page=admin_') || currentPath.includes('page=emprunts') ||
            currentPath.includes('page=stocks') || currentPath.includes('page=modules') ||
            currentPath.includes('page=livraisons')) {
          window.location.href = '?page=login';
        }
      }
    });
  } catch (error) {
    logError('Erreur lors de l\'initialisation de l\'authentification', error);
  }
}

// Connecter un utilisateur avec Google
async function signInWithGoogle() {
  // Masquer les erreurs précédentes
  const errorElement = document.getElementById('login-error');
  if (errorElement) {
    errorElement.classList.add('d-none');
    errorElement.textContent = ''; // Vider le message
  }

  try {
    const auth = await getAuthInstance();

    if (!auth) {
      return Promise.reject("Instance Auth non disponible");
    }

    const provider = new firebase.auth.GoogleAuthProvider();

    return auth.signInWithPopup(provider)
      .then(result => {
        logInfo('Connexion réussie avec Google', {
          email: result.user.email,
          displayName: result.user.displayName
        });
        return result;
      })
      .catch(error => {
        logError('Erreur de connexion avec Google', error);
        const errorElement = document.getElementById('login-error');
        let errorMessage = 'Une erreur inconnue est survenue lors de la connexion.';

        switch (error.code) {
          case 'auth/popup-closed-by-user':
            errorMessage = 'Connexion annulée par l\'utilisateur.';
            break;
          case 'auth/cancelled-popup-request':
          case 'auth/popup-blocked':
            errorMessage = 'La fenêtre de connexion a été bloquée ou fermée. Veuillez réessayer.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Erreur réseau. Vérifiez votre connexion Internet.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'Ce compte utilisateur a été désactivé.';
            break;
          case 'auth/unauthorized-domain':
            errorMessage = 'Ce domaine n\'est pas autorisé pour l\'authentification.';
            break;
          // Ajouter d'autres cas spécifiques si nécessaire
          default:
            errorMessage = `Erreur de connexion : ${error.message}`; // Message par défaut plus informatif
        }

        if (errorElement) {
          errorElement.textContent = errorMessage;
          errorElement.classList.remove('d-none');
        } else {
          // Fallback si l'élément n'est pas trouvé (peu probable sur login.html)
          showNotification(errorMessage, 'error');
        }

        throw error; // Renvoyer l'erreur pour d'éventuels traitements supplémentaires
      });
  } catch (error) {
    logError('Erreur lors de l\'initialisation de l\'authentification pour la connexion', error);
    const errorElement = document.getElementById('login-error');
     if (errorElement) {
        errorElement.textContent = 'Erreur critique lors de la tentative de connexion. Contactez l\'administrateur.';
        errorElement.classList.remove('d-none');
     }
    return Promise.reject(error); // Renvoyer l'erreur
  }
}

// Déconnecter l'utilisateur
async function signOut() {
  try {
    const auth = await getAuthInstance();

    if (!auth) {
      return Promise.reject("Instance Auth non disponible");
    }

    return auth.signOut()
      .then(() => {
        logInfo('Déconnexion réussie');
        showNotification('Vous avez été déconnecté', 'info');

        // Créer une notification visuelle
        const messageElement = document.createElement('div');
        messageElement.className = 'alert alert-success fixed-top m-3';
        messageElement.innerHTML = '<strong>Déconnexion réussie!</strong> Redirection en cours...';
        document.body.appendChild(messageElement);

        // Rediriger vers la page de connexion simple après un court délai
        setTimeout(function() {
          // Construire l'URL de base
          const baseUrl = window.location.href.split('?')[0];
          // Rediriger vers la page de connexion simple
          window.location.href = baseUrl + '?page=login_simple';
        }, 1000);
      })
      .catch(error => {
        logError('Erreur de déconnexion', error);
        throw error;
      });
  } catch (error) {
    logError('Erreur lors de l\'initialisation de l\'authentification pour la déconnexion', error);
    return Promise.reject(error);
  }
}

// Obtenir l'instance Firebase Functions
async function getFunctionsInstance() {
  try {
    return await firebaseUtils.getFirebaseFunctions();
  } catch (error) {
    logError('Erreur lors de la récupération de l\'instance Firebase Functions', error);
    return null;
  }
}

// Obtenir l'instance Firestore
async function getFirestoreInstance() {
  try {
    return await firebaseUtils.getFirestoreDb();
  } catch (error) {
    logError('Erreur lors de la récupération de l\'instance Firestore', error);
    return null;
  }
}

// Obtenir l'instance Auth
async function getAuthInstance() {
  try {
    return await firebaseUtils.getFirebaseAuth();
  } catch (error) {
    logError('Erreur lors de la récupération de l\'instance Auth', error);
    return null;
  }
}

// Obtenir le rôle de l'utilisateur
async function getUserRole(user) {
  if (!user) {
    logWarning('Tentative de récupération du rôle pour un utilisateur null');
    return;
  }

  try {
    // Vérifier d'abord si l'utilisateur a des custom claims
    // Force un rafraîchissement du token pour obtenir les dernières custom claims
    await user.getIdToken(true);
    const idTokenResult = await user.getIdTokenResult();

    if (idTokenResult.claims && idTokenResult.claims.role) {
      // Utiliser le rôle des custom claims
      const role = idTokenResult.claims.role;
      updateState({ userRole: role });
      logInfo('Rôle utilisateur récupéré depuis custom claims', { role });
      return;
    }

    // Si pas de custom claims, essayer de récupérer depuis Firestore (compatibilité)
    const db = await getFirestoreInstance();

    if (!db) {
      logError("Instance Firestore non disponible dans getUserRole");
      return;
    }

    const userDoc = await db.collection('users').doc(user.uid).get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      updateState({ userRole: userData.role });
      logInfo('Rôle utilisateur récupéré depuis Firestore', { role: userData.role });

      // Appeler la Cloud Function pour migrer ce rôle vers custom claims
      try {
        const functions = await getFunctionsInstance();
        if (functions) {
          const getUserRoleFunction = functions.httpsCallable('getUserRole');
          await getUserRoleFunction({ uid: user.uid });
          logInfo('Migration du rôle vers custom claims demandée');
        }
      } catch (fnError) {
        logWarning('Erreur lors de la migration du rôle vers custom claims', fnError);
        // Continuer quand même, car le rôle Firestore a été récupéré
      }
    } else {
      // Si l'utilisateur n'existe pas dans Firestore, utiliser le rôle par défaut
      updateState({ userRole: 'utilisateur' });
      logInfo('Rôle par défaut utilisé', { role: 'utilisateur' });
    }
  } catch (error) {
    logError('Erreur lors de la récupération du rôle', error);
  }
}

// Vérifier si l'utilisateur a un rôle spécifique
function hasRole(requiredRole) {
  const { userRole } = appState;

  // Si l'utilisateur est admin, il a accès à tout
  if (userRole === 'admin') return true;

  // Sinon, vérifier le rôle spécifique
  if (requiredRole === 'regisseur') {
    return userRole === 'regisseur' || userRole === 'admin';
  }

  // Pour le rôle 'utilisateur', tous les utilisateurs connectés y ont accès
  if (requiredRole === 'utilisateur') {
    return !!userRole;
  }

  return false;
}

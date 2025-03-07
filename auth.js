import { db, auth } from './firebase';
import { serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    updatePassword,
    signInWithPopup,
    GoogleAuthProvider,
    OAuthProvider,
    getAuth,
} from 'firebase/auth';

const provider = new OAuthProvider('apple.com');

export const doCreateUserWithEmailAndPassword = async (firstName, lastName, email, password) => {
    try {
      const createUser = await createUserWithEmailAndPassword(auth, email, password);
      const uid = createUser.user.uid;
  
      // Send email verification using async/await
      await sendEmailVerification(createUser.user);
  
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, {
        firstName: firstName,
        lastName: lastName,
        avatar: '',
        subscribedToEmail: false,
        onBoarding: false,
        plan: 'FREE',
        subscriptionToken: ''
      });
  
      return createUser;
    } catch (error) {
      console.error("Error creating user:", error);
      // Handle the error (e.g., show a message to the user)
    }
  };

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    const docRef = doc(db, 'users', user.uid);

    const docSnapx = await getDoc(docRef);

    if (docSnapx.exists()) {
        const dataAdditionalUser = docSnapx.data(); 

        await setDoc(docRef, {
            firstName: dataAdditionalUser.firstName,
            lastName: dataAdditionalUser.lastName,
            subscribedToEmail: dataAdditionalUser.subscribedToEmail,
            avatar: dataAdditionalUser.avatar
        });
    } else {
        await setDoc(docRef, {
            firstName: user.displayName.split(' ')[0],
            lastName: user.displayName.split(' ')[1],
            avatar: user.photoURL,
            subscribedToEmail: false
        });
    }
    


    /**
     * Uploads a post to the 'decks' collection in the Firestore database.
     * If the document does not exist, it creates a new document with the current timestamp.
     *
     * @return {Promise<void>} A promise that resolves when the post is uploaded successfully.
    */
    const createUserDocument = async () => {
        const docRef = doc(db, 'decks', user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            const datax = {
                creationDate: serverTimestamp(),
            };

            await setDoc(docRef, datax);
        }
    };

    createUserDocument();
};

export const doSignInWithApple = async () => {
    const auth = getAuth();
    signInWithRedirect(auth, provider);

    getRedirectResult(auth)
        .then(async (result) => {
          const credential = OAuthProvider.credentialFromResult(result);
          if (credential) {
            // You can also get the Apple OAuth Access and ID Tokens.
            const accessToken = credential.accessToken;
            const idToken = credential.idToken;
          }
          // The signed-in user info.
          const user = result.user;
          const docRef = doc(db, 'users', user.uid);
          await setDoc(docRef, {
              // c: user.displayName,
              // avatar: '',
              subscribedToEmail: false
          });
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          console.log('APPLE ERROR:', error, errorCode, errorMessage);
          // The credential that was used.
          const credential = OAuthProvider.credentialFromError(error);
      
          // ...
        });
}

export const doSignOut = async() => {
   auth.signOut();
};

export const doPasswordReset = (email) => {
    sendPasswordResetEmail(auth, email);
    // await auth.signOut()
};

export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
    });
};

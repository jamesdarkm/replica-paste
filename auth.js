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
} from 'firebase/auth';

export const doCreateUserWithEmailAndPassword = async (firstName, lastName, email, password) => {
    const createUser = await createUserWithEmailAndPassword(auth, email, password);
        const uid = createUser.user.uid;

        const docRef = doc(db, 'users', uid);
        await setDoc(docRef, {
            firstName: firstName,
            lastName: lastName,
            avatar: '',
            subscribedToEmail: false
        });

        return createUser;
};

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;



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

export const doSignOut = () => {
    return auth.signOut();
};

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
    return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
    });
};

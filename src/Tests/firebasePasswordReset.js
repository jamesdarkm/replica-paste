// firebasePasswordReset.js
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const auth = getAuth();

export const sendCustomPasswordResetLink = async (email) => {
  const actionCodeSettings = {
    url: 'http://localhost:5000/reset-password', // Custom reset page URL (can be any route on your domain)
    handleCodeInApp: true, // Optional: if you want to handle in-app navigation
  };

  try {
    await sendPasswordResetEmail(auth, email, actionCodeSettings);
    console.log('Password reset email sent!');
  } catch (error) {
    console.error('Error sending reset email:', error);
  }
};

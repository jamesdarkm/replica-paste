import admin from 'firebase-admin';
import { createRequire } from 'module'; // Use this to dynamically import JSON files in ES modules

const require = createRequire(import.meta.url); // Create a require function for importing JSON
const serviceAccount = require('./serviceAccount.json'); // Import the JSON file

// Initialize the Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://replica-paste-default-rtdb.europe-west1.firebasedatabase.app"
});

const authAdmin = admin.auth();
export { authAdmin }; // Use export instead of module.exports

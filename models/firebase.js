const {initializeApp} = require("firebase/app");
const {getFirestore} = require('firebase/firestore');
const { getAuth } = require('firebase/auth');


if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}


const firebaseConfig = {
    apiKey: process.env.API_KEY,   
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
};
  

const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app);


module.exports = {db, auth};


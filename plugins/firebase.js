import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/database';
import 'firebase/auth';

if (!firebase.apps.length) {

    const config = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.FIREBASE_DATABASE_URL,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
    }

    const user = process.env.FIREBASE_USER;
    const password = process.env.FIREBASE_USER_PASSWORD;

    firebase.initializeApp(config)

    firebase.auth().signInWithEmailAndPassword(user, password).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        //console.log(errorCode, errorMessage);
    });

    //firebase.firestore().settings({timestampsInSnapshots: true})
}

const firestore = firebase.firestore();
const db = firebase.database()

export { firestore, firebase, db }
import firebase from 'firebase/app'
import 'firebase/firestore'

if (!firebase.apps.length) {

    const config = require(process.env.FIREBASE_CONFIGURATION);

    firebase.initializeApp(config)
    firebase.firestore().settings({timestampsInSnapshots: true})
}

const firestore = firebase.firestore()

export {firestore, firebase}
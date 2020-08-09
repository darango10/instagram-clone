import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBlTNeRoCtwr5pGt24buXWu3loILNA6whc",
    authDomain: "igclone123.firebaseapp.com",
    databaseURL: "https://igclone123.firebaseio.com",
    projectId: "igclone123",
    storageBucket: "igclone123.appspot.com",
    messagingSenderId: "731185222026",
    appId: "1:731185222026:web:a5ea3ea1645f081ea13873",
    measurementId: "G-W5HLD72R4M"
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};

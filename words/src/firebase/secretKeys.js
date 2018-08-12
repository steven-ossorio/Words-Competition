import * as firebase from "firebase";
import Config from "./firebaseConfigs.js";

let config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId
};

export default (!firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app());

import * as firebase from "firebase";
import Config from "./firebaseConfigs.js";

let config;
if (process.env.NODE_ENV === "production") {
  config = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    databaseURL: process.env.databaseURL,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId
  };
} else {
  config = {
    apiKey: Config.apiKey,
    authDomain: Config.authDomain,
    databaseURL: Config.databaseURL,
    projectId: Config.projectId,
    storageBucket: Config.storageBucket,
    messagingSenderId: Config.messagingSenderId
  };
}

export default (!firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app());

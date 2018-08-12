import * as firebase from "firebase";
import Config from "./firebaseConfigs.js";

let config = {
  apiKey: Config.apiKey,
  authDomain: Config.authDomain,
  databaseURL: Config.databaseURL,
  projectId: Config.projectId,
  storageBucket: Config.storageBucket,
  messagingSenderId: Config.messagingSenderId
};

export default (!firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app());

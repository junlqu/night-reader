import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

import firebaseConfig from "./firebase.config.js";
import { get_Manhuaplus_org } from "./sources/Manhuaplus_org.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

await get_Manhuaplus_org()
.then(data => {
  Object.keys(data).forEach(async (name) => {
    const sources = doc(firestore, `sources/website/manhuaplus.org/${name}`);
    const mh = {
      name: name,
      url: data[name],
    };
      setDoc(sources, mh, { merge: true })
      .then(() => {console.log("Document written with ID: ", name)})
      .catch((error) => {console.error("Error adding document: ", error)});
  });
});

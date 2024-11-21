import express from "express";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

import firebaseConfig from "./firebase.config.js";

const app = express();
const port = 5050;

const firebase = initializeApp(firebaseConfig);
const fb = getFirestore(firebase);

app.get("/get_mhp", async (req, res) => {
  const col = collection(fb, "sources/website/manhuaplus.org");
  await getDocs(col)
  .then((docu) => {
    let mh = {};
    docu.forEach((doc) => {mh[doc.id] = doc.data()});
    res.send(mh);
  })
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
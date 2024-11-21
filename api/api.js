import express from "express";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, getDocs } from "firebase/firestore";

import firebaseConfig from "./firebase.config.js";
import { extract_Manhuaplus_org } from "./sources/Manhuaplus_org.js";

const app = express();
const port = 5050;

const firebase = initializeApp(firebaseConfig);
const fb = getFirestore(firebase);

// Get all the manhuas from the Manhuaplus website
app.get("/get_mhp", async (req, res) => {
  const col = collection(fb, "sources/website/manhuaplus.org");
  await getDocs(col)
  .then((docu) => {
    let mh = {};
    docu.forEach((doc) => {mh[doc.id] = doc.data()});
    res.send(mh);
  })
  .catch((err) => res.send(err));
});

// Get a specific manhua from the Manhuaplus website
app.get("/manhua/mhp/:id", async (req, res) => {
  const docu = doc(fb, `sources/website/manhuaplus.org/${req.params.id}`);
  await getDoc(docu)
  .then((d) => res.send(d.data()))
  .catch((err) => res.send(err));
});

// Get a specific manhua chapter from the Manhuaplus website
app.get("/manhua/mhp/:id/:chapter", async (req, res) => {
  const imgs = await extract_Manhuaplus_org(req.params.id, req.params.chapter);
  res.send(imgs);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
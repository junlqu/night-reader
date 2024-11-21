import express from "express";

import { get_Manhuaplus_org } from "./sources/Manhuaplus_org.js";

const app = express();
const port = 5050;

app.get("/get_mhp", async (req, res) => {
  await get_Manhuaplus_org()
  .then(data => res.send(data));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
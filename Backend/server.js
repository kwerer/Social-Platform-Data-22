import express from "express";
import cors from "cors";
import { getPostData } from "./index.js";
import { TiktokDataComments, TiktokDataPost } from "./config.js";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/sendTiktokDataPost", async (req, res) => {
  const data = req.body;

  await TiktokDataPost.doc(data.postUserDataObject.uniqueId).set(data);
  res.send({ msg: "Post Added" });
});
app.post("/sendTiktokDataComments", async (req, res) => {
  const data = req.body;
  await TiktokDataComments.add(data);
  res.send({ msg: "Comments Added" });
});

app.listen(4001, () => {
  console.log("Up and running 4001");
});

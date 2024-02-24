import express from "express";

const router = express.Router();

router.route("/signup").post(async (req, res) => {
  if (!req.body) {
    res.status(400).send();
  }
  const { id, name, image } = req.body;
  console.log("New user request: ", id, name, image);
  if (!id || !name) {
    res.status(400).send();
  }
  //TODO: create new user logic
  res.status(200).send();
});

export default router;

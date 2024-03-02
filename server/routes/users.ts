import express from "express";
import { StreamChat } from "stream-chat";

const router = express.Router();
const streamChat = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_PRIVATE_KEY!
);

const TOKEN_USER_ID_MAP = new Map<string, string>();

router.route("/").get(async (req, res) => {
  res.status(200).send("All users ok!");
});

router.route("/signup").post(async (req, res) => {
  if (!req.body) {
    res.status(400).send();
  }
  const { id, name, image } = req.body;
  console.log("New user request: ", id, name, image);
  if (!id || !name) {
    res.status(400).send();
  }
  //check for existing users, because upsert doesnt discern between new and existing users
  const existingUsers = await streamChat.queryUsers({ id });
  if (existingUsers.users.length > 0) {
    return res.status(400).send("User with given ID already exists");
  }
  await streamChat.upsertUser({ id, name, image });
  res.status(200).send();
});

router.route("/login").post<{ Body: { id: string } }>(async (req, res) => {
  const { id } = req.body;
  console.log("New user login: ", req.body, id);
  if (!id) {
    res.status(400).send();
  }
  const {
    users: [user],
  } = await streamChat.queryUsers({ id });
  if (!user) {
    return res.status(401).send("No user found.");
  }
  const token = streamChat.createToken(id);
  const { name, image } = user;
  TOKEN_USER_ID_MAP.set(token, user.id);
  res.status(200).json({
    token,
    user: { id: user.id, name, image },
  });
});

router.route("/logout").post<{ Body: { token: string } }>(async (req, res) => {
  const token = req.body.token;
  if (!token) {
    res.status(400).send();
  }

  const id: string | undefined = TOKEN_USER_ID_MAP.get(token);
  if (!id) return res.status(400).send();

  await streamChat.revokeUserToken(id, new Date());
  TOKEN_USER_ID_MAP.delete(token);
  res.status(200).send();
});

router
  .route("/feedback")
  .post<{ Body: { feedback: string; title?: string } }>(async (req, res) => {
    const { feedback, title } = req.body;
    console.log(feedback, title);
    res.status(200).send();
  });

export default router;

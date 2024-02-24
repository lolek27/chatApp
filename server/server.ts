import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import users from "./routes/users";

const app = express();
app.use(express.json());
const corsOptions = {
  origin: process.env.CLIENT_URL,
};
app.use(cors(corsOptions));

app.use("/users", users);

app.listen({ port: parseInt(process.env.PORT!) });

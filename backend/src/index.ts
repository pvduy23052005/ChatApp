import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import allRoute from "./routes/index.route";
import { connectDatabase } from "./config/database";
import cookieParser from "cookie-parser"
import cors from "cors";

const port: string | number = process.env.PORT || 5000;
const app: Express = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

connectDatabase();

allRoute(app);

app.listen(port, () => {
  console.log(`Server is running ${port}`);
})
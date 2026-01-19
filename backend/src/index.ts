import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import allRoute from "./routes/index.route";
import { connectDatabase } from "./config/database";

const port: string | number = process.env.PORT || 5000;
const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDatabase();

allRoute(app);

app.listen(port, () => {
  console.log(`Server is running ${port}`);
})
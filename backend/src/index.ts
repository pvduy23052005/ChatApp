import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

const port: string | number = process.env.PORT || 5000;
const app: Express = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use("/", (req: Request, res: Response) => {
  res.send("api runing");
})

app.listen(port, () => {
  console.log(`Server is running ${port}`);
})
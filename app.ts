import * as dotenv from "dotenv";
import express from "express";
import * as bodyParser from "body-parser";
import { secretRouter } from "./routes/secretRouter";

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use("/orders", secretRouter);

app.listen(process.env.PORT, () => {
    console.log("Node server started running");
});
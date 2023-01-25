import * as dotenv from "dotenv";
import express from "express";
import * as bodyParser from "body-parser";
import { secretRouter } from "./routes/secretRouter";
import { Secret } from "./types/secret";

const app = express();
dotenv.config();
app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Pass to next layer of middleware
    next();
});
app.use(bodyParser.json());
app.use("/", secretRouter);

app.listen(process.env.PORT, () => {
    console.log("Node server started running");
});
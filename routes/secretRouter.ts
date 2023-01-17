import express, { Request, Response } from "express";
import * as orderModel from "../models/secretModel";
import { Secret } from "../types/secret";
const secretRouter = express.Router();

secretRouter.post("/", async (req: Request, res: Response) => {
    const secret: Secret = req.body;
    orderModel.create(secret, (err: Error, orderId: number) => {
        if (err) {
            return res.status(500).json({ "message": err.message });
        }

        res.status(200).json({ "orderId": orderId });
    });
});

secretRouter.get("/:hash", async (req: Request, res: Response) => {
    const hash: string = String(req.params.hash);
    orderModel.findOne(hash, (err: Error, secret: Secret) => {
        if (err) {
            return res.status(500).json({ "message": err.message });
        }
        res.status(200).json({ "data": secret });
    })
});

export { secretRouter };
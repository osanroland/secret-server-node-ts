import express, { Request, Response } from "express";
import * as secretModel from "../models/secretModel";
import { Secret } from "../types/secret";
const secretRouter = express.Router();

secretRouter.post("/secret", async (req: Request, res: Response) => {

    const secretText = req.body.secretText
    const expiresAt = req.body.expiresAt
    const remainingViews = req.body.remainingViews

    secretModel.create(secretText, expiresAt, remainingViews, (err: Error, secret: Secret) => {
        if (err) {
            return res.status(500).json({ "message": err.message });
        }
        res.status(201).json(secret);
    });
});

secretRouter.get("/secret/:hash", async (req: Request, res: Response) => {
    const hash: string = String(req.params.hash);
    secretModel.findOne(hash, (err: Error, secret: Secret) => {
        if (err) {
            return res.status(500).json({ "message": err.message });
        }
        console.log(validate(secret))
        if (validate(secret)) {
            secret.remainingViews = decreaseRemainingViews(secret.remainingViews)
            res.status(200).json({ "secret": secret });
        } else {
            res.status(200).json({ "message" : 'Secret is no longer available' });
        }
        
    })

    const validate =(secret: Secret) => {
        const now = new Date()
        if (secret.expiresAt < now || secret.remainingViews === 0) return false;
        return true;
    }

    const decreaseRemainingViews = (remainingViews: number) => {
        return remainingViews = remainingViews - 1;
    }
});

export { secretRouter };
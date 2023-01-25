import express, { Request, Response } from "express";
import * as secretModel from "../models/secretModel";
import { Secret } from "../types/secret";
const secretRouter = express.Router();
const xml = require('xml');

secretRouter.post("/secret", async (req: Request, res: Response) => {

    const secretText = req.body.secretText
    const expiresAt = req.body.expireAfter
    const remainingViews = req.body.expireAfterViews

    const acceptType = req.headers.accept

    secretModel.create(secretText, expiresAt, remainingViews, (err: Error, secret: Secret) => {
        if (err) {
            return res.status(500).send({ "message": err.message });
        }

        let responseData = createResponseObjectByAcceptType(acceptType, res, secret)
        res.status(201).send(responseData);
    });
});

secretRouter.get("/secret/:hash", async (req: Request, res: Response) => {
    
    const hash: string = String(req.params.hash);

    const acceptType = req.headers.accept

    secretModel.findOne(hash, (err: Error, secret: Secret) => {
    
        if (err) {
            return res.status(500).json({ "message": err.message });
        }

        if (validate(secret)) {
            secret.remainingViews = decreaseRemainingViews(secret.remainingViews)
            secretModel.updateRemainingViews(secret, (err: Error, secret: Secret) => {
                if (err) {
                    return err;
                }
            })

            let responseData = createResponseObjectByAcceptType(acceptType, res, secret)
            
            res.status(200).send(responseData);
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

const generateXml = (secret: Secret): string => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>`
    xml += `<Secret>`

    for (const [key, value] of Object.entries(secret)) {
        xml += `<${key}>${value}</${key}>`;
    }
    xml += `</Secret>`

    return xml
}

const createResponseObjectByAcceptType = (acceptType: string | undefined, res: Response, secret: Secret): string | Secret => {
    let resObj: Secret | string
    switch (acceptType) {
        case 'text/xml':
            res.set('Content-type', 'application/xml')
            resObj = generateXml(secret)
            break;
        case 'text/json':
            res.type('text/json')
            resObj = secret
            break;
        default:
            res.type('text/json')
            resObj = secret
            break;
    }

    return resObj
}

export { secretRouter };
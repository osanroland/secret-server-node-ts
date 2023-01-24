import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";
import { Secret } from "../types/secret";


export const create = (secretText: string, expiresAt: Date, remainingViews: number,  callback: Function) => {
    const hashLength = 20
    const hash: string = generateHash(hashLength)
    const createdAt = require('moment')().format('YYYY-MM-DD HH:mm:ss')

    const queryString = "INSERT INTO secrets (hash, secret_text, created_at, expires_at, remaining_views) VALUES (?, ?, ?, ?, ?)"

    db.query(
        queryString,
        [hash, secretText, createdAt, expiresAt, remainingViews],
        (err, result) => {
            if (err) { callback(err) };

            const insertId = (<OkPacket>result).insertId;
            if (insertId !== null) {
                const secret: Secret = {
                    hash: hash,
                    secretText: secretText,
                    createdAt: createdAt,
                    expiresAt: expiresAt,
                    remainingViews: remainingViews
                }
                callback(null, secret);
            }
        }
    );
};

export const findOne = (hash: string, callback: Function) => {

    const queryString = `
        SELECT 
        s.* 
        FROM secrets AS s
        WHERE s.hash=?`

    db.query(queryString, hash, (err, result) => {
        if (err) { callback(err) }

        const row = (<RowDataPacket>result)[0];
        const secret: Secret = {
            hash: row.hash,
            secretText: row.secret_text,
            createdAt: row.created_at,
            expiresAt: row.expires_at,
            remainingViews: row.remaining_views
        }
        callback(null, secret);
    });
}

export const updateRemainingViews = (secret: Secret, callback: Function) => {

    const queryString = `UPDATE secrets SET remaining_views=?  WHERE hash=?`;

    db.query(
        queryString,
        [secret.remainingViews, secret.hash],
        (err, result) => {
            if (err) { callback(err) }
            callback(null);
        }
    );
}

const generateHash = (length: number) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
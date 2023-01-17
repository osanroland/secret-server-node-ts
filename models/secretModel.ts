import { db } from "../db";
import { OkPacket, RowDataPacket } from "mysql2";
import { Secret } from "../types/secret";


export const create = (secret: Secret, callback: Function) => {
    const queryString = "INSERT INTO secrets (hash, secret_text, created_at, expires_at, remaining_views) VALUES (?, ?, ?, ?, ?)"

    db.query(
        queryString,
        [secret.hash, secret.secretText, secret.createdAt, secret.expiresAt, secret.remainingViews],
        (err, result) => {
            if (err) { callback(err) };

            const insertId = (<OkPacket>result).insertId;
            callback(null, insertId);
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
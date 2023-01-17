"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOne = exports.create = void 0;
const db_1 = require("../db");
const create = (secret, callback) => {
    const queryString = "INSERT INTO secrets (hash, secret_text, created_at, expires_at, remaining_views) VALUES (?, ?, ?, ?, ?)";
    db_1.db.query(queryString, [secret.hash, secret.secretText, secret.createdAt, secret.expiresAt, secret.remainingViews], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        const insertId = result.insertId;
        callback(null, insertId);
    });
};
exports.create = create;
const findOne = (hash, callback) => {
    const queryString = `
        SELECT 
        s.* 
        FROM secrets AS s
        WHERE s.hash=?`;
    db_1.db.query(queryString, hash, (err, result) => {
        if (err) {
            callback(err);
        }
        const row = result[0];
        const secret = {
            hash: row.hash,
            secretText: row.secret_text,
            createdAt: row.created_at,
            expiresAt: row.expires_at,
            remainingViews: row.remaining_views
        };
        callback(null, secret);
    });
};
exports.findOne = findOne;

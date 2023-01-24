"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRemainingViews = exports.findOne = exports.create = void 0;
const db_1 = require("../db");
const create = (secretText, expiresAt, remainingViews, callback) => {
    const hashLength = 20;
    const hash = generateHash(hashLength);
    const createdAt = require('moment')().format('YYYY-MM-DD HH:mm:ss');
    const queryString = "INSERT INTO secrets (hash, secret_text, created_at, expires_at, remaining_views) VALUES (?, ?, ?, ?, ?)";
    db_1.db.query(queryString, [hash, secretText, createdAt, expiresAt, remainingViews], (err, result) => {
        if (err) {
            callback(err);
        }
        ;
        const insertId = result.insertId;
        if (insertId !== null) {
            const secret = {
                hash: hash,
                secretText: secretText,
                createdAt: createdAt,
                expiresAt: expiresAt,
                remainingViews: remainingViews
            };
            callback(null, secret);
        }
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
const updateRemainingViews = (secret, callback) => {
    const queryString = `UPDATE secrets SET remaining_views=?  WHERE hash=?`;
    db_1.db.query(queryString, [secret.remainingViews, secret.hash], (err, result) => {
        if (err) {
            callback(err);
        }
        callback(null);
    });
};
exports.updateRemainingViews = updateRemainingViews;
const generateHash = (length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

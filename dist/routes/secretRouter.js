"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.secretRouter = void 0;
const express_1 = __importDefault(require("express"));
const secretModel = __importStar(require("../models/secretModel"));
const secretRouter = express_1.default.Router();
exports.secretRouter = secretRouter;
secretRouter.post("/secret", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const secretText = req.body.secretText;
    const expiresAt = req.body.expiresAt;
    const remainingViews = req.body.remainingViews;
    secretModel.create(secretText, expiresAt, remainingViews, (err, secret) => {
        if (err) {
            return res.status(500).json({ "message": err.message });
        }
        res.status(201).json(secret);
    });
}));
secretRouter.get("/secret/:hash", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = String(req.params.hash);
    secretModel.findOne(hash, (err, secret) => {
        if (err) {
            return res.status(500).json({ "message": err.message });
        }
        console.log(validate(secret));
        if (validate(secret)) {
            secret.remainingViews = decreaseRemainingViews(secret.remainingViews);
            res.status(200).json({ "secret": secret });
        }
        else {
            res.status(200).json({ message: 'Secret is no longer available' });
        }
    });
    const validate = (secret) => {
        const now = new Date();
        if (secret.expiresAt < now || secret.remainingViews === 0)
            return false;
        return true;
    };
    const decreaseRemainingViews = (remainingViews) => {
        return remainingViews = remainingViews - 1;
    };
}));

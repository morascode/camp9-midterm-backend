"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function isAuth(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('You are not authenticated');
    }
    try {
        const { userId } = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        res.locals.userId = userId;
        next();
    }
    catch (err) {
        return res.status(401).send('You are not authenticated');
    }
}
exports.isAuth = isAuth;

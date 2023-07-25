"use strict";
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
exports.editProfileController = exports.getSingleUserController = exports.checkAuthController = exports.logoutController = exports.loginController = exports.signupController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const signupController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const checkEmail = yield prisma.user.findUnique({
        where: { email: req.body.email },
    });
    if (checkEmail) {
        return res.status(422).send('Email already exists');
    }
    const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 12);
    const newUser = yield prisma.user.create({
        data: {
            email: req.body.email,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        },
        include: {
            bookings: true,
        },
    });
    const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
        secure: process.env.NODE_ENV !== 'development',
    });
    res.send(newUser.email);
});
exports.signupController = signupController;
const loginController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return res.status(422).send('Email does not exist');
    }
    //check if password is correct
    const isValidPassword = yield bcrypt_1.default.compare(password, user.password);
    if (!isValidPassword) {
        return res.status(422).send('Invalid password');
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
    });
    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV !== 'development',
    });
    //authenticating user
    res.send({ token });
});
exports.loginController = loginController;
//=======================================================
// logoutController
//=======================================================
const logoutController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //delete the cookie
    //send a response"Logged out"
    res.clearCookie('token');
    res.status(200).send('Logged out');
});
exports.logoutController = logoutController;
const checkAuthController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        const decode = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ auth: true });
    }
    catch (err) {
        console.log('dont call this');
        res.status(200).json({ auth: false });
    }
});
exports.checkAuthController = checkAuthController;
const getSingleUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: { id: res.locals.userId },
        include: {
            bookings: true,
        },
    });
    res.send(user);
});
exports.getSingleUserController = getSingleUserController;
const editProfileController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.update({
        where: { id: req.body.id },
        data: {
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        },
    });
    res.send(user);
});
exports.editProfileController = editProfileController;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editUserValidation = exports.userValidation = void 0;
const zod_1 = require("zod");
exports.userValidation = zod_1.z.object({
    firstName: zod_1.z.string().min(2).max(50),
    lastName: zod_1.z.string().min(2).max(50),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(50),
});
exports.editUserValidation = zod_1.z.object({
    firstName: zod_1.z.string().min(2).max(50),
    lastName: zod_1.z.string().min(2).max(50),
    email: zod_1.z.string().email(),
});

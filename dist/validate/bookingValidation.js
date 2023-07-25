"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingValidation = void 0;
const zod_1 = require("zod");
exports.bookingValidation = zod_1.z.object({
    seats: zod_1.z.array(zod_1.z.string()),
    time: zod_1.z.string(),
    date: zod_1.z.string(),
    movieId: zod_1.z.string(),
});

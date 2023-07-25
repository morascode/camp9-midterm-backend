"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookmarkToggleValidation = exports.bookmarkParamsValidation = void 0;
const zod_1 = require("zod");
exports.bookmarkParamsValidation = zod_1.z.number().int();
exports.bookmarkToggleValidation = zod_1.z.object({
    createBookmark: zod_1.z.boolean(),
});

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
Object.defineProperty(exports, "__esModule", { value: true });
const createUser_1 = require("./seed/createUser");
const fetchMovies_1 = require("./seed/fetchMovies");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
function createMockData() {
    return __awaiter(this, void 0, void 0, function* () {
        // Generate mock data for User model
        const userPromises = (0, createUser_1.createUsers)(10);
        (0, fetchMovies_1.fetchNowPlayingMovies)();
        yield Promise.all([...userPromises]);
    });
}
createMockData()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));

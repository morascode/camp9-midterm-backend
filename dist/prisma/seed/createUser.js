"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUsers = void 0;
const { PrismaClient } = require('@prisma/client');
const faker = require('faker');
const prisma = new PrismaClient();
function createUsers(num) {
    const users = Array.from({ length: num }, () => prisma.user.create({
        data: {
            email: faker.internet.email(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            password: faker.internet.password(),
        },
    }));
    return users;
}
exports.createUsers = createUsers;

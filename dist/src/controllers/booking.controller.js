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
exports.bookingController = exports.getBookingController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getBookingController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingId = req.params.id;
    const booking = yield prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            seats: true,
            screening: true,
        },
    });
    res.send(booking);
});
exports.getBookingController = getBookingController;
const bookingController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let screening = yield prisma.screening.findFirst({
        where: {
            date: req.body.date,
            time: req.body.time,
            movieId: req.body.movieId,
        },
    });
    if (!screening) {
        screening = yield prisma.screening.create({
            data: {
                date: req.body.date,
                time: req.body.time,
                movieId: req.body.movieId,
            },
        });
    }
    const booking = yield prisma.booking.create({
        data: {
            screening: {
                connect: {
                    id: screening.id,
                },
            },
            seats: {
                create: req.body.seats.map(seat => ({
                    row: seat.split('-')[0],
                    number: parseInt(seat.split('-')[1]),
                    price: seat.split('-')[0] === 'A'
                        ? 12.95
                        : seat.split('-')[0] === 'F'
                            ? 16.95
                            : 14.95,
                })),
            },
            user: {
                connect: {
                    id: res.locals.userId,
                },
            },
            totalPrice: req.body.seats.reduce((acc, seat) => {
                if (seat.split('-')[0] === 'A') {
                    return acc + 12.95;
                }
                else if (seat.split('-')[0] === 'F') {
                    return acc + 16.95;
                }
                else {
                    return acc + 14.95;
                }
            }, 0),
        },
    });
    res.status(201).send(booking);
});
exports.bookingController = bookingController;

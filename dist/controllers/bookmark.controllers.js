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
exports.toggleBookmarkController = exports.getBookmarksController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getBookmarksController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield prisma.user.findFirst({
        where: {
            id: res.locals.userId,
        },
        include: {
            bookmarks: true,
        },
    });
    const bookmarks = (_a = user === null || user === void 0 ? void 0 : user.bookmarks) !== null && _a !== void 0 ? _a : [];
    res.status(200).send(bookmarks);
});
exports.getBookmarksController = getBookmarksController;
//controller to add or remove a bookmark
const toggleBookmarkController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.createBookmark) {
        try {
            yield prisma.movie.update({
                where: {
                    tmdbId: parseInt(req.params.id),
                },
                data: {
                    bookmarkedBy: {
                        connect: {
                            id: res.locals.userId,
                        },
                    },
                },
            });
            res
                .status(200)
                .send(`Movie with the id ${req.params.id} added to bookmarks.`);
        }
        catch (err) {
            res
                .status(404)
                .send(`Cannot create the bookmark. Movie with the id ${req.params.id} not found.`);
        }
    }
    else {
        try {
            yield prisma.movie.update({
                where: {
                    tmdbId: parseInt(req.params.id),
                },
                data: {
                    bookmarkedBy: {
                        disconnect: {
                            id: res.locals.userId,
                        },
                    },
                },
            });
            res
                .status(200)
                .send(`Movie with the id ${req.params.id} removed from bookmarks.`);
        }
        catch (err) {
            res
                .status(404)
                .send(`Cannot delete the bookmark. Movie with the id ${req.params.id} not found.`);
        }
    }
});
exports.toggleBookmarkController = toggleBookmarkController;

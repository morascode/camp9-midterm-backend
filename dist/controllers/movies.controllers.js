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
exports.getNowPlayingMoviesController = exports.getMovieBySearchQueryController = exports.getMovieDetailsController = exports.getAllmovies = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllmovies = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const pages = (parseInt(req.query.page) - 1) * 20;
    const genres = req.query.with_genres;
    const genreArray = genres.split(',').map(id => Number(id));
    const moviesCount = yield prisma.movie.count();
    if (genreArray[0] === 0 && genreArray.length === 1) {
        const allmovies = yield prisma.movie.findMany({
            skip: pages,
            take: 20,
            include: {
                genres: true,
            },
        });
        res.send({
            page: pages / 20 + 1,
            total_pages: moviesCount,
            results: allmovies,
            genres: allmovies.length > 0 ? allmovies[0].genres : [],
        });
    }
    else {
        const moviesCount = yield prisma.movie.count({
            where: {
                genres: {
                    some: {
                        id: {
                            in: genreArray,
                        },
                    },
                },
            },
        });
        const movies = yield prisma.movie.findMany({
            skip: pages,
            take: 20,
            where: {
                genres: {
                    some: {
                        id: {
                            in: genreArray,
                        },
                    },
                },
            },
            include: {
                genres: true,
            },
        });
        res.send({
            page: pages / 20 + 1,
            total_pages: moviesCount,
            results: movies,
            genres: movies.length > 0 ? movies[0].genres : [],
        });
    }
});
exports.getAllmovies = getAllmovies;
const getMovieDetailsController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const movieId = req.params.movieId;
    const movie = yield prisma.movie.findUnique({
        where: { tmdbId: parseInt(movieId) },
        include: {
            genres: true,
            credits: true,
        },
    });
    res.send(Object.assign(Object.assign({}, movie), { credits: {
            cast: movie === null || movie === void 0 ? void 0 : movie.credits[0].cast,
            crew: movie === null || movie === void 0 ? void 0 : movie.credits[0].crew,
        } }));
});
exports.getMovieDetailsController = getMovieDetailsController;
const getMovieBySearchQueryController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const searchQuery = req.query.query;
    const movies = yield prisma.movie.findMany({
        where: {
            title: {
                contains: String(searchQuery),
                mode: 'insensitive',
            },
        },
    });
    res.send(movies);
});
exports.getMovieBySearchQueryController = getMovieBySearchQueryController;
const getNowPlayingMoviesController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const genreIds = req.query.genres;
    const genreArray = genreIds.split('-').map(id => Number(id));
    if (genreArray[0] === 0 && genreArray.length === 1) {
        const movies = yield prisma.movie.findMany({
            take: 20,
            include: {
                genres: true,
            },
        });
        res.send(movies);
    }
    else {
        const movies = yield prisma.movie.findMany({
            take: 20,
            include: {
                genres: true,
            },
            where: {
                genres: {
                    some: {
                        id: {
                            in: genreArray,
                        },
                    },
                },
            },
        });
        res.send(movies);
    }
});
exports.getNowPlayingMoviesController = getNowPlayingMoviesController;

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
exports.fetchNowPlayingMovies = void 0;
const axios_1 = __importDefault(require("axios"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const TMDB_API_KEY = 'b83392e48747a4845ad80c2011eaa33b';
const TMDB_API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US`;
const TMDB_MOVIE_URL = 'https://api.themoviedb.org/3/movie';
function getNumberOfPages() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(TMDB_API_URL);
            return response.data.total_pages;
        }
        catch (error) {
            console.error('Error fetching total number of pages:');
            return 0;
        }
    });
}
function getMoviesFromPage(page = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${TMDB_API_URL}&page=${page}`);
            return response.data.results;
        }
        catch (error) {
            console.error(`Error fetching movies from page ${page}:`);
            return [];
        }
    });
}
function getMovieDetails(movieId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${TMDB_MOVIE_URL}/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`);
            return response.data;
        }
        catch (error) {
            console.error(`Error fetching movie details for movie id ${movieId}:`);
            return null;
        }
    });
}
function getMovieCredits(movieId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(`${TMDB_MOVIE_URL}/${movieId}/credits?api_key=${TMDB_API_KEY}&language=en-US`);
            return response.data;
        }
        catch (error) {
            console.error(`Error fetching movie credits for movie id ${movieId}:`);
            return null;
        }
    });
}
function fetchNowPlayingMovies() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const totalPages = yield getNumberOfPages();
            for (let page = 1; page <= totalPages; page++) {
                const movies = yield getMoviesFromPage(page);
                const moviePromises = movies.map((movie) => __awaiter(this, void 0, void 0, function* () {
                    const detailsPromise = getMovieDetails(movie.id);
                    const creditsPromise = getMovieCredits(movie.id);
                    const [details, credits] = yield Promise.all([
                        detailsPromise,
                        creditsPromise,
                    ]);
                    if (!details || !credits)
                        return;
                    // Upsert movie
                    const movieRecord = yield prisma.movie.upsert({
                        where: { tmdbId: movie.id },
                        update: {},
                        create: {
                            tmdbId: movie.id,
                            title: movie.title,
                            backdropPath: details.backdrop_path,
                            posterPath: details.poster_path,
                            releaseDate: new Date(movie.release_date),
                            runtime: details.runtime,
                            voteAverage: details.vote_average,
                            overview: movie.overview,
                        },
                    });
                    // Upsert genres
                    const genrePromises = details.genres.map((genre) => __awaiter(this, void 0, void 0, function* () {
                        yield prisma.genre.upsert({
                            where: { id: genre.id },
                            update: { name: genre.name },
                            create: { id: genre.id, name: genre.name },
                        });
                        // Connect movie and genre
                        yield prisma.movie.update({
                            where: { id: movieRecord.id },
                            data: { genres: { connect: { id: genre.id } } },
                        });
                    }));
                    yield Promise.all(genrePromises);
                    // Upsert credits
                    yield prisma.credit.upsert({
                        where: { tmdbId: credits.id },
                        update: { cast: { set: credits.cast }, crew: { set: credits.crew } },
                        create: {
                            tmdbId: credits.id,
                            cast: credits.cast,
                            crew: credits.crew,
                            movie: { connect: { id: movieRecord.id } },
                        },
                    });
                }));
                // Wait for all movie detail and credit fetching to complete
                yield Promise.all(moviePromises);
            }
        }
        catch (error) {
            console.error('Error fetching now playing movies:');
            console.error(error);
        }
        finally {
            yield prisma.$disconnect();
        }
    });
}
exports.fetchNowPlayingMovies = fetchNowPlayingMovies;

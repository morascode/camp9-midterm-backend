"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const movies_controllers_1 = require("../controllers/movies.controllers");
const router = (0, express_1.Router)();
//@route GET /api/1.0/movies/?searchQuery
//@desc Get movie by search query
//@access Public
router.get('/search', movies_controllers_1.getMovieBySearchQueryController);
//@route GET /api/1.0/movies/now-playing
//@desc Get movie in general
//@access Public
router.get('/', movies_controllers_1.getNowPlayingMoviesController);
//@route GET /api/1.0/movies/allmovies
//@desc Get all movies
//@access Public
router.get('/allmovies', movies_controllers_1.getAllmovies);
//@route GET /api/1.0/movies/:movieId
//@desc Get movie details
//@access Public
router.get('/:movieId', movies_controllers_1.getMovieDetailsController);
exports.default = router;

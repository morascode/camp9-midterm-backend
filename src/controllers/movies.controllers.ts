import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import { number } from 'zod';

const prisma = new PrismaClient();

export const getAllmovies = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const pages = (parseInt(req.query.page as string) - 1) * 20;
  const genres = req.query.with_genres as string;
  const genreArray = genres.split(',').map(id => Number(id));
  const moviesCount = await prisma.movie.count();
  if (genreArray[0] === 0 && genreArray.length === 1) {
    const allmovies = await prisma.movie.findMany({
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
  } else {
    const moviesCount = await prisma.movie.count({
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
    const movies = await prisma.movie.findMany({
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
};

export const getMovieDetailsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const movieId = req.params.movieId;
  const movie = await prisma.movie.findUnique({
    where: { tmdbId: parseInt(movieId) },
    include: {
      genres: true,
      credits: true,
    },
  });
  res.send({
    ...movie,
    credits: {
      cast: movie?.credits[0].cast,
      crew: movie?.credits[0].crew,
    },
  });
};

export const getMovieBySearchQueryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const searchQuery = req.query.query;
  const movies = await prisma.movie.findMany({
    where: {
      title: {
        contains: String(searchQuery),
        mode: 'insensitive',
      },
    },
  });
  res.send(movies);
};

type Movie = {
  id: number;
  tmdbId: number;
  title: string;
  releaseDate: Date;
  backdropPath: string;
  posterPath: string;
  runtime: number;
  voteAverage: number;
  overview: string;
};

export const getNowPlayingMoviesController = async (
  req: Request<{}, {}, Movie>,
  res: Response,
  next: NextFunction
) => {
  const genreIds = req.query.genres as string;
  const genreArray = genreIds.split('-').map(id => Number(id));
  if (genreArray[0] === 0 && genreArray.length === 1) {
    const movies = await prisma.movie.findMany({
      take: 20,
      include: {
        genres: true,
      },
    });
    res.send(movies);
  } else {
    const movies = await prisma.movie.findMany({
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
};

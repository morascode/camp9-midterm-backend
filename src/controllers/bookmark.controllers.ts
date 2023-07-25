import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { BookmarkParams, BookmarkToggle } from '../validate/bookmarkValidation';

const prisma = new PrismaClient();

export const getBookmarksController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = await prisma.user.findFirst({
    where: {
      id: res.locals.userId,
    },
    include: {
      bookmarks: true,
    },
  });
  const bookmarks = user?.bookmarks ?? [];
  res.status(200).send(bookmarks);
};

//controller to add or remove a bookmark
export const toggleBookmarkController = async (
  req: Request<any, any, BookmarkToggle>,
  res: Response,
  next: NextFunction
) => {
  if (req.body.createBookmark) {
    try {
      await prisma.movie.update({
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
    } catch (err) {
      res
        .status(404)
        .send(
          `Cannot create the bookmark. Movie with the id ${req.params.id} not found.`
        );
    }
  } else {
    try {
      await prisma.movie.update({
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
    } catch (err) {
      res
        .status(404)
        .send(
          `Cannot delete the bookmark. Movie with the id ${req.params.id} not found.`
        );
    }
  }
};

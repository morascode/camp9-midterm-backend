import { Router } from 'express';
import {
  checkAuthController,
  editProfileController,
  getSingleUserController,
  loginController,
  logoutController,
  signupController,
} from '../controllers/user.controllers';
import { validateBody, validateParams } from '../middleware/validateResource';
import { editUserValidation, userValidation } from '../validate/userValidation';
import { loginValidation } from '../validate/loginValidation';
import {
  bookmarkParamsValidation,
  bookmarkToggleValidation,
} from '../validate/bookmarkValidation';
import { isAuth } from '../middleware/isAuth';
import {
  getBookmarksController,
  toggleBookmarkController,
} from '../controllers/bookmark.controllers';

const router = Router();

//@route POST /api/1.0/user/signup
//@desc Register user
//@access Public

router.post('/signup', validateBody(userValidation), signupController);

//@route POST /api/1.0/user/login
//@desc Login user
//@access Public

router.post('/login', validateBody(loginValidation), loginController);

//@route POST /api/1.0/user/logout
//@desc Logout user
//@access Public

router.delete('/logout', logoutController);

//@route GET /api/1.0/user/checkauth
//@desc check if user is authenticated
//@access Public

router.get('/checkauth', checkAuthController);

//@route GET /api/1.0/user/:id
//@desc Get a single user
//@access Private

router.get('/', isAuth, getSingleUserController);

//@route PATCH /api/1.0/user/editprofile
//@desc Edit user profile
//@access Private

router.patch(
  '/editprofile',
  isAuth,
  validateBody(editUserValidation),
  editProfileController
);

//@route GET /api/1.0/user/bookmarks
//@desc fetches all the bookmarks for the currently logged in user
//@access Public

router.get('/bookmarks', isAuth, getBookmarksController);

//@route PATCH /api/1.0/user/bookmarks/:id
//@desc creates/removes a new movie bookmark for the currently login user
//@access Public

router.patch(
  '/bookmarks/:id',
  isAuth,
  validateParams(bookmarkParamsValidation),
  validateBody(bookmarkToggleValidation),
  toggleBookmarkController
);

export default router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const validateResource_1 = require("../middleware/validateResource");
const userValidation_1 = require("../validate/userValidation");
const loginValidation_1 = require("../validate/loginValidation");
const bookmarkValidation_1 = require("../validate/bookmarkValidation");
const isAuth_1 = require("../middleware/isAuth");
const bookmark_controllers_1 = require("../controllers/bookmark.controllers");
const router = (0, express_1.Router)();
//@route POST /api/1.0/user/signup
//@desc Register user
//@access Public
router.post('/signup', (0, validateResource_1.validateBody)(userValidation_1.userValidation), user_controllers_1.signupController);
//@route POST /api/1.0/user/login
//@desc Login user
//@access Public
router.post('/login', (0, validateResource_1.validateBody)(loginValidation_1.loginValidation), user_controllers_1.loginController);
//@route POST /api/1.0/user/logout
//@desc Logout user
//@access Public
router.delete('/logout', user_controllers_1.logoutController);
//@route GET /api/1.0/user/checkauth
//@desc check if user is authenticated
//@access Public
router.get('/checkauth', user_controllers_1.checkAuthController);
//@route GET /api/1.0/user/:id
//@desc Get a single user
//@access Private
router.get('/', isAuth_1.isAuth, user_controllers_1.getSingleUserController);
//@route PATCH /api/1.0/user/editprofile
//@desc Edit user profile
//@access Private
router.patch('/editprofile', isAuth_1.isAuth, (0, validateResource_1.validateBody)(userValidation_1.editUserValidation), user_controllers_1.editProfileController);
//@route GET /api/1.0/user/bookmarks
//@desc fetches all the bookmarks for the currently logged in user
//@access Public
router.get('/bookmarks', isAuth_1.isAuth, bookmark_controllers_1.getBookmarksController);
//@route PATCH /api/1.0/user/bookmarks/:id
//@desc creates/removes a new movie bookmark for the currently login user
//@access Public
router.patch('/bookmarks/:id', isAuth_1.isAuth, (0, validateResource_1.validateParams)(bookmarkValidation_1.bookmarkParamsValidation), (0, validateResource_1.validateBody)(bookmarkValidation_1.bookmarkToggleValidation), bookmark_controllers_1.toggleBookmarkController);
exports.default = router;

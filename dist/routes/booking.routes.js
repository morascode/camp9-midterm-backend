"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const booking_controller_1 = require("../controllers/booking.controller");
const bookingValidation_1 = require("../validate/bookingValidation");
const validateResource_1 = require("../middleware/validateResource");
const isAuth_1 = require("../middleware/isAuth");
const router = (0, express_1.Router)();
//@route POST /api/1.0/booking
//@desc booking movie by user
//@access Public // private
router.post('/', (0, validateResource_1.validateBody)(bookingValidation_1.bookingValidation), isAuth_1.isAuth, booking_controller_1.bookingController);
//@route POST /api/1.0/booking
//@desc getting back booked movie by user
//@access Public // private
router.get('/:id', isAuth_1.isAuth, booking_controller_1.getBookingController);
exports.default = router;

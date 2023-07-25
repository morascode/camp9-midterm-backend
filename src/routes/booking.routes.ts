import { Router } from 'express';
import {
  bookingController,
  getBookingController,
} from '../controllers/booking.controller';
import { bookingValidation } from '../validate/bookingValidation';
import { validateBody } from '../middleware/validateResource';
import { isAuth } from '../middleware/isAuth';

const router = Router();

//@route POST /api/1.0/booking
//@desc booking movie by user
//@access Public // private

router.post('/', validateBody(bookingValidation), isAuth, bookingController);

//@route POST /api/1.0/booking
//@desc getting back booked movie by user
//@access Public // private

router.get('/:id', isAuth, getBookingController);

export default router;

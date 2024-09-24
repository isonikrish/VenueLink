import express from 'express';
import {protectRoute} from '../utils/protectRoute.js';
import { addToBookMark, getBookmarkedEvents } from '../controllers/user.js';

const router = express.Router();
router.post('/bookmark',protectRoute,addToBookMark)
router.get('/bookmarkedEvents',protectRoute,getBookmarkedEvents);

export default router;
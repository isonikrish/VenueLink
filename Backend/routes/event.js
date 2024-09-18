import express from 'express';
import { protectRoute } from '../utils/protectRoute.js';
import {handleCreateEvent, handleFindUser, handleUserEvents} from '../controllers/event.js'
import multer from 'multer'
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/create',protectRoute, upload.single('eventThumbnail'),handleCreateEvent);
router.get('/findUser',protectRoute,handleFindUser);
router.get('/getEvents', protectRoute, handleUserEvents);
export default router;
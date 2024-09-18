import express from 'express';
import {protectRoute} from '../utils/protectRoute.js';
import { handleMyNotifications } from '../controllers/notifications.js';
const router = express.Router();
router.get('/mynotifications',protectRoute,handleMyNotifications)

export default router;
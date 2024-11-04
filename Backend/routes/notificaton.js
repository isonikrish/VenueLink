import express from 'express';
import {protectRoute} from '../utils/protectRoute.js';
import { handleMyNotifications,deleteMyNotifications } from '../controllers/notifications.js';
const router = express.Router();
router.get('/mynotifications',protectRoute,handleMyNotifications)
router.delete("/deleteNotifications",protectRoute,deleteMyNotifications)
export default router;
import express from 'express';
import {handleSignup, handleLogin, handleLogout, getMe} from '../controllers/auth.js';
import { protectRoute } from '../utils/protectRoute.js';
const router = express.Router();


router.post("/signup",handleSignup);
router.post("/login",handleLogin);
router.post("/logout",handleLogout);
router.get('/me',protectRoute,getMe);


export default router;
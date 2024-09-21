import express from "express";
import { protectRoute } from "../utils/protectRoute.js";
import {
  handleCreateEvent,
  handleFindUser,
  handleUserEvents,
  handleGetEvents,
  handleGetEventById,
  handleAttendEvent,
  handleCheckIn
} from "../controllers/event.js";
import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/create",
  protectRoute,
  upload.single("eventThumbnail"),
  handleCreateEvent
);
router.get("/findUser", protectRoute, handleFindUser);
router.get("/getEvents", protectRoute, handleUserEvents);
router.post("/publicEvents", handleGetEvents);
router.get("/event/:id", handleGetEventById);
router.post("/attend",protectRoute,handleAttendEvent);
router.post('/checkin', handleCheckIn);
export default router;

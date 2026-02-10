import express from "express";
import { protect } from "../middleware/authMiddleware";
import { startTimer } from "../controllers/timeTrackerController";
import { stopTimer } from "../controllers/timeTrackerController";
import { totalTime } from "../controllers/timeTrackerController";

const router =  express.Router();

router.post("/start-timer",protect,startTimer);
router.post("/stop-timer",protect,stopTimer);
router.get("/total-time/:taskId",protect,totalTime);

export default router;
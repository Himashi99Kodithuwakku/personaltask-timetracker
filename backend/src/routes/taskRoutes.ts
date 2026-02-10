import express from "express";
import { protect } from "../middleware/authMiddleware";
import { addCategory } from "../controllers/taskController";
import { getCategories } from "../controllers/taskController";
import { createTask } from "../controllers/taskController";
import { getAllTasks } from "../controllers/taskController";
import { updateStatus } from "../controllers/taskController";
import { updateTaskData } from "../controllers/taskController";
import { deleteTask } from "../controllers/taskController";


const router =  express.Router();

router.post("/add-category",protect,addCategory);
router.get("/load-category",protect,getCategories);
router.post("/add-task",protect,createTask);
router.get("/all-tasks",protect,getAllTasks);
router.put("/task-status/:id",protect,updateStatus);
router.put("/update-task/:taskId",protect,updateTaskData);
router.delete("/delete-task/:taskId",protect,deleteTask);

export default router;
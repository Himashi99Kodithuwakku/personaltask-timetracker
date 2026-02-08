import express from "express";
import { protect } from "../middleware/authMiddleware";

const router =  express.Router();

router.get("/",protect, (req,res)=>{
    res.json({message:"Protected user tasks data "});

});

export default router;
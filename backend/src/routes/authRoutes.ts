import express from "express";
import { userRegister } from "../controllers/authController";
import { userLogin } from "../controllers/authController";

const router = express.Router();

router.post("/user-register",userRegister);
router.post("/user-login",userLogin);

export default router;

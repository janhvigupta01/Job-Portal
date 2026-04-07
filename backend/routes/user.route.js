import express from "express";
import { register, login,logout, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated  from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router=express.Router();

router.route("/register").post(singleUpload,register);
router.post('/login',login);
router.get('/logout',logout);
router.route("/profile/update").post(isAuthenticated,singleUpload,updateProfile);

export default router;
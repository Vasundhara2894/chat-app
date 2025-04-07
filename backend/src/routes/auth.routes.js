import express from "express"
import {checkAuth, login, logout, signup ,updateProfile} from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
  
const router=express.Router();
router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);

router.put("/update-profile", protectRoute,updateProfile); // y put becs we r updating the profile pic and
// y protect is if user is authenticated we update
router.get("/check",protectRoute,checkAuth);
export default router;
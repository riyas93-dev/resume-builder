import express from "express";
import { getUserById, getUserResumes, loginUser, registerUser } from "../Controllers/UserController.js";
import protect from "../middlewares/authMiddleware.js";

//api routers for users

const userRouter = express.Router();
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/register', protect, getUserById); //add protect middleware to get the user
userRouter.get('/resumes', protect, getUserResumes); //api to get user resumes

export default userRouter;
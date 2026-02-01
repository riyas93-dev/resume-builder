import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import resumeRouter from "./routes/resumeRoutes.js";
import aiRouter from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

//database connection
await connectDB();

//middleware
app.use(express.json());  // all the requests will be passed using json method
app.use(cors()) 

//routes
//home route
app.get('/', (req, res)=> res.send("Server is live..."));
app.use('/api/users', userRouter); //apis to register and other functions for users
app.use('/api/resumes', resumeRouter);
app.use('/api/ai', aiRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
//functions to register new users and login existing users

import User from "../models/User.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import Resume from "../models/resume.js";

const generateToken = (userId)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: '7d'}) //token gets expired in 7 days
    return token;
}

//controller for user registration
//POST: /api/users/register  
export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        //check if required fields are present
        if(!name || !email || !password){
            return res.status(400).json({message: 'Missing required fields'})
        }

        //check if user already exists by email
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: 'User already exists'})
        }

        //create new user and encrypt password first
        const hashedPassword = await bcrypt.hash(password, 10);
        //add new user to db
        const newUser = await User.create({
            name, email, password: hashedPassword
        })

        //generating token to send in the response
        //return success message
        const token = generateToken(newUser._id); // this id is auto generate by mongodb
        newUser.password = undefined;

        return res.status(201).json({message: 'User created successfully', token, user: newUser});

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

//controller for existing user login
//POST: /api/users/login

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        //check if user already exists by email
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({message: 'Invaild email or password'})
        }

        //check if password is correct
        if(!user.comparePassword(password)){
            return res.status(400).json({message: 'Invaild email or password'});
        }

        //if user found successfully provide token and send success message
        const token = generateToken(user._id)
        user.password = undefined;

        return res.status(200).json({message: 'Login successful', token, user});

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

//controllers for getting user by Id
// GET: /api/user/data

export const getUserById = async (req, res) => {
    try {
        const userId = req.userId; //getting user id from request 
                                   //but not adding user id in the request for this we will user middlewares(auth middleware)

        //check if user exist
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({message: 'User not found'});
        }
        //return user
        user.password = undefined;
        return res.status(200).json({user});

    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

//controller function for getting user resumes
// GET: /api/users/resumes

export const getUserResumes = async (req, res) => {
    try{
        const userId = req.userId; //we are getting this userid from request body using protect middleware

        // return user resume using userid
        const resumes = await Resume.find({userId});
        return res.status(200).json({resumes})
    } catch(error){
        return res.status(400).json({message: error.message});
    }
}

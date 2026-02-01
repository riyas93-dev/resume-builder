import mongoose from "mongoose";

//function to connect with db

const connectDB = async () => {
    try{
        mongoose.connection.on("connected", ()=>{console.log("Database connected successfully.")})

        let mongodbURI = process.env.MONGODB_URI;
        const projectName = 'resume-builder';

        if(!mongodbURI){
            throw new Error("MONGODB_URI environment variable not set")
        }

        if(mongodbURI.endsWith('/')){ // if we didnt remove / from end then
            mongodbURI = mongodbURI.slice(0, -1); //it will remove /
        }

        await mongoose.connect(`${mongodbURI}/${projectName}`)
    } catch(error){
        console.log("Error connecting to db", error)
    }
}

export default connectDB;
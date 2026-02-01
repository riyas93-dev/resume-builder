import imagekit from "../configs/imagekit.js";
import Resume from "../models/resume.js";
import fs from 'fs';

// controller for creating a new resume
// POST: /api/resumes/create

export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {title} = req.body;

        // create new resume
        const newResume = await Resume.create({userId, title})
        //return success message
        return res.status(201).json({message: 'Resume created successfully.', resume: newResume})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

//controller for deleting the resume
//DELETE: /api/resumes/delete

export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params; //resume id will be available in params

        //deleting resume  with given resume id corresponding to the given user
        await Resume.findOneAndDelete({userId, _id: resumeId});


        //return success message
        return res.status(200).json({message: 'Resume deleted successfully.'})
    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

//controller function to get user resume by id
// GET: /api/resume/get

export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params; //resume id will be available in params

        const resume = await Resume.findOne({userId, _id: resumeId}) //fetch resume from  database

        if(!resume){
            //if resume not found with this id
            return res.status(404).json({message: "Resume not found."});
        }
        
        //updating these properties of resume befor sending it 
        resume.__v = undefined; //?? what is this property
        resume.createdAt = undefined;
        resume.updatedAt = undefined;

        //resume sent
        return res.status(200).json({resume})

    } catch (error) {
        res.status(400).json({message: error.message})
    }
}

//get resume by id if public
//GET: /api/resumes/public
export const getPublicResumeById = async (req, res) => {
    try {
        const { resumeId } = req.params;
        const resume = await Resume.findOne({public: true, _id: resumeId});

        if(!resume){
            return res.status(404).json({message: "Resume not found"})
        }

        return res.status(200).json({ resume });
        
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

//update resume controller
//PUT: /api/resumes/update
export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const { resumeId, resumeData, removeBackground} = req.body;
        const image = req.file;  //using multer middleware file property will be added
        
        //to save the changes in database
        let resumeDataCopy;
        if(typeof resumeData === 'string'){
            resumeDataCopy = await JSON.parse(resumeData)
        }else{
            resumeDataCopy = structuredClone(resumeData);
        }

        //uploading image in imagekit and transforming the photo if present
        if(image){
            const imageBufferData = fs.createReadStream(image.path);

            //the response will be url
            const response = await imagekit.files.upload({
            file: imageBufferData,
            fileName: 'resume.png',
            folder: 'user-resumes',
            transformation: {
                pre: 'w-300, h-300,fo-face,z-0.75' + 
                (removeBackground ? ',e-bgremove' : '')
            }
            });

            resumeDataCopy.personal_info.image = response.url;
        }

        //adds updated resume in the database
        const resume = await Resume.findOneAndUpdate({userId, _id: resumeId}, resumeDataCopy, 
        {new: true});

        return res.status(200).json({message: "Saved Successfully", resume});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }
}

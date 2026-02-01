import multer from "multer";


//creating upload middleware using multer
const storage = multer.diskStorage({});

const upload = multer({storage});

export default upload;
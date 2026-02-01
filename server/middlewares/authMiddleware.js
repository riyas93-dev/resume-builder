import jwt from 'jsonwebtoken'

//added user id in the request
const protect = async(req, res, next) => {
    const token = req.headers.authorization;
    //verify token
    if(!token){
        return res.status(401).json({ message: 'Unauthorized'});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId; //added
        next(); // will execute controller function
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized'});
    }
}

export default protect;
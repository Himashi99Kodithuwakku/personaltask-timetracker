import jwt from "jsonwebtoken";
import { Request,Response,NextFunction } from "express";


interface JwtPayload {
    userId: string;
    email?: string;
}

export const protect = (req:Request & { user?: JwtPayload} , res:Response, next: NextFunction) =>{
    const token = req.headers.authorization?.split(" ")[1];

    if(!token) {
        return res.status(401).json({message:"token missing"});
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY as string)as JwtPayload;
        req.user = decoded;
        next();
    }catch{
        res.status(401).json({message:"Invalid token"});
    }

};
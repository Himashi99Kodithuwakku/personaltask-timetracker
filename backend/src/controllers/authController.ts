import { Request } from "express";
import { Response } from "express";

import pool from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userRegister = async (req:Request, res: Response) =>{
    const {username, email, password} = req.body;
  // check user email already existing in the system
    const checkEmail  =  await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    if(checkEmail.rows.length>0 ){
        return res.status(400).json({message:"Email Already exists use a different email"})
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/;

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            message: "Password must be at least 10 characters and include uppercase, lowercase, number and special character"
        });
    }

    try{
        const hashed_password = await bcrypt.hash(password,10);

        const result = await pool.query(
            `
            INSERT INTO users (username,email,password)
            VALUES ($1,$2,$3) RETURNING userId, username, email
            `,
            [username,email,hashed_password]
        );
        res.status(201).json({message:"User Registered Successfully" ,user:result.rows[0]});
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Register Failed"});
    }
};

export const userLogin = async (req: Request, res:Response)=>{
    const {email,password} = req.body;

    try{
        const user = await pool.query(
           "SELECT * FROM users WHERE email =$1",
           [email]
        );

        if (user.rows.length === 0)
            return res.status(404).json({message: "User not Found"});

        const valid_password = await bcrypt.compare(password, user.rows[0].password);

        if(!valid_password) return res.status(400).json({message:"Incorrect Password, Try again. "});

        const token = jwt.sign(
            {userId : user.rows[0].userId},
            process.env.JWT_SECRET_KEY as string,
            {expiresIn :'1d'}
        );
        res.status(200).json({token, user:{userId:user.rows[0].userId, email:user.rows[0].email}});


    }catch(err){
        res.status(500).json({message:"Login Failed"});
    }
};
import pool from "../config/db";
import { Request } from "express";
import { Response } from "express";


export const addCategory = async (req:Request, res: Response)=>{
    try{
        const {categoryName} = req.body;

        const result = await pool.query(
            `INSERT INTO taskCategory (categoryName)
            VALUES($1)`,
            [categoryName]

        );

        res.status(201).json({message:"New Category added Successfully" ,category :result.rows[0]});


    }catch(err){
        console.error(err);
        res.status(500).json({message:" Category creation Failed"});
    }

};

export const getCategories = async(req:Request, res:Response)=>{
    try{
        const result = await pool.query(`
            SELECT categoryId AS "categoryId", categoryName AS "categoryName" FROM taskCategory ORDER BY created_at DESC
            `);

        res.status(200).json(result.rows);

    }catch(err){
        console.error(err);
        res.status(500).json({message:" Load Categories  Failed"});
    }

};

interface JwtPayload {
    userId: string;
    email?: string;
}


export const createTask = async(req:Request & { user?: JwtPayload}, res:Response)=>{
    try{
        const {task,dueDate,categoryId} = req.body;
        const userId = req.user?.userId;

        if(!userId){
            return res.status(401).json({message:"Unauthrorized, User Id is missing "});
        }

        const result = await pool.query(`
            INSERT INTO userTask(userId, categoryId, task_text,due_date)
            VALUES($1,$2,$3,$4)
            `,
            [userId,categoryId,task,dueDate]
        );

     res.status(201).json({message:"Your Task added Successfully" ,category :result.rows[0]});


    }catch(err){
        console.error(err);
        res.status(500).json({message:" Task creation Failed"});
    }
};


export const getAllTasks = async(req:Request & { user?: JwtPayload}, res:Response)=>{
    try{

        const userId = req.user?.userId;
        const result = await pool.query(`

            SELECT ut.taskid, ut.task_text, tc.categoryname, ut.is_completed,ut.due_date
            FROM usertask ut
            JOIN taskcategory tc ON ut.categoryid = tc.categoryid
            WHERE ut.userid = $1 
            ORDER BY CAST(SUBSTRING(ut.taskid FROM 2) AS INTEGER) ASC
            `,[userId]);

        res.json(result.rows);

    }catch(err){
        console.error(err);
        res.status(500).json({message:" Failed to load task "});
    }

};

export const updateStatus = async(req:Request, res:Response)=>{
    try{

        const taskId = req.params.id;
        const {is_completed} = req.body;
        const result = await pool.query(`

            UPDATE usertask
            SET is_completed = $1, updated_at = CURRENT_TIMESTAMP
            WHERE taskid = $2

            `,[is_completed,taskId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task completed" });

    }catch(err){
        console.error(err);
        res.status(500).json({message:" Failed to update completed  task "});
    }

};



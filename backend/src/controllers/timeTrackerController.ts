import { Request } from "express";
import { Response } from "express";
import pool from "../config/db";


export const startTimer = async (req:Request, res:Response)=>{
    try{
        const {taskId} = req.body;

        await pool.query(`

            INSERT INTO timetracker (taskid,starttime)
            VALUES ($1, NOW());
            `,[taskId]);

        res.json({message:"Timer started"});

    }catch(err){
        console.error(err);
        res.status(500).json({message:"Start Timer failed"})
    }
};

export const stopTimer = async (req:Request, res:Response)=>{
        try{
        const {taskId} = req.body;

        await pool.query(`

           UPDATE timetracker
           SET endtime = NOW(),
           duration = NOW() - starttime
           WHERE taskId = $1 AND endtime IS NULL

            `,[taskId]);

        res.json({message:"Timer stopped"});

    }catch(err){
        console.error(err);
        res.status(500).json({message:"End Timer failed"})
    }
};

export const totalTime = async (req:Request, res:Response)=>{
    const {taskId} = req.params;

    const result = await pool.query(`
            SELECT COALESCE (SUM (EXTRACT(EPOCH from duration)),0) AS total_seconds
            FROM timetracker
            WHERE taskid = $1

        `,[taskId]);

    res.json(result.rows[0]);
};



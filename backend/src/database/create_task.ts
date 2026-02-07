import pool from "../config/db";

const taskTable = async () =>{
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS userTask(
                id SERIAL PRIMARY KEY,
                taskId VARCHAR(10) UNIQUE,
                userId VARCHAR(10),
                categoryId VARCHAR(10),
                task_text TEXT NOT NULL,
                is_completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE,
                FOREIGN KEY (categoryId) REFERENCES taskCategory(categoryId)


            );
        `);

        await pool.query(`
            CREATE OR REPLACE FUNCTION generate_task_id()
            RETURNS TRIGGER AS $$ 
            BEGIN 
                NEW.taskId := 'T' || LPAD(NEW.id::TEXT,3, '0');
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        await pool.query(`
            DROP TRIGGER IF EXISTS trg_task_id ON userTask;
            CREATE TRIGGER trg_task_id
            BEFORE INSERT ON userTask
            FOR EACH ROW
            EXECUTE FUNCTION generate_task_id();

        `);
        console.log("User Tasks Table created Successfully");
        process.exit();

    }catch(err){
        console.error("Unexpected error occured creating user task table",err);
        process.exit(1);
    }
};

taskTable();
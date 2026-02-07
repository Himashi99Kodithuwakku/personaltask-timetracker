import pool from "../config/db";

const timeTrackerTable = async () => {
    try{
        await pool.query(`
            CREATE TABLE IF DOES NOT EXISTS timeTracker(
                id SERIAL PRIMARY KEY,
                trackerId VARCHAR(10) UNIQUE,
                taskId VARCHAR(10),
                startTime TIMESTAMP,
                endTime TIMESTAMP,
                duration INTERVAL,

            FOREIGN KEY (taskId) REFERENCES userTask(taskId) ON DELETE CASCADE
            );
        `);

        await pool.query(`
            CREATE OR REPLACE FUNCTION generate_tracker_id()
            RETURNS TRIGGER AS $$ 
            BEGIN 
                NEW.trackerId := 'TR' || LPAD(NEW.id::TEXT,3, '0');
                RETURN NEW;
            END;

            $$ LANGUAGE plpgsql;


        `);

        await pool.query(`
            DROP TRIGGER IF EXISTS trg_tracker_id ON timeTracker,
            CREATE TRIGGER trg_tracker_id
            BEFORE INSERT ON timeTracker
            FOR EACH ROW 
            EXECUTE FUNCTION generate_tracker_id();

        `);

        console.log("Time Tracker Table created Successfully");
        process.exit();



    }catch(err){
        console.error("Unexpected error occured creating time tracker table");
        process.exit(1);
    }
};

timeTrackerTable();
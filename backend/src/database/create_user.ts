import pool from "../config/db";

// create user table
const userTable = async  () => {
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                userId VARCHAR (10) UNIQUE,
                username VARCHAR (50) NOT NULL,
                email VARCHAR (100) UNIQUE NOT NULL,
                password VARCHAR  NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            `);

            // trigger function for user id 
            await pool.query(`
                CREATE OR REPLACE FUNCTION  generate_user_id()
                RETURNS TRIGGER AS $$
                BEGIN 
                    NEW.userId := 'U' || LPAD(NEW.id::TEXT,3, '0');
                    RETURN NEW;
                END;
                $$ LANGUAGE plpgsql;   
                `);

            await pool.query(`
                DROP TRIGGER IF EXISTS trg_user_id ON users;
                CREATE TRIGGER trg_user_id
                BEFORE INSERT ON users
                FOR EACH ROW 
                EXECUTE FUNCTION generate_user_id();
                `);

            console.log("Users table created successfully");
            process.exit();
    }catch(err){
        console.error("unexpected error occured creating user table",err );
        process.exit(1);
    }
};

userTable();
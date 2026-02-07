import pool from "../config/db";

const categoryTable = async () => {
    try{
        await pool.query(`
            CREATE TABLE IF NOT EXISTS taskCategory(
                id SERIAL PRIMARY KEY,
                categoryId VARCHAR (10) UNIQUE,
                categoryName VARCHAR (100) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

            );
        `);
        
        await pool.query(`
            CREATE OR REPLACE FUNCTION generate_category_id()
            RETURNS TRIGGER AS $$ 
            BEGIN 
                NEW.categoryId := 'CAT' || LPAD(NEW.id::TEXT,3, '0');
                RETURN NEW;
            END
            $$ LANGUAGE plpgsql;
        `);

        await pool.query(`
            DROP TRIGGER IF EXISTS trg_category_id ON taskCategory;
            CREATE TRIGGER trg_category_id
            BEFORE INSERT ON taskCategory
            FOR EACH ROW 
            EXECUTE FUNCTION generate_category_id();

        `);

        console.log("Task Category Table created Successfully");
        process.exit();

    }catch(err){
        console.error("Unexpected error occured creating task category table ",err);
        process.exit(1);
    }
};

categoryTable();
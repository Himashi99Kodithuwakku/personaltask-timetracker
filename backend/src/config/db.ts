import {Pool} from "pg";

const pool = new Pool ({
    host : "localhost",
    user : "postgres",
    password : "hkdb26",
    database : "personal_task_time_tracker",
    port : 5432,
});

export default pool;
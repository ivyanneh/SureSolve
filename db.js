import pkg from "pg";  
const { Pool } = pkg;  

const pool = new Pool({
  user: "postgres", 
  host: "localhost",
  database: "suresolve", 
  password: "z>UO:%0o", 
  port: 5432, 
});
export default pool;
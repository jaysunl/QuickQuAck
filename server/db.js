const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "admin",   // change password
    host: "localhost",
    port: 5432,
    database: "main"
});

module.exports = pool;

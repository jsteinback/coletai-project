const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: 'localhost',
    port: 5432,
    database: 'db-coletai'
});

module.exports = pool;
const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: 'ec2-34-236-103-63.compute-1.amazonaws.com',
    port: 5432,
    database: 'dfucq07op878vt'
});

module.exports = pool;
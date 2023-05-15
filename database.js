const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'ysytufdjvogjso',
    password: 'd4093ed5e46efca4a0b3a64879e0a191ef4551f1b05d8f65e3a423a5e81c04cf',
    host: 'ec2-34-236-103-63.compute-1.amazonaws.com',
    port: 5432,
    database: 'dfucq07op878vt'
});

module.exports = pool;
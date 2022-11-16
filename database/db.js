const mysql = require('mysql');
const config = require('config.json');

let pool = mysql.createPool(config);

function getconnection(callback) {
    pool.getConnection(function (err, conn) {
        if(!err) {
            callback(conn);
        }
    });
}

module.exports = getconnection;
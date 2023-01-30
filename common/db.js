const mysql = require('mysql');
const {DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE, DB_CONNECTIONSLIMIT} = process.env;

const dbConfig = {
    "host": DB_HOST,
    "port": DB_PORT,
    "user": DB_USER,
    "password": DB_PASSWORD,
    "database": DB_DATABASE,
    "connectionsLimit": DB_CONNECTIONSLIMIT
}

const pool = mysql.createPool(dbConfig);

getConnection = async () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if(!err) {
                resolve(conn);
            }else {
                console.log("err : ", err);
                reject(err);
            }
        });
    })
}

module.exports = getConnection;
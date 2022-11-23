const mysql = require('mysql');
const config = require('./config.json');

let pool = mysql.createPool(config);

exports.getConnection = async () => {
    let connection = "";
    try{
        connection = await new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if(err) {
                    return reject(err);
                }
                else resolve(connection);
            });
        });
    }catch (err) {
        return {result: false, error: err};
    }

    return connection;
};
let db = require("../database/db");

exports.spacelist = async () => {

    const connection = await db.getConnection();

    let spacequeryset = [];

    let sql = `
        select spacepkey, spacenum, cookingyn
        from space
        where isactiveyn='Y'
    `;

    try{
        spacequeryset = await new Promise((resolve, reject) => {
            connection.query(sql, [], (err, rows) => {
                if(err) reject(err);
                else resolve(rows);
            })
        })
    }catch (err){
        connection.release();
        return {retcode: "-99", message: err.toString()}
    }

    connection.release();

    return {retcode: "00", spacequeryset}
}
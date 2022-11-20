let db = require("../database/db");

exports.spacelist = async () => {
    const connection = await db.getConnection();

    const getSpaceListQuery = `select spacepkey, spacenum, cookingyn from space where isactiveyn='Y'`;

    return new Promise(async (resolve) => {
        connection.query(getSpaceListQuery, [], (err, rows) => {
            resolve(err ? {retcode: "-99", message: err.toString()} : {retcode: "00", spacequeryset: rows})
        })

        connection.release();
    })
}

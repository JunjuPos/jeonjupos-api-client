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

exports.orderlist = async (spacepkey) => {
    // TODO: 주문내역 작업 필요함

    let sql = `
        select 
            sp.spacepkey, spacenum, oi.orderinfopkey, totalpayprice,
            om.menupkey, menuname, saleprice, count
        from space sp
        left join orderinfo oi on sp.spacepkey=oi.spacepkey
        join ordermenu om on oi.orderinfopkey=om.orderinfopkey
        where sp.spacepkey=? and oi.payyn='N'
    `;

    const connection = await db.getConnection();
    let spaceorderqueryset;
    try{
        spaceorderqueryset = await new Promise((resolve, reject) => {
            connection.query(sql, [spacepkey], (err, rows) => {
                if(err) reject(err);
                else resolve(rows.length > 0? rows: null);
            })
        })
    }catch (err) {
        console.log(err);
        connection.release();
        return {retcode: "-99", message: err.toString()}
    }

    connection.release();

    let space = {
        spacepkey: spaceorderqueryset[0].spacepkey,
        spacenum: spaceorderqueryset[0].spacenum,
        orderinfopkey: spaceorderqueryset[0].orderinfopkey,
        totalpayprice: spaceorderqueryset[0].totalpayprice
    }

    return {retcode: "00", space, orderlist: []}

}
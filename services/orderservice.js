const db = require("../database/db");


exports.firstordervalidation = async (spacepkey) => {
    const connection = await db.getConnection();

    const getspacequery = `
        select *
        from space sp
        join orderinfo oi on sp.spacepkey=oi.spacepkey
        where oi.eatingyn=1 and sp.spacepkey=?
    `;

    return new Promise((resolve) => {
        connection.query(getspacequery, [spacepkey], (err, rows) => {
            if(err) {
                resolve({retcode: "-99", message: err.toString()});
            }else {
                resolve(rows.length > 0 ? {retcode: "00", valid: false} : {retcode: "00", valid: true})
            }
        })

        connection.release();
    })
}


exports.gettotalpayprice = async (ordermenulist) => {
    const connection = await db.getConnection();

    const gettotalpaypricecalcuquery = `
        select saleprice * ? orderprice
        from menu
        where menupkey = ?
    `;

    let totalpayprice = 0;

    for (let ordermenu of ordermenulist) {
        const result = await new Promise((resolve) => {
            connection.query(gettotalpaypricecalcuquery, [ordermenu.count, ordermenu.menupkey], (err, rows) => {
                if(err) {
                    resolve({retcode: "-99", message: err.toString()});
                }else {
                    totalpayprice += rows[0].orderprice;
                    totalpayprice -= ordermenu.discount
                    resolve(totalpayprice);
                }
            })
        })
        if (result.retcode === "-99") {
            connection.release();
            return result;
        }
    }
    connection.release();

    return {retcode: "00", totalpayprice: totalpayprice};
}


exports.firstorder = async (spacepkey, ordermenulist, takeoutyn, totalpayprice) => {

    const connection = await db.getConnection();
    const orderinfoinsertquery = `
        insert into orderinfo (
            spacepkey, postpaidgrouppkey, ordertype, takeoutyn, 
            reservedate, reservetime, regdate, paydate, 
            totalpayprice, cashpayprice, cardpayprice, paystatus, 
            expectedrestprice, eatingyn
        ) values (
            ?, null, "N", ?, 
            "1999-01-01", "00:00:00", now(), "",
            ?, 0, 0, "unpaid",
            0, 1
        );
    `;
    const ordermenuinsertquery = `
        insert into ordermenu (
            orderinfopkey, menupkey, menuname, originprice, 
            discountyn, discountrate, saleprice, stock,
            useyn, sort, takeoutyn, takeinyn,
            takeoutprice, count, additionaldiscount
        ) select 
            ?, menupkey, menuname, originprice,
            discountyn, discountrate, saleprice, stock,
            useyn, sort, takeoutyn, takeinyn,
            takeoutprice, ?, ?
        from menu where menupkey=?
    `;

    connection.beginTransaction();

    // 주문정보 생성
    const orderinfopkey = await new Promise(async (resolve) => {
        connection.query(orderinfoinsertquery, [spacepkey, takeoutyn, totalpayprice], (err, rows) => {
            if(err) {
                resolve({retcode: "-99", message: err.toString()});
            }else {
                resolve(rows.insertId);
            }
        })
    })
    if (orderinfopkey.retcode === "-99") {
        connection.rollback();
        connection.release();
        return orderinfopkey;
    }

    // 주문메뉴 생성
    for (const ordermenu of ordermenulist) {
        let result = await new Promise ((resolve) => {
            connection.query(ordermenuinsertquery, [orderinfopkey, ordermenu.count, ordermenu.discount, ordermenu.menupkey], (err, rows) => {
                if (err) {
                    resolve({retcode: "-99", message: err.toString()});
                } else {
                    resolve(rows);
                }
            })
        })
        if (result.retcode === "-99") {
            connection.rollback();
            connection.release();
            return result;
        }
    }

    connection.commit();
    connection.release();

    return {retcode: "00"}

}
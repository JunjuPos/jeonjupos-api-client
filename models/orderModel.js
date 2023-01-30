const getConnection = require("../common/db");

orderModel = {
    getSalePrice: async (orderMenu) => {
        const connection = await getConnection();

        const gettotalpaypricecalcuquery = `
            select saleprice * ? orderprice
            from menu
            where menupkey = ?
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(gettotalpaypricecalcuquery, [orderMenu.count, orderMenu.menupkey], (err, rows) => {
                if(err) {
                    reject({retcode: "-99", message: err.toString()});
                }else {
                    resolve({retcode: "00", data: rows});
                }
            })
            connection.release();
        })
    },
    createOrderInfo: async (spacepkey, takeoutyn, totalpayprice) => {
        const orderinfoinsertquery = `
            insert into orderinfo (
                spacepkey, postpaidgrouppkey, ordertype, takeoutyn, 
                reservedate, reservetime, regdate, paydate, 
                totalpayprice, cashpayprice, cardpayprice, paycompleteyn, 
                paystatus, expectedrestprice
            ) values (
                ?, null, true, ?, 
                "1999-01-01", "00:00:00", now(), "",
                ?, 0, 0, false,
                "unpaid", 0
            );
        `;

        const connection = await getConnection();
        connection.beginTransaction();

        return new Promise(async (resolve, reject) => {
            connection.query(orderinfoinsertquery, [spacepkey, takeoutyn, totalpayprice], (err, rows) => {
                if(err) {
                    connection.rollback();
                    connection.release();
                    reject({retcode: "-99", message: err.toString()});
                }else {
                    resolve({retcode: "00", data: rows, connection: connection});
                }
            })
        })
    },
    createOrderMenu: async (orderinfopkey, ordermenulist, connection) => {
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

        return await new Promise ((resolve, reject) => {
            for (const ordermenu of ordermenulist) {
                if (ordermenu !== undefined) {
                    connection.query(ordermenuinsertquery, [orderinfopkey, ordermenu.count, ordermenu.discount, ordermenu.menupkey], (err, rows) => {
                        if (err) {
                            connection.rollback();
                            connection.release();
                            reject({retcode: "-99", message: err.toString()});
                        }
                    })
                }
            }
            resolve({connection: connection});
        })
    },
    spaceModify: async (spacepkey, connection) => {
        const spaceupdatequery = `
            update space set eatingyn=true where spacepkey=?
        `

        return await new Promise((resolve, reject) => {
            connection.query(spaceupdatequery, [spacepkey], (err, rows) => {
                if (err) {
                    connection.rollback();
                    reject({retcode: "-99", message: err.toString()});
                } else {
                    connection.commit();
                    resolve(rows);
                }
            })
            connection.release();
        })
    },
    orderMenuCountModify: async (orderMenuCountModifyParams) => {

        const orderMenuCountModifyQeury = `
            update ordermenu set count=? where ordermenupkey=?;
        `;

        const connection = await getConnection();
        connection.beginTransaction();

        return new Promise(async (resolve, reject) => {
            for(const params of orderMenuCountModifyParams) {
                connection.query(orderMenuCountModifyQeury, params, (err, rows) => {
                    if(err) {
                        connection.rollback();
                        connection.release();
                        reject({retcode: "-99", message: err.toString()});
                    }
                })
            }
            resolve({retcode: "00", connection: connection});
        })
    },
    orderInfoModify: async (orderinfopkey, totalPayPrice, connection) => {
        const orderInfoModifyQuery = `
            update orderinfo set totalpayprice=? where orderinfopkey=?;
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(orderInfoModifyQuery, [totalPayPrice, orderinfopkey], (err, rows) => {
                if(err) {
                    connection.rollback();
                    reject({retcode: "-99", message: err.toString()});
                } else {
                    connection.commit();
                    resolve({retcode: "00", connection: connection});
                }
            })
            connection.release();
        })
    },
    orderCountModify: async (ordermenupkey, type) => {
        const orderCountModifyQuery = type === "plus"?
            `update ordermenu set count = count+1 where ordermenupkey=?;`
        : `update ordermenu set count = count-1 where ordermenupkey=?;`;

        const connection = await getConnection();
        connection.beginTransaction();

        return await new Promise((resolve, reject) => {
            connection.query(orderCountModifyQuery, [ordermenupkey], (err, rows) => {
                if(err) {
                    connection.rollback();
                    reject({retcode: "-99", message: err.toString()});
                } else {
                    connection.commit();
                    resolve({connection: connection});
                }
            })
            connection.release();
        })
    }
}

module.exports = orderModel;
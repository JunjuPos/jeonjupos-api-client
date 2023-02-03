const getConnection = require("../common/db");

orderModel = {
    getSalePrice: async (count, menupkey) => {
        const connection = await getConnection();

        const gettotalpaypricecalcuquery = `
            select saleprice * ? orderprice
            from menu
            where menupkey = ?
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(gettotalpaypricecalcuquery, [count, menupkey], (err, rows) => {
                if(err) {
                    reject({retcode: "-99", message: err.toString()});
                }else {
                    resolve({retcode: "00", data: rows});
                }
            })
            connection.release();
        })
    },
    createOrderInfo: async (spacepkey, takeoutyn, totalSalePrice) => {
        const orderinfoinsertquery = `
            insert into orderinfo (
                spacepkey, postpaidgrouppkey, ordertype, takeoutyn, 
                reservedate, reservetime, regdate, paydate, 
                totalpayprice, cashpayprice, cardpayprice, paycompleteyn, 
                paystatus, expectedrestprice, totalsaleprice
            ) values (
                ?, null, true, ?, 
                "1999-01-01", "00:00:00", now(), now(),
                0, 0, 0, false,
                "unpaid", 0, ?
            );
        `;

        const connection = await getConnection();
        connection.beginTransaction();

        return new Promise(async (resolve, reject) => {
            connection.query(orderinfoinsertquery, [spacepkey, takeoutyn, totalSalePrice], (err, rows) => {
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
                takeoutprice, ?, 0
            from menu where menupkey=?
        `;

        return await new Promise ((resolve, reject) => {
            for (const ordermenu of ordermenulist) {
                if (ordermenu !== undefined) {
                    connection.query(ordermenuinsertquery, [orderinfopkey, ordermenu.count, ordermenu.menupkey], (err, rows) => {
                        if (err) {
                            console.log(err);
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
    reOrderMenuCountModify: async (orderList) => {

        const reOrderMenuCountModifyQeury = `
            update ordermenu set count=? where ordermenupkey=?;
        `;

        const connection = await getConnection();
        connection.beginTransaction();

        return new Promise(async (resolve, reject) => {
            for(const order of orderList) {
                //  params
                connection.query(reOrderMenuCountModifyQeury, [order.count, order.ordermenupkey], (err, rows) => {
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
            update orderinfo set totalsaleprice=? where orderinfopkey=?;
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
    getOrderInfoPkey: async (ordermenupkey) => {

        const getOrderInfoQuery = `
            select orderinfopkey from ordermenu where ordermenupkey=?;
        `;

        const connection = await getConnection();

        try{
            return new Promise(async (resolve, reject) => {
                connection.query(getOrderInfoQuery, [ordermenupkey], (err, rows) => {
                    if(err) {
                        connection.release();
                        reject(err);
                    } else {
                        connection.release();
                        resolve({orderinfopkey: rows[0].orderinfopkey})
                    }
                })
            })
        } catch (err) {
            return err
        }

    },
    orderMenuCountModify: async (ordermenupkey, type) => {
        const orderCountModifyQuery = type === "plus"?
            `update ordermenu set count = count+1 where ordermenupkey=?;`
        : `update ordermenu set count = count-1 where ordermenupkey=?;`;

        const orderMenuDelValidQuery = `
            delete from ordermenu where ordermenupkey=? and count=0;
        `;

        const connection = await getConnection();
        connection.beginTransaction();

        return await new Promise((resolve, reject) => {
            connection.query(orderCountModifyQuery, [ordermenupkey], (err, rows) => {
                if(err) {
                    connection.rollback();
                    connection.release();
                    reject({retcode: "-99", message: err.toString()});
                } else {
                    connection.query(orderMenuDelValidQuery, [ordermenupkey], (err, rows) => {
                        if(err) {
                            connection.rollback();
                            connection.release();
                            reject({retcode: "-99", message: err.toString()});
                        } else {
                            resolve({connection: connection})
                        }
                    })
                }
            })
        })
    },
    orderInfoValidCheck: async (orderinfopkey, connection) => {
        const orderInfoValidCheckQuery = `
            delete oi
            from orderinfo oi 
            where (select count(*) from ordermenu where orderinfopkey=?)=0
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(orderInfoValidCheckQuery, [orderinfopkey], (err, rows) => {
                if(err) {
                    connection.rollback();
                    connection.release();
                    reject(err);
                } else {
                    const valid = rows.affectedRows === 0;  // affectedRows가 1이면 orderinfo가 삭제됨
                    if (valid === true) {
                        resolve({connection: connection, valid: valid});
                    } else {
                        connection.commit();
                        connection.release();
                        resolve({connection: connection, valid: valid});
                    }
                }
            })
        })
    },
    getOrderInfoSalePrice: async (orderinfopkey, connection) => {
        const getOrderInfoTotalPriceQuery = `
            select 
                sum(saleprice * count) as totalsaleprice,
                sum(count) as totalcount
            from ordermenu 
            where orderinfopkey=?;
        `;
        try{
            return new Promise(async (resolve, reject) => {
                connection.query(getOrderInfoTotalPriceQuery, [orderinfopkey], (err, rows) => {
                    if(err) {
                        connection.rollback();
                        connection.release();
                        reject({retcode: "-99", message: err.toString()});
                    } else {
                        const data = rows[0];
                        resolve({totalsaleprice: data.totalsaleprice, totalcount: data.totalcount, connection: connection});
                    }
                })
            })
        } catch (err) {
            return err;
        }

    },
    orderInfoTotalSalePriceModify: async (orderinfopkey, totalSalePrice, connection) => {
        const orderInfoTotalPayPriceModifyQuery = `
            update orderinfo set totalsaleprice=? where orderinfopkey=?;
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(orderInfoTotalPayPriceModifyQuery, [totalSalePrice, orderinfopkey], (err, rows) => {
                if(err) {
                    connection.rollback();
                    connection.release();
                    reject({retcode: "-99", message: err.toString()});
                } else {
                    connection.commit();
                    connection.release();
                    resolve();
                }
            })
        })
    }
}

module.exports = orderModel;
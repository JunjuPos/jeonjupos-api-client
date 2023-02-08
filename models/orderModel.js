const getConnection = require("../common/db");

orderModel = {
    /**
     * 주문 정보 생성
     * @param spacepkey
     * @param takeoutyn
     * @param totalSalePrice
     * @param connection
     * @returns {Promise<unknown>}
     */
    createOrderInfo: async (spacepkey, takeoutyn, totalSalePrice, connection) => {
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

        return new Promise(async (resolve, reject) => {
            connection.query(orderinfoinsertquery, [spacepkey, takeoutyn, totalSalePrice], (err, rows) => {
                if(err) {
                    connection.rollback();
                    connection.release();
                    reject({retcode: "-99", message: err.toString()});
                }else {
                    resolve({retcode: "00", data: rows});
                }
            })
        })
    },
    /**
     * 주문 메뉴 생성
     * @param orderinfopkey
     * @param ordermenu
     * @param connection
     * @returns {Promise<unknown>}
     */
    createOrderMenu: async (orderinfopkey, ordermenu, connection) => {
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
            if (ordermenu !== undefined) {
                connection.query(ordermenuinsertquery, [orderinfopkey, ordermenu.count, ordermenu.menupkey], (err, rows) => {
                    if (err) {
                        connection.rollback();
                        connection.release();
                        reject({retcode: "-99", message: err.toString()});
                    } else {
                        resolve();
                    }
                })
            }
        })
    },
    /**
     * 테이블 상태 변경
     * @param spacepkey
     * @param eatingyn
     * @param connection
     * @returns {Promise<unknown>}
     */
    spaceModify: async (spacepkey, eatingyn, connection) => {
        const spaceupdatequery = `
            update space set eatingyn=? where spacepkey=?
        `

        return await new Promise((resolve, reject) => {
            connection.query(spaceupdatequery, [eatingyn, spacepkey], (err, rows) => {
                if (err) {
                    connection.rollback();
                    connection.release();
                    reject({retcode: "-99", message: err.toString()});
                } else {
                    resolve(rows);
                }
            })
        })
    },
    /**
     * 주문메뉴 삭제
     * @param ordermenupkey
     * @param connection
     * @returns {Promise<unknown>}
     */
    reOrderMenuDel: async (ordermenupkey, connection) => {
        const reOrderMenuDelQuery = `
            delete from ordermenu where ordermenupkey=?
        `

        return new Promise(async (resolve, reject) => {
            connection.query(reOrderMenuDelQuery, [ordermenupkey], (err, rows) => {
                if(err) {
                    connection.rollback();
                    connection.release();
                    reject(err);
                } else {
                    resolve({connection: connection});
                }
            })
        })
    },
    /**
     * 주문정보 총 주문가격 업데이트
     * @param orderinfopkey
     * @param totalSalePrice
     * @param connection
     * @returns {Promise<unknown>}
     */
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
                    resolve();
                }
            })
        })
    },
    /**
     * 주문 메뉴 수량 변경
     * @param ordermenupkey
     * @param count
     * @param connection
     * @returns {Promise<unknown>}
     */
    orderMenuCountModify: async (ordermenupkey, count, connection) => {

        const orderCountModifyQuery = `
            update ordermenu set count = ? where ordermenupkey=?;
        `

        return await new Promise((resolve, reject) => {
            connection.query(orderCountModifyQuery, [count, ordermenupkey], (err, rows) => {
                if(err) {
                    connection.rollback();
                    connection.release();
                    reject({retcode: "-99", message: err.toString()});
                }
                resolve();
            })
        })
    },
    orderMenuDel: async (orderinfopkey, connection) => {
        const orderMenuDelQuery = `
            delete from ordermenu where orderinfopkey=?;
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(orderMenuDelQuery, [orderinfopkey], (err, rows) => {
                if (err) {
                    connection.rollback();
                    connection.release();
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    },
    orderInfoDel: async (orderinfopkey, connection) => {
        const orderinfoDelQuery = `
            delete from orderinfo where orderinfopkey=?;
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(orderinfoDelQuery, [orderinfopkey], (err, rows) => {
                if (err) {
                    connection.rollback();
                    connection.release();
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }
}

module.exports = orderModel;
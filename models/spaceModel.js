const getConnection = require("../common/db");
const db = require("../common/db");

spaceModel = {
    getSpaceList: async (storepkey, connection) => {

        const getSpaceListQuery = `select spacepkey, spacenum, eatingyn from space where isactiveyn=1 and storepkey=?`;

        return new Promise(async (resolve, reject) => {
            connection.query(getSpaceListQuery, [storepkey], (err, rows) => {
                if (err) {
                    connection.release();
                    reject({retcode: "-99", message: err.toString()});
                }else{
                    resolve({retcode: "00", data: rows});
                }
            })
        })
    },
    getSpaceOrderList: async (spacePkeyList, storepkey, connection) => {
        /**
         * 테이블별 주문내역 조회
         * @type {unknown}
         */

        const getSpaceOrderQuery = `
            select sp.spacepkey, om.menuname, om.saleprice, om.count, oi.totalsaleprice
            from space sp 
            join orderinfo oi on sp.spacepkey=oi.spacepkey
            join ordermenu om on oi.orderinfopkey=om.orderinfopkey
            where oi.spacepkey in ? and sp.storepkey=? and sp.eatingyn=true and oi.cancelyn=false and oi.paystatus in ('unpaid', 'partpaid') and oi.paycompleteyn=false
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(getSpaceOrderQuery, [[spacePkeyList], storepkey], (err, rows) => {
                if (err) {
                    connection.release();
                    reject({retcode: "-99", message: err.toString()})
                }else{
                    resolve({retcode: "00", data: rows});
                }
            })
        })
    },
    getOrderList: async (spacepkey, storepkey, connection) => {
        /**
         * 테이블 주문내역 조회
         */
        const getSpaceQuery = `
            select 
                sp.spacepkey, spacenum, oi.orderinfopkey, totalsaleprice, totalpayprice,
                om.ordermenupkey, om.menupkey, menuname, saleprice, count, expectedrestprice
            from space sp
            left join orderinfo oi on sp.spacepkey=oi.spacepkey
            left join ordermenu om on oi.orderinfopkey=om.orderinfopkey
            where sp.spacepkey=? and sp.eatingyn=true and oi.paystatus in ('unpaid', 'partpaid') and sp.storepkey=? and oi.paycompleteyn=false
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(getSpaceQuery, [spacepkey, storepkey], (err, rows) => {
                if (err) {
                    // 데이터베이스 에러(connection, query 등)
                    connection.release();
                    reject({retcode: "-99", message: err.toString()});
                } else {
                    resolve({retcode: "00", data: rows});
                }
            })
        })
    }
}

module.exports = spaceModel;
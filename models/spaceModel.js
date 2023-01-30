const getConnection = require("../common/db");
const db = require("../common/db");

spaceModel = {
    getSpaceList: async () => {
        const connection = await getConnection();

        const getSpaceListQuery = `select spacepkey, spacenum, eatingyn from space where isactiveyn=1`;
        const getSpaceOrderQuery = `
            select sp.spacepkey, om.menuname, om.saleprice, om.count, oi.totalpayprice
            from space sp 
            join orderinfo oi on sp.spacepkey=oi.spacepkey
            join ordermenu om on oi.orderinfopkey=om.orderinfopkey
            where oi.spacepkey in ? and sp.eatingyn=true
        `;

        return new Promise(async (resolve) => {
            connection.query(getSpaceListQuery, [], (err, rows) => {
                if (err) {
                    resolve({retcode: "-99", message: err.toString()});
                }else{
                    resolve({retcode: "00", data: rows});
                }
            })
            connection.release();
        })
    },
    getSpaceOrderList: async (spacePkeyList) => {
        /**
         * 테이블별 주문내역 조회
         * @type {unknown}
         */
        const connection = await getConnection();

        const getSpaceOrderQuery = `
            select sp.spacepkey, om.menuname, om.saleprice, om.count, oi.totalpayprice
            from space sp 
            join orderinfo oi on sp.spacepkey=oi.spacepkey
            join ordermenu om on oi.orderinfopkey=om.orderinfopkey
            where oi.spacepkey in ? and sp.eatingyn=true
        `;

        return new Promise(async (resolve) => {
            connection.query(getSpaceOrderQuery, [[spacePkeyList]], (err, rows) => {
                if (err) {
                    resolve({retcode: "-99", message: err.toString()})
                }else{
                    resolve({retcode: "00", data: rows});
                }
            })
            connection.release();
        })
    },
    getOrderList: async (spacepkey) => {
        /**
         * 테이블 주문내역 조회
         */
        const getSpaceQuery = `
            select 
                sp.spacepkey, spacenum, oi.orderinfopkey, totalpayprice,
                om.ordermenupkey, om.menupkey, menuname, saleprice, count
            from space sp
            left join orderinfo oi on sp.spacepkey=oi.spacepkey
            join ordermenu om on oi.orderinfopkey=om.orderinfopkey
            where sp.spacepkey=? and sp.eatingyn=true and oi.paystatus='unpaid'
        `;

        const connection = await getConnection();

        return new Promise(async (resolve) => {
            connection.query(getSpaceQuery, [spacepkey], (err, rows) => {
                if (err) {
                    // 데이터베이스 에러(connection, query 등)
                    reject({retcode: "-99", message: err.toString()});
                } else {
                    resolve({retcode: "00", data: rows});
                }
            })
            connection.release();
        })
    }
}

module.exports = spaceModel;


const manageModel = {
    getMenuList: async (storepkey, connection) => {
        const getMenuListQuery = `
            select 
                c.categorypkey, c.categoryname,
                m.menupkey, m.menuname, m.originprice, m.saleprice,
                m.discountyn, m.discountrate, m.useyn, m.takeoutyn,
                m.takeinyn 
            from category c
            join menu m on c.categorypkey=m.categorypkey
            where c.storepkey=?
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(getMenuListQuery, [storepkey], (err, rows) => {
                if (err) {
                    connection.release();
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    },
    useYnModify: async (menupkey, storepkey, connection) => {

        const useYnModifyModifyQuery = `
            update menu set useyn= if(useyn = true, false, true) where menupkey=?
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(useYnModifyModifyQuery, [menupkey], (err, rows) => {
                if (err) {
                    connection.rollback();
                    connection.release();
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    },
    takeoutYnModify: async (menupkey, storepkey, connection) => {

        const takeoutYnModifyQuery = `
            update menu set takeoutyn= if(takeoutyn = true, false, true) where menupkey=?
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(takeoutYnModifyQuery, [menupkey], (err, rows) => {
                if (err) {
                    connection.rollback();
                    connection.release();
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    },
    takeinYnModify: async (menupkey, storepkey, connection) => {

        const takeinYnModifyQuery = `
            update menu set takeinyn= if(takeinyn = true, false, true) where menupkey=?
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(takeinYnModifyQuery, [menupkey], (err, rows) => {
                if (err) {
                    connection.rollback();
                    connection.release();
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    },

    getSaleList: async (startDate, endDate, storepkey, connection) => {

        const getSaleListQeury = `
            select 
                oi.orderinfopkey,
                oi.ordertype,
                oi.takeoutyn,
                oi.reservedate,
                oi.reservetime,
                oi.regdate,
                oi.paydate,
                oi.paycompleteyn,
                oi.paystatus,
                oi.totalpayprice,
                oi.cashpayprice,
                oi.cardpayprice,
                oi.deferredpayprice,
                oi.totalsaleprice,
                oi.expectedrestprice,
                oi.cancelyn
            from store s
            join space sp on s.storepkey=sp.storepkey
            join orderinfo oi on sp.spacepkey=oi.spacepkey
            where s.storepkey=? and date_format(oi.paydate, '%Y-%m-%d') between ? and ?
            order by paydate desc;
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(getSaleListQeury, [storepkey, startDate, endDate], (err, rows) => {
                if(err) {
                    connection.release();
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })

    }
}

module.exports = manageModel;
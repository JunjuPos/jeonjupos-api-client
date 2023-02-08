

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

    getSaleList: async (startDate, endDate, postPaidName, menuName, storepkey, connection) => {

        const params = [storepkey, startDate, endDate];
        let whereQeury = `where s.storepkey=? and date_format(oi.paydate, '%Y-%m-%d') between ? and ?`;
        if (postPaidName.length > 0) {
            whereQeury += ` and ppg.companyname like ?`
            params.push(`%${postPaidName}%`);
        }
        if (menuName.length > 0) {
            whereQeury += ` and om.menuname like ?`
            params.push(`%${menuName}%`)
        }

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
                oi.cancelyn,
                group_concat(om.menuname) menuname
            from store s
            join space sp on s.storepkey=sp.storepkey
            join orderinfo oi on sp.spacepkey=oi.spacepkey
            join ordermenu om on oi.orderinfopkey=om.orderinfopkey
            left join postpaidgroup ppg on oi.postpaidgrouppkey=ppg.postpaidgrouppkey
            ${whereQeury}
            group by oi.orderinfopkey
            order by paydate desc;
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(getSaleListQeury, params, (err, rows) => {
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
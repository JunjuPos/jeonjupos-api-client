paymentModel = {
    getOrderInfo: async (orderinfopkey, connection) => {
        const getOrderInfoQuery = `
            select * from orderinfo where orderinfopkey=?;
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(getOrderInfoQuery, [orderinfopkey], (err, rows) => {
                if (err) {
                    connection.rollback();
                    connection.release();
                    reject(err);
                } else {
                    resolve(rows[0]);
                }
            })
        })
    },
    spaceUpdate: async (spacepkey, connection) => {
        const spaceUpdateQuery = `
            update space set eatingyn=false where spacepkey=?;
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(spaceUpdateQuery, [spacepkey], (err) => {
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
    pay: async (orderinfopkey, paycompleteyn, cashpayprice, cardpayprice, deferredpayprice, paystatus, expectedrestprice, totalpayprice, connection, type, postpaidgrouppkey) => {

        const params = [];

        let subWhereQuery = ``;
        if (type === "deferred") {
            subWhereQuery = `
                postpaidgrouppkey=?,
            `;
            params.push(postpaidgrouppkey)
        }

        params.push(paycompleteyn, cashpayprice, cardpayprice, deferredpayprice, paystatus, expectedrestprice, totalpayprice, orderinfopkey);

        const payQeury = `
            update orderinfo 
            set 
                ${subWhereQuery}
                paydate=now(),
                paycompleteyn=?,
                cashpayprice=cashpayprice+?, 
                cardpayprice=cardpayprice+?, 
                deferredpayprice=deferredpayprice+?, 
                paystatus=?, 
                expectedrestprice=?, 
                totalpayprice=?
            where orderinfopkey=?
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(payQeury, params, (err, rows) => {
                if (err) {
                    connection.rollback();
                    connection.release();
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })
    }
}

module.exports = paymentModel;
const getConnection = require("../common/db");

const userModel = {
    getOwner: async (id) => {
        const getOwnerQeury = `
            select 
                ownerid, ownerpassword, storename, storepkey
            from owner
            join store  on owner.ownerpkey=store.ownerpkey
            where ownerid=?;
        `;

        const connection = await getConnection();

        return new Promise(async (resolve, reject) => {
            connection.query(getOwnerQeury, [id], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    // resolve({id: rows[0].ownerid, password: rows[0].ownerpassword});
                    resolve({data: rows});
                }
            })
            connection.release();
        })
    },
    updateJwt: async (id, jwt) => {
        const insertJwtQuery = `
            update owner set token=? where ownerid=?;  
        `;
        const connection = await getConnection();
        connection.beginTransaction();

        return new Promise(async (resolve, reject) => {
            connection.query(insertJwtQuery, [jwt, id], (err, rows) => {
                if (err) {
                    connection.rollback();
                    reject(err);
                } else {
                    connection.commit();
                    resolve();
                }
                connection.release();
            })
        })
    },
    ownerRegister: async (id, password) => {
        const ownerRegisterQuery = `
            insert into owner (ownerid, ownerpassword, regdate, token) values (?, ?, now(), "");
        `;

        const connection = await getConnection();
        connection.beginTransaction();

        return new Promise(async (resolve, reject) => {
            connection.query(ownerRegisterQuery, [id, password], (err, rows) => {
                if (err) {
                    connection.rollback();
                    reject(err);
                } else {
                    connection.commit();
                    resolve();
                }
                connection.release();
            })
        })
    }
}

module.exports = userModel;
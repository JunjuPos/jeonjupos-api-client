const getConnection = require("../common/db");

const userModel = {
    getPostpaidGroupList: async (storepkey, connection, search) => {
        let subWhereQeury = ``;
        const params = [storepkey]
        if (search.length > 0) {
            subWhereQeury = ` and (
                    companyname like ? 
                    or departmentname like ? 
                    or delegatename like ? 
                    or phone like ?
                )
            `
            params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`)
        }

        const getPostpaidGroupListQuery = `
            select *
            from postpaidgroup
            where storepkey=? and useyn=true ${subWhereQeury}
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(getPostpaidGroupListQuery, params, (err, rows) => {
                if (err) {
                    connection.release();
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
        })

    },
    getJwtOwner: async (token) => {
        const getJwtOwnerQuery = `
            select ow.ownerpkey, s.storepkey, s.storename
            from owner ow
            join store s on ow.ownerpkey=s.ownerpkey 
            where token=?;
        `;
        const connection = await getConnection();

        return new Promise(async (resolve, reject) => {
            connection.query(getJwtOwnerQuery, [token], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
            connection.release();
        })
    },
    getOwner: async (id, connection) => {
        const getOwnerQeury = `
            select 
                ownerid, ownerpassword, storename, storepkey
            from owner
            join store  on owner.ownerpkey=store.ownerpkey
            where ownerid=?;
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(getOwnerQeury, [id], (err, rows) => {
                if (err) {
                    connection.release();
                    reject(err);
                } else {
                    // resolve({id: rows[0].ownerid, password: rows[0].ownerpassword});
                    resolve({data: rows});
                }
            })
        })
    },
    updateJwt: async (id, jwt, connection) => {
        const insertJwtQuery = `
            update owner set token=? where ownerid=?;  
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(insertJwtQuery, [jwt, id], (err) => {
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
    ownerRegister: async (id, password, connection) => {
        const ownerRegisterQuery = `
            insert into owner (ownerid, ownerpassword, regdate, token) values (?, ?, now(), "");
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(ownerRegisterQuery, [id, password], (err) => {
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

module.exports = userModel;
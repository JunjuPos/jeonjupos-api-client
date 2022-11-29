const db = require("../database/db")

exports.postpaidgrouplist = async (search) => {

    const connection = await db.getConnection();
    search = "%" + search + "%";

    const getPostpaidgroupListQeury = `
        select 
            postpaidgrouppkey, companyname, departmentname, delegatename, phone
        from postpaidgroup
        where (companyname like ? or departmentname like ? or delegatename like ? or phone like ?) and useyn='Y'
        order by postpaidgrouppkey asc;
    `;

    return new Promise((resolve) => {

        connection.query(getPostpaidgroupListQeury, [search, search, search, search], (err, rows) => {
            if(err) resolve({retcode: "-99", message: err.toString()});

            resolve({retcode: "00", postpaidgrouplist: rows})
        })

        connection.release();
    })
}
const getConnection = require("../common/db");

menuModel = {
    getMenu: async (storepkey, menupkey) => {
        const connection = await getConnection();

        const getMenuQuery = `
            select 
                m.menupkey, m.menuname, c.categoryname,
                m.originprice, m.discountyn, m.discountrate,
                m.saleprice, m.stock, m.useyn, 
                m.takeinyn, m.takeoutyn, m.takeoutprice
            from menu as m
            join category as c on m.categorypkey=c.categorypkey
            where c.storepkey=? and m.menupkey=?;
        `;

        return new Promise(async (resolve, reject) => {
            connection.query(getMenuQuery, [storepkey, menupkey], (err, rows) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            })
            connection.release();
        })

    },
    getMenuList: async (storepkey) => {
        const connection = await getConnection();

        //  카테고리 리스트 조회 쿼리
        //  조회 조건 (카테고리 사용여부, 메뉴 판매여부, 메뉴 재고 > 0)
        const getCategoryListQuery = `
            select 
                cg.categorypkey, cg.categoryname,
                m.menupkey, m.menuname, m.saleprice, m.takeoutyn, m.takeinyn, m.takeoutprice
            from category cg
            join menu m on cg.categorypkey = m.categorypkey
            where cg.useyn=true and m.useyn=true and m.stock > 0 and cg.storepkey=?
            order by cg.categorypkey, m.sort;
        `;

        return new Promise(async (resolve) => {
            connection.query(getCategoryListQuery, [storepkey], (err, rows) => {
                if(err) {
                    resolve({retcode: "-99", message: err.toString()});
                } else {
                    resolve({retcode: "00", data: rows});
                }
            });
            connection.release();
        })
    }
}

module.exports = menuModel;
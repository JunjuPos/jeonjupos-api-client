const getConnection = require("../common/db");

menuModel = {
    getMenuList: async () => {
        const connection = await getConnection();

        //  카테고리 리스트 조회 쿼리
        //  조회 조건 (카테고리 사용여부, 메뉴 판매여부, 메뉴 재고 > 0)
        const getCategoryListQuery = `
            select 
                cg.categorypkey, cg.categoryname,
                m.menupkey, m.menuname, m.saleprice, m.takeoutyn, m.takeinyn, m.takeoutprice
            from category cg
            join menu m on cg.categorypkey = m.categorypkey
            where cg.useyn='Y' and m.useyn='Y' and m.stock > 0
            order by cg.categorypkey, m.sort;
        `;

        return new Promise(async (resolve) => {
            connection.query(getCategoryListQuery, [], (err, rows) => {
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
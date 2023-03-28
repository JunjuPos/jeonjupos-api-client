
menuModel = {
    getMenuList: async (storepkey, connection) => {

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

        return new Promise(async (resolve, reject) => {
            connection.query(getCategoryListQuery, [storepkey], (err, rows) => {
                if(err) {
                    connection.release();
                    reject(err);
                } else {
                    resolve({retcode: "00", data: rows});
                }
            });
        })
    }
}

module.exports = menuModel;
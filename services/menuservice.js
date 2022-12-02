let db = require("../database/db");

/**
 * 카테고리별 메뉴 리스트
 * @returns {Promise<unknown>}
 */
exports.menulist = async () => {
    const connection = await
        db.getConnection();

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
            }

            const categorymenulist = [];    // 카테고리별 메뉴 리스트
            const categorylist = [];        // 카테고리 리스트
            for (const categorymenuqueryset of rows) {
                //  카테고리 리스트 생성
                let menulistidx = categorymenulist.findIndex((category) => category.categorypkey===categorymenuqueryset.categorypkey);
                if (menulistidx === -1){
                    categorylist.push({
                        categorypkey: categorymenuqueryset.categorypkey,
                        categoryname: categorymenuqueryset.categoryname
                    })
                    categorymenulist.push({
                        categorypkey: categorymenuqueryset.categorypkey,
                        menulist: []
                    });
                }
                
                // 카테고리별 메뉴 리스트 생성
                let cgmidx = categorymenulist.findIndex((category) => category.categorypkey===categorymenuqueryset.categorypkey);
                if (cgmidx !== -1){
                    categorymenulist[cgmidx].menulist.push({
                        menupkey: categorymenuqueryset.menupkey,
                        menuname: categorymenuqueryset.menuname,
                        saleprice: categorymenuqueryset.saleprice,
                        takeoutyn: categorymenuqueryset.takeoutyn,
                        takeinyn: categorymenuqueryset.takeinyn,
                        takeoutprice: categorymenuqueryset.takeoutprice
                    });
                }
            }

            resolve({retcode: "00", categorylist: categorylist, categorymenulist: categorymenulist})
        });
        connection.release();
    });
}
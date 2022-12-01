let db = require("../database/db");

/**
 * 카테고리별 메뉴 리스트
 * @returns {Promise<unknown>}
 */
exports.menulist = async () => {
    const connection = await
        db.getConnection();

    //  카테고리 리스트 조회 쿼리
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

            const categorymenulist = [];
            const categorylist = [];
            for (const categorymenuqueryset of rows) {
                //  카테고리 리스트 생성
                let menulistidx = categorymenulist.findIndex((categorymenu) => categorymenu.categorypkey===categorymenuqueryset.categorypkey);
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
                let cgmidx = categorymenulist.findIndex((categorymenu) => categorymenu.categorypkey===categorymenuqueryset.categorypkey);
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

            // 메뉴 리스트 중복제거
            categorymenulist.menulist = categorymenulist.map((categorymenu) => {
                const set = new Set(categorymenu.menulist)
                return Array.from(set);
            })

            resolve({retcode: "00", categorylist: categorylist, categorymenulist: categorymenulist})
        });
        connection.release();
    });
}
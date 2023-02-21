const manageModel = require("../models/manageModel");
const getConnection = require("../common/db");

const leftPad = (value) => {
    if (value >= 10) {
        return value;
    }

    return `0${value}`;
}

const toStringByFormatting = (source, delimiter = '-') => {
    const year = new Date(source).getFullYear();
    const month = leftPad(new Date(source).getMonth() + 1);
    const day = leftPad(new Date(source).getDate());

    return [year, month, day].join(delimiter);
}

const manageService = {
    getMenu: async (storepkey, menupkey) => {
        /**
         * 메뉴 상세조회
         */

        try{
            const getMenu = await manageModel.getMenu(storepkey, menupkey);
            if (getMenu.length === 0) {
                return {menu: null};
            } else {
                return {menu: getMenu[0]};
            }
        } catch (err) {
            throw err;
        }
    },
    getMenuList: async (storepkey) => {
        try{

            const connection = await getConnection();

            // await manageModel.getMenuCategoryList(storepkey);

            const getMenuList = await manageModel.getMenuList(storepkey, connection);
            connection.release();

            if (getMenuList.length === 0) {
                connection.release();
                return {categorylist: [], menulist: []}
            }

            let categorylist = [];
            categorylist = [...categorylist, {
                categorypkey: getMenuList[0].categorypkey,
                categoryname: getMenuList[0].categoryname
            }]

            for (const category of getMenuList) {
                const idx = categorylist.findIndex((item) => item.categorypkey === category.categorypkey);
                if (idx === -1) {
                    categorylist = [...categorylist, {
                        categorypkey: category.categorypkey,
                        categoryname: category.categoryname
                    }]
                }
            }

            const menulist = getMenuList.map((item) => {
                return {
                    categorypkey: item.categorypkey,
                    menupkey: item.menupkey,
                    menuname: item.menuname,
                    originprice: item.originprice,
                    saleprice: item.saleprice,
                    discountyn: item.discountyn,
                    discountrate: item.discountrate,
                    useyn: item.useyn,
                    takeoutyn: item.takeoutyn,
                    takeinyn: item.takeinyn
                }
            })
            return {categorylist: categorylist, menulist: menulist}
        } catch (err) {
            throw err;
        }
    },
    useYnModify: async (menupkey, storepkey) => {
        try{
            const connection = await getConnection();

            //  메뉴
            await manageModel.useYnModify(menupkey, storepkey, connection);

            connection.commit();
            connection.release();
        } catch (err) {
            throw err;
        }
    },
    takeoutYnModify: async (menupkey, storepkey) => {
        try{
            const connection = await getConnection();

            //  메뉴
            await manageModel.takeoutYnModify(menupkey, storepkey, connection);

            connection.commit();
            connection.release();
        } catch (err) {
            throw err;
        }
    },
    takeinYnModify: async (menupkey, storepkey) => {
        try{
            const connection = await getConnection();

            //  메뉴
            await manageModel.takeinYnModify(menupkey, storepkey, connection);

            connection.commit();
            connection.release();
        } catch (err) {
            throw err;
        }
    },
    menuModify: async (reqData, storepkey) => {
        try{
            await manageModel.menuModify(reqData, storepkey);
        } catch (err) {
            throw err;
        }
    },

    getSaleList: async (startDate, endDate, postPaidName, menuName, storepkey) => {
        try{

            // startdate, enddate format 변경
            startDate = toStringByFormatting(startDate);
            endDate = toStringByFormatting(endDate);

            const connection = await getConnection();

            const getSaleList = await manageModel.getSaleList(startDate, endDate, postPaidName, menuName, storepkey, connection);

            let totalpayprice = 0;
            let totalsaleprice = 0;
            let totalcashpayprice = 0;
            let totalcardpayprice = 0;
            let totaldeferredpayprice = 0;
            let totalexpectedrestprice = 0;

            getSaleList.map((item) => {
                totalpayprice += item.totalpayprice;
                totalsaleprice += item.totalsaleprice;
                totalcashpayprice += item.cashpayprice;
                totalcardpayprice += item.cardpayprice;
                totaldeferredpayprice += item.deferredpayprice;
                totalexpectedrestprice += item.expectedrestprice;
            })

            connection.release();
            return {
                res_code: "00",
                data: getSaleList,
                totalpayprice: totalpayprice,
                totalsaleprice: totalsaleprice,
                totalcashpayprice: totalcashpayprice,
                totalcardpayprice: totalcardpayprice,
                totaldeferredpayprice: totaldeferredpayprice,
                totalexpectedrestprice: totalexpectedrestprice
            }
        } catch (err) {
            throw err;
        }
    }
}

module.exports = manageService;
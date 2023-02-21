const manageService = require("../services/manageservice");
const statusCode = require("../common/statusCode");
const util = require("../common/responseUtill");

const manageController = {
    getMenu: async (req, res) => {
        const storepkey = req.storepkey;
        const {menupkey} = req.query;

        try{
            const menuserviceres = await manageService.getMenu(storepkey, menupkey);

            return res.status(200).json({res_code: "0000", message: "매뉴 목록 조회 성공", menu: menuserviceres.menu});
        } catch (err) {
            return res.status(500).json({res_code: "9999", message: "데이터베이스 오류"})
        }
    },
    getMenuList: async (req, res) => {
        const storepkey = req.storepkey;
        try{
            const getMenuList = await manageService.getMenuList(storepkey)

            return res.status(statusCode.OK).json(util.success("0000", {categorylist: getMenuList.categorylist, menulist: getMenuList.menulist}));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail("9999"))
        }
    },
    useYnModify: async (req, res) => {
        const {menupkey} = req.body;
        const storepkey = req.storepkey;

        try{
            await manageService.useYnModify(menupkey, storepkey);

            return res.status(statusCode.OK).json(util.success("0000", {}));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail("9999"))
        }
    },
    takeoutYnModify: async (req, res) => {
        const {menupkey} = req.body;
        const storepkey = req.storepkey;

        try{
            await manageService.takeoutYnModify(menupkey, storepkey);

            return res.status(statusCode.OK).json(util.success("0000", {}));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail("9999"))
        }
    },
    takeinYnModify: async (req, res) => {
        const {menupkey} = req.body;
        const storepkey = req.storepkey;

        try{
            await manageService.takeinYnModify(menupkey, storepkey);

            return res.status(statusCode.OK).json(util.success("0000", {}));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail("9999"))
        }
    },
    menuModify: async (req, res) => {
        const storepkey = req.storepkey;

        try{
            await manageService.menuModify(req.body, storepkey);

            return res.status(statusCode.OK).json(util.success("0000", {}));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail("9999"))
        }
    },

    getSaleList: async (req, res) => {
        const {startDate, endDate, postPaidName, menuName} = req.query;
        const storepkey = req.storepkey;

        try{
            const getSaleList = await manageService.getSaleList(startDate, endDate, postPaidName, menuName, storepkey);
            return res.status(statusCode.OK).json(util.success(
                "0000",
                {
                    saleList: getSaleList.data,
                    totalpayprice: getSaleList.totalpayprice,
                    totalsaleprice: getSaleList.totalsaleprice,
                    totalcashpayprice: getSaleList.totalcashpayprice,
                    totalcardpayprice: getSaleList.totalcardpayprice,
                    totaldeferredpayprice: getSaleList.totaldeferredpayprice,
                    totalexpectedrestprice: getSaleList.totalexpectedrestprice
                })
            );
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail("9999"));
        }
    }
}

module.exports = manageController;
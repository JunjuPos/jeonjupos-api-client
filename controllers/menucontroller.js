let menuservice = require("../services/menuservice");

menuController = {
    getMenu: async (req, res) => {
        const storepkey = req.storepkey;
        const {menupkey} = req.query;

        try{
            const menuserviceres = await menuservice.getMenu(storepkey, menupkey);

            return res.status(200).json({res_code: "0000", message: "카테고리별 메뉴목록 조회 성공", menu: menuserviceres.menu});
        } catch (err) {
            return res.status(500).json({res_code: "9999", message: "데이터베이스 오류"})
        }
    },
    menulist: async (req, res) => {

        const storepkey = req.storepkey;

        const menuserviceres = await menuservice.menulist(storepkey);

        if (menuserviceres.retcode === "-99") {
            return res.status(500).json({res_code: "9999", message: "데이터베이스 오류"})
        }

        return res.status(200).json({res_code: "0000", message: "카테고리별 메뉴목록 조회 성공", categorylist: menuserviceres.categorylist, categorymenulist: menuserviceres.categorymenulist});
    }
}

module.exports = menuController;
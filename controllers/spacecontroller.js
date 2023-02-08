let spaceservice = require("../services/spaceservice");
const statusCode = require("../common/statusCode");
const util = require("../common/responseUtill");
const message = require("../common/responseMessage");

spaceController = {
    spacelist: async (req, res) => {
        try{
            const spaceserviceres = await spaceservice.spacelist(req.storepkey);
            return res.status(200).json({res_code: "0000", message: "테이블 정보 조회 성공", spacelist: spaceserviceres.spacelist});
        } catch (err) {
            console.log(err);
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail("9999"))
        }
    },
    orderlist: async (req, res) => {

        const spacepkey = req.query.spacepkey;
        const storepkey = req.storepkey;

        try {
            let spaceserviceres = await spaceservice.orderlist(spacepkey, storepkey);
            return res.status(200).json({res_code: "0000", message: "테이블 주문정보 조회 성공", space: spaceserviceres.space, orderlist: spaceserviceres.orderlist})
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail("9999"))
        }
    }
}

module.exports = spaceController;

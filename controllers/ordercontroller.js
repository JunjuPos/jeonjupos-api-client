const orderservice = require("../services/orderservice");
const util = require("../common/responseUtill");
const message = require("../common/responseMessage");
const statusCode = require("../common/statusCode");

orderController = {
    /**
     * 주문
     * @param req
     * @param res
     * @returns {Promise<void>}
     */
    order: async (req, res) => {
        const {spacepkey, orderinfopkey, ordermenulist, takeoutyn, firstorderyn} = req.body;

        try{
            // 주문서 생성
            if (firstorderyn === true) {
                // 최초주문
                await orderservice.fisrtorder(spacepkey, ordermenulist, takeoutyn);
            } else {
                // 재주문
                await orderservice.reOrder(spacepkey, orderinfopkey, ordermenulist);
            }
            return res.status(statusCode.OK).json(util.success("0000", {}))
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail("9999"))
        }
    },
}

module.exports = orderController;
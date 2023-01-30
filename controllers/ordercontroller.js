const orderservice = require("../services/orderservice");
const util = require("../common/responseUtill");
const message = require("../common/responseMessage");
const statusCode = require("../common/statusCode");

orderController = {
    firstorder: async (req, res) => {
        /**
         * 최초 주문
         * @param req
         * @param res
         * @returns {Promise<void>}
         */
        const {spacepkey, ordermenulist, takeoutyn} = req.body;
        console.log("req.body : ", req.body)

        // 메뉴 총 가격
        const gettotalpaypriceres =  await orderservice.gettotalpayprice(ordermenulist);
        if (gettotalpaypriceres.retcode === "-99") {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message['9999']))
        }

        // 주문서 생성
        const firstorderres = await orderservice.firstorder(spacepkey, ordermenulist, takeoutyn, gettotalpaypriceres.totalpayprice);
        if (firstorderres.retcode === "-99") {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message['9999']))
        }
        console.log("util.success(\"0000\", {}) : ", util.success("0000", {}))
        return res.status(statusCode.OK).json(util.success("0000", {}))
    },
    reOrder: async (req, res) => {
        /**
         * 재주문
         */

        const {orderinfopkey, orderList, newOrderList} = req.body;

        try{
            const reOrder = await orderservice.reOrder(orderinfopkey, orderList, newOrderList);
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message['9999']))
        }

        return res.status(statusCode.OK).json(util.success("0000", {}))
    },
    countmodify: async (req, res) => {
        /**
         * 수량 변경
         * @param req
         * @param res
         * @returns {Promise<*>}
         */
        const {ordermenupkey, orderinfopkey, type} = req.body;

        try{
            const countModifyRes = await orderservice.orderCountModify(ordermenupkey, orderinfopkey, type);
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message['9999']))
        }

        console.log("왜 응답을 안하냐 ?!!!")
        return res.status(statusCode.OK).json(util.success("0000", {}))
    },
}

module.exports = orderController;
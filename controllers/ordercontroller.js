const orderservice = require("../services/orderservice");
const util = require("../common/responseUtill");
const message = require("../common/responseMessage");
const statusCode = require("../common/statusCode");

orderController = {
    order: async (req, res) => {
        /**
         * 주문
         * @param req
         * @param res
         * @returns {Promise<void>}
         */
        const {spacepkey, orderinfopkey, ordermenulist, takeoutyn, firstorderyn} = req.body;
        console.log(req.body);

        try{
            // 메뉴 총 가격
            // 주문서 생성
            if (firstorderyn === true) {
                // 최초주문
                await orderservice.fisrtorder(spacepkey, ordermenulist, takeoutyn);
            } else {
                // 재주문

            }
            return res.status(statusCode.OK).json(util.success("0000", {}))
        } catch (err) {
            console.log("firstorder err : ", err)
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json(statusCode.INTERNAL_SERVER_ERROR, message['9999'])
        }
    },
    reOrder: async (req, res) => {
        /**
         * 재주문
         */

        const {orderinfopkey, orderList, newOrderList} = req.body;

        try{
            const reOrder = await orderservice.reOrder(orderinfopkey, orderList, newOrderList);
        } catch (err) {
            console.log(err);
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
        const {ordermenupkey, type} = req.body;

        try{
            const countModifyRes = await orderservice.orderCountModify(ordermenupkey, type);
            return res.status(statusCode.OK).json(util.success("0000", {totalSalePrice: countModifyRes.data.totalSalePrice, totalCount: countModifyRes.data.totalCount}));
        } catch (err) {
            console.log(err)
            return res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, message['9999']))
        }
    },
}

module.exports = orderController;
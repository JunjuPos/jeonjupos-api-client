const paymentService = require("../services/paymentservice");
const util = require("../common/responseUtill");
const message = require("../common/responseMessage");
const statusCode = require("../common/statusCode");


const paymentController = {
    pay: async (req, res) => {
        const {orderinfopkey, spacepkey, reqPayPrice, type} = req.body;

        try{
            const payRes = await paymentService.pay(orderinfopkey, spacepkey, reqPayPrice, type);
            if (payRes.res_code !== "0000") {
                return res.status(statusCode.OK).json(util.fail(payRes.res_code));
            }
            return res.status(statusCode.OK).json(util.success("0000", {}));
        } catch (err) {
            return res.status(statusCode.INTERNAL_SERVER_ERROR).json(util.fail("9999"));
        }
    }
}

module.exports = paymentController;
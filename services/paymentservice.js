const paymentModel = require("../models/paymentModel");
const getConnection = require("../common/db");

paymentService = {
    /**
     * 결제
     * @param orderinfopkey
     * @param spacepkey
     * @param reqPayPrice
     * @param type
     * @returns {Promise<void>}
     */
    pay: async (orderinfopkey, spacepkey, reqPayPrice, type) => {
        try{

            const connection = await getConnection();
            connection.beginTransaction();

            //  orderinfo 조회
            const getOrderInfo = await paymentModel.getOrderInfo(orderinfopkey, connection);

            //  결제금액 유효성 검사
            if (parseInt(reqPayPrice) > getOrderInfo.totalsaleprice - getOrderInfo.totalpayprice) {
                connection.rollback();
                connection.release();
                return {res_code: "0004"}
            }

            //  결제금액
            const totalpayprice = getOrderInfo.totalpayprice + parseInt(reqPayPrice);

            //  결제 상태
            const paystatus = getOrderInfo.totalsaleprice === (totalpayprice)? "complete": "partpaid";
            const paycompleteyn = getOrderInfo.totalsaleprice === (totalpayprice);
            //  결제 후 잔액
            const expectedrestprice = getOrderInfo.totalsaleprice - (totalpayprice);

            let cashpayprice = 0;
            let cardpayprice = 0;
            let deferredpayprice = 0;

            // 결제 타입 (cash: 현금, card: 카드, deferred: 후불)
            if (type === "cash") {
                cashpayprice = reqPayPrice;
            } else if (type === "card") {
                cardpayprice = reqPayPrice;
            } else if (type === "deferred") {
                deferredpayprice = reqPayPrice;
            } else {
                connection.rollback();
                connection.release();
                return {res_code: "0005"}
            }

            await paymentModel.pay(orderinfopkey, paycompleteyn, cashpayprice, cardpayprice, deferredpayprice, paystatus, expectedrestprice, totalpayprice, connection);

            // 테이블 상태 변경
            if (parseInt(reqPayPrice) === getOrderInfo.totalsaleprice - getOrderInfo.totalpayprice) {
                await paymentModel.spaceUpdate(spacepkey, connection);
            }

            connection.commit();
            connection.release();

            return {res_code: "0000"}

        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}

module.exports = paymentService;
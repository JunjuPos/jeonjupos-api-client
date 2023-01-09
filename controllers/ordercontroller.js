const orderservice = require("../services/orderservice");

/**
 * 최초 주문
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
exports.firstorder = async (req, res) => {

    const {spacepkey, ordermenulist, takeoutyn} = req.body;
    console.log("req.body : ", req.body)

    // 테이블 유효성 체크
    const firstordervalidationres = await orderservice.firstordervalidation(spacepkey);
    if (firstordervalidationres.retcode === "-99") {
        return res.status(500).json({res_code: "9999", message: "데이터베이스 오류"})
    }

    if (firstordervalidationres.valid === false) {
        // 식사중인 테이블 주문불가
        return res.status(200).json({res_code: "0001", message: "이미 주문서가 생성되었습니다."})
    }

    // 메뉴 총 가격
    const gettotalpaypriceres =  await orderservice.gettotalpayprice(ordermenulist);
    if (gettotalpaypriceres.retcode === "-99") {
        return res.status(500).json({res_code: "9999", message: "데이터베이스 오류"})
    }

    // 주문서 생성
    const firstorderres = await orderservice.firstorder(spacepkey, ordermenulist, takeoutyn, gettotalpaypriceres.totalpayprice);
    if (firstorderres.retcode === "-99") {
        return res.status(500).json({res_code: "9999", message: "데이터베이스 오류"})
    }

    return res.status(200).json({res_code: "0000", message: "주문성공"});
}

/**
 * 수량 변경 및 재주문
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.countmodify = async (req, res) => {

    const {ordermenupkey, count} = req.body;

    return res.status(200).json({res_code: "0000", message: "수량변경 성공"});
}
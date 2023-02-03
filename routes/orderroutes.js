let express = require('express');
let router = express.Router();
let ordercontroller = require("../controllers/ordercontroller");
let {body} = require("express-validator");
const validator = require("../middleware/validator");

const firstordervalidparams = [
    /**
     * {
     *     "spacepkey": 1,
     *     "orderinfopkey": 0,  // 0: 최초주문
     *     "ordermenulist": [
     *         {
     *              count: 1,
     *              menuname: "",
     *              menupkey: 1,
     *              ordermenupkey: 0,
     *              saleprice: 6000,
     *              totalsaleprice: 6000
     *         }
     *     ],
     *     "takeoutyn": false
     * }
     */
    body("spacepkey", "테이블번호는 필수 입니다.").not().isEmpty().bail(),
    body("orderinfopkey", "결제 고유번호는 필수 입니다.").not().isEmpty().bail(),
    body("ordermenulist", "메뉴정보는 필수 입니다.").isArray().bail(),
    body("ordermenulist.*.menupkey", "주문메뉴 고유번호는 필수 입니다.").isInt().bail(),
    body("ordermenulist.*.count", "주문 수량은 필수 입니다.").isInt().bail().default(1),
    body("ordermenulist.*.saleprice", "메뉴 가격은 필수 입니다.").isInt().bail().default(1),
    body("takeoutyn").default(false).bail().isIn([true, false]).bail(),
    body("firstorderyn").default(false).bail().isIn([true, false]).bail(),
    validator.validatorErrorChecker,
]

const countmodifyvalidparams = [
    body("")
]

router.post("/", firstordervalidparams, ordercontroller.order);

router.post("/re", ordercontroller.reOrder);

router.post("/modify/", ordercontroller.countmodify);

module.exports = router;
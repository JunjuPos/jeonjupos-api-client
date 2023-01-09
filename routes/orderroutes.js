let express = require('express');
let router = express.Router();
let ordercontroller = require("../controllers/ordercontroller");
let {body} = require("express-validator");
const validator = require("../middleware/validator");

const firstordervalidparams = [
    /**
     * {
     *     "spacepkey": 1,
     *     "ordermenulist": [
     *         {
     *             "menupkey": 2,
     *             "count": 2,
     *             "discount": 0
     *         }
     *     ],
     *     "takeoutyn": false
     * }
     */
    body("spacepkey", "테이블번호는 필수 입니다.").not().isEmpty().bail(),
    body("ordermenulist", "메뉴정보는 필수 입니다.").isArray().bail(),
    body("ordermenulist.*.menupkey", "주문메뉴 고유번호는 필수 입니다.").isInt().bail(),
    body("ordermenulist.*.count", "주문 수량은 필수 입니다.").isInt().bail().default(1),
    body("ordermenulist.*.discount", "별도 할인금액은 필수 입니다.").isInt().bail().default(0),
    body("takeoutyn").default(false).bail().isIn([true, false]).bail(),
    validator.validatorErrorChecker,
]

const countmodifyvalidparams = [
    body("")
]

router.post("/", firstordervalidparams, ordercontroller.firstorder);

router.post("/modify/", ordercontroller.countmodify);

module.exports = router;
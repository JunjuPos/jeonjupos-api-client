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
     *     "takeoutyn": "N"
     * }
     */
    body("spacepkey", "테이블번호는 필수 입니다.").not().isEmpty(),
    body("ordermenulist", "메뉴정보는 필수 입니다.").isArray(),
    body("ordermenulist.*.menupkey", "주문메뉴 고유번호는 필수 입니다.").isInt(),
    body("ordermenulist.*.count", "주문 수량은 필수 입니다.").isInt(),
    body("ordermenulist.*.discount", "별도 할인금액은 필수 입니다.").isInt(),
    body("takeoutyn").notEmpty().isIn(["Y", "N"]),
    validator.validatorErrorChecker,
]

router.post("/", firstordervalidparams, ordercontroller.firstorder);

module.exports = router;
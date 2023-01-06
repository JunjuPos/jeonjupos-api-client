let express = require('express');
let router = express.Router();
let ordercontroller = require("../controllers/ordercontroller");
let {body} = require("express-validator");

const firstordervalidparams = [
    // spacepkey, ordermenulist, takeoutyn
    body("spacepkey").not().isEmpty(),
    body("ordermenulist").isArray(),
    body("ordermenulist.*.menupkey").isInt(),
    body("ordermenulist.*.count").isInt(),
    body("ordermenulist.*.discount").isInt()

    /**
     * "menupkey": 2,
     *             "count": 2,
     *             "discount": 500
     */
]

router.post("/", firstordervalidparams, ordercontroller.firstorder);

module.exports = router;
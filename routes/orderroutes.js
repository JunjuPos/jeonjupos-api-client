let express = require('express');
let router = express.Router();
let ordercontroller = require("../controllers/ordercontroller");
import check from "express-validator";

const firstordervalidparams = [
    // spacepkey, ordermenulist, takeoutyn
    check("spacepkey").not().isEmpty(),
    check("ordermenulist").isArray(),
    check("ordermenulist.*.menupkey").isInt(),
    check("ordermenulist.*.count").isInt(),
    check("ordermenulist.*.discount").isInt()

    /**
     * "menupkey": 2,
     *             "count": 2,
     *             "discount": 500
     */
]

router.post("/", firstordervalidparams, ordercontroller.firstorder);

module.exports = router;
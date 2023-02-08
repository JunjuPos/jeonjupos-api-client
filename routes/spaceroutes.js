const express = require('express');
const router = express.Router();
const spaceController = require("../controllers/spacecontroller");
const jwtVerify = require("../middleware/jwtVerify");

router.get("/list", jwtVerify, spaceController.spacelist);
router.get("/order/list", jwtVerify, spaceController.orderlist);

// 같은 Endpoint에 method만 다른경우
// router.route("/test")
//     .get(spacecontroller.spacelist)
//     .post(spacecontroller.orderlist)

module.exports = router;
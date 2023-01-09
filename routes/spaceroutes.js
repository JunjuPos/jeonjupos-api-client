let express = require('express');
let router = express.Router();
let spacecontroller = require("../controllers/spacecontroller");

router.get("/list", spacecontroller.spacelist);
router.get("/order/list", spacecontroller.orderlist);

// 같은 Endpoint에 method만 다른경우
// router.route("/test")
//     .get(spacecontroller.spacelist)
//     .post(spacecontroller.orderlist)

module.exports = router;
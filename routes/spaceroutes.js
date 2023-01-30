let express = require('express');
let router = express.Router();
let spaceController = require("../controllers/spacecontroller");

router.get("/list", spaceController.spacelist);
router.get("/order/list", spaceController.orderlist);

// 같은 Endpoint에 method만 다른경우
// router.route("/test")
//     .get(spacecontroller.spacelist)
//     .post(spacecontroller.orderlist)

module.exports = router;
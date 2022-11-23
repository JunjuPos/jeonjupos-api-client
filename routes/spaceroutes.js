let express = require('express');
let router = express.Router();
let spacecontroller = require("../controllers/spacecontroller");

router.get("/list", spacecontroller.spacelist);
router.get("/order/list", spacecontroller.orderlist);

module.exports = router;
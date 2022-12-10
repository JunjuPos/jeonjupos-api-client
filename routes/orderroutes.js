let express = require('express');
let router = express.Router();
let ordercontroller = require("../controllers/ordercontroller");

router.post("/", ordercontroller.firstorder);

module.exports = router;
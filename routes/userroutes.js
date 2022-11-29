let express = require('express');
let router = express.Router();
let usercontroller = require("../controllers/usercontroller");

router.get("/postpaidgroup/list", usercontroller.postpaidgrouplist);

module.exports = router;
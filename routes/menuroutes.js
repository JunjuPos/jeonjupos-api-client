let express = require('express');
let router = express.Router();
let menucontroller = require("../controllers/menucontroller");

router.get("/list", menucontroller.menulist);

module.exports = router;
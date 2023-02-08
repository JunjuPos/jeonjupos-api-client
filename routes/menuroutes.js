let express = require('express');
let router = express.Router();
let menuController = require("../controllers/menucontroller");
const jwtVerify = require("../middleware/jwtVerify");

router.get("/list", jwtVerify, menuController.menulist);

module.exports = router;
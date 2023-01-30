let express = require('express');
let router = express.Router();
let menuController = require("../controllers/menucontroller");

router.get("/list", menuController.menulist);

module.exports = router;
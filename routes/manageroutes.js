const express = require('express');
const router = express.Router();
let {body} = require("express-validator");
const validator = require("../middleware/validator");
const jwtVerify = require("../middleware/jwtVerify");
const manageController = require("../controllers/managecontroller");


router.get("/menu/list", [jwtVerify], manageController.getMenuList);
router.post("/menu/useyn/modify", [jwtVerify], manageController.useYnModify);
router.post("/menu/takeoutyn/modify", [jwtVerify], manageController.takeoutYnModify);
router.post("/menu/takeinyn/modify", [jwtVerify], manageController.takeinYnModify);

router.get("/sale/list", [jwtVerify], manageController.getSaleList);

module.exports = router;
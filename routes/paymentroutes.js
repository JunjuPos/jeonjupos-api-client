const express = require('express');
const router = express.Router();
let {body} = require("express-validator");
const validator = require("../middleware/validator");
const jwtVerify = require("../middleware/jwtVerify");
const paymentController = require("../controllers/paymentcontroller");



router.post("/", jwtVerify, paymentController.pay);

module.exports = router;
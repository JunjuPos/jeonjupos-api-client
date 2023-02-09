let express = require('express');
let router = express.Router();
const jwtVerify = require("../middleware/jwtVerify");
let userController = require("../controllers/usercontroller");

router.get("/postpaid-group/list", jwtVerify, userController.getPostpaidGroupList); //
router.post("/login", userController.login);
router.post("/register", userController.ownerRegister);

module.exports = router;
let express = require('express');
let router = express.Router();
let userController = require("../controllers/usercontroller");

router.get("/postpaidgroup/list", userController.postpaidgrouplist); //
router.post("/login", userController.login);
router.post("/register", userController.ownerRegister);

module.exports = router;
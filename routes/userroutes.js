let express = require('express');
let router = express.Router();
let usercontroller = require("../controllers/usercontroller");


router.get("/", usercontroller.test);

module.exports = router;
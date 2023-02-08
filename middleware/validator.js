const { validationResult } = require("express-validator");

exports.validatorErrorChecker = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({message: "파라미터 오류", errors: errors.array()});
    }
    next();
}
const jwt = require("jsonwebtoken");
const jwtUtil = require("../common/jwtUtil");
const statusCode = require("../common/statusCode");
const responseUtil = require("../common/responseUtill");
const userModel = require("../models/userModel");

jwtVerify = async (req, res, next) => {
    // 요청 시 토큰 검증 미들웨어
    // 토큰안에는 storepkey만

    const token = req.headers.jwt;

    // 점주에 토큰이 있는지 체크
    try {
        const getJwtOwner = await userModel.getJwtOwner(token);
        if (getJwtOwner.length === 0) {
            // 토큰으로 점주를 찾을 수 없음
            return res.status(statusCode.UNAUTHORIZED).json(responseUtil.fail("9996"));
        } else {
            req.ownerpkey = getJwtOwner[0].ownerpkey;
            req.storepkey = getJwtOwner[0].storepkey;
        }
    } catch (err) {
        return res.status(statusCode.UNAUTHORIZED).json(responseUtil.fail("9996"));
    }

    let result = null;
    try {
        // 토큰 유효성 검증
        result = await jwtUtil.verify(token);
        req.storepkey = result.storepkey;
    } catch (err) {
        return res.status(statusCode.UNAUTHORIZED).json(responseUtil.fail(err.state));
    }

    next();
}

module.exports = jwtVerify;
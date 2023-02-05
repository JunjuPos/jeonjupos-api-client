/**
 * response format common module
 */
const responseMessage = require("./responseMessage");

util = {
    // 응답 성공 시
    success: (result_code, data) => {
        return {
            result: true,
            res_code: result_code,
            message: responseMessage[result_code],
            data,
        };
    },
    // 응답 실패 시
    fail: (result_code) => {
        return {
            result: false,
            res_code: result_code,
            message: responseMessage[result_code],
        };
    }
};

module.exports = util;
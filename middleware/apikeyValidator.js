const encrypto = require("../common/encrypto");
const uuidapikey = require("uuid-apikey");
const util = require("../common/responseUtill");
const message = require("../common/responseMessage");
const statusCode = require("../common/statusCode");


apikeyValidCheck = async (req, res, next) => {
    // apikey
    const key = {
        apiKey: 'JQ6RRVC-0FA4TVX-P4N57FR-CVM5T4R',
        uuid: '95cd8c6d-03d4-4d6f-b12a-53bf66e85d13'
    }

    try{
        // headers에 apikey 유효성 체크
        let apikey = req.headers.apikey;
        if (apikey === undefined || apikey.length === 0) {
            res.status(statusCode.CONFLICT).send(util.fail(statusCode.CONFLICT, message["8889"]))
        }

        // aes256으로 암호화된 값을 복호화
        apikey = await encrypto.decrypt(req.headers.apikey);

        // apikey와 일치여부 체크
        if (!uuidapikey.isAPIKey(apikey) || !uuidapikey.check(apikey, key.uuid)) {
            res.status(statusCode.CONFLICT).send(util.fail(statusCode.CONFLICT, message["8888"]));
        }else {
            next();
        }
    } catch (err) {
        // headers에 apikey값이 없는경우, 요청값이 위변조된 경우
        res.status(statusCode.CONFLICT).send(util.fail(statusCode.CONFLICT, message["8887"]));
    }
}

module.exports = apikeyValidCheck;
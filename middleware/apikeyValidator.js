const encrypto = require("../common/encrypto");
const uuidapikey = require("uuid-apikey");


exports.apikeyValidCheck = async (req, res, next) => {
    // apikey
    const key = {
        apiKey: 'JQ6RRVC-0FA4TVX-P4N57FR-CVM5T4R',
        uuid: '95cd8c6d-03d4-4d6f-b12a-53bf66e85d13'
    }

    try{
        // headers에 apikey 유효성 체크
        let apikey = req.headers.apikey;
        if (apikey === undefined || apikey.length === 0) {
            return res.status(409).json({res_code: "8889", message: "headers에 apikey가 비어있습니다."});
        }

        // aes256으로 암호화된 값을 복호화
        apikey = await encrypto.decrypt(req.headers.apikey);

        // apikey와 일치여부 체크
        if (!uuidapikey.isAPIKey(apikey) || !uuidapikey.check(apikey, key.uuid)) {
            return res.status(409).json({res_code: "8888", message: "apikey가 위변조 되었습니다."});
        }else {
            next();
        }
    } catch (err) {
        // headers에 apikey값이 없는경우, 요청값이 위변조된 경우
        return res.status(409).json({res_code: "8887", message: err});
    }
}
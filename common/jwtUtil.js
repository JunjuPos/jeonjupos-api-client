const jwt = require("jsonwebtoken");
const {JWT_SECRETKEY, JWT_ALGORITHM, JWT_EXPIRESIN, JWT_ISSUER} = process.env;

const jwtUtil = {
    sign: async (storepkey) => {
        const payload = {
            storepkey: storepkey
        }
        const options = {
            algorithm: JWT_ALGORITHM,
            expiresIn: JWT_EXPIRESIN,
            issuer: JWT_ISSUER
        }
        return jwt.sign(payload, JWT_SECRETKEY, options);
    },
    verify: async (token) => {
        let decoded;
        try{
            decoded = jwt.verify(token, JWT_SECRETKEY);
        }catch (err) {
            if (err.message === 'jwtVerify.js expired') {
                err.state = "9998";
            } else if (err.message === 'invalid token') {
                err.state = "9997";
            } else {
                err.state = "9997";
            }
            throw err;
        }
        return decoded;
    }
}

module.exports = jwtUtil;
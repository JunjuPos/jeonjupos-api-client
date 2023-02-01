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
            if (err.message === 'jwt expired') {
                return -3;
            } else if (err.message === 'invalid token') {
                return -2;
            } else {
                return -2;
            }
        }
        return decoded;
    }
}

module.exports = jwtUtil;
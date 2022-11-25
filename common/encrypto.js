const crypto = require('crypto');
// 암복호화 관련
const key = '0000000000@asdasdas#adadadskey00';
const iv = '0000000000000000';
// 암호화 AES256
exports.encrypt = async (data) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypt = cipher.update(data, 'utf8', 'base64');
    encrypt += cipher.final('base64');
    return encrypt
}

// 복호화 AES256
exports.decrypt = async (data) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypt = decipher.update(data, 'base64', 'utf8');
    decrypt += decipher.final('utf8');
    return decrypt
}
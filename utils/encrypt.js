
const crypto = require('crypto');
const {env} = require('./env');
const logger = require("./log")
// 密钥和初始化向量(IV)应该是随机生成的，但为了示例，我们使用固定的值。
const default_key = 'Alvin1234567890987654321'; // 256位密钥
const default_iv = 'WlJpeHRCdUR6TkJhZllt'; // 16字节IV
// 将输入字符串转换为256/size位密钥
function stringToBitKey(inputString, size) {
    const hash = crypto.createHash('sha256');
    hash.update(inputString);
    return size ? hash.digest().slice(0, size) : hash.digest();
}
// 加密函数
function encrypt(text, secret_key) {
    try {
        const iv = Buffer.from(stringToBitKey(default_iv, 16));
        const key = Buffer.from(stringToBitKey(secret_key || env.SECRET_KEY || default_key));
        let cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return encrypted.toString('hex');
    } catch (error) {
        console.log(logger.error(error))
    }
}

// 解密函数
function decrypt(text, secret_key) {
    try {
        const iv = Buffer.from(stringToBitKey(default_iv, 16));
        const key = Buffer.from(stringToBitKey(secret_key || env.SECRET_KEY || default_key));
        let encryptedText = Buffer.from(text, 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (error) {
        console.log(logger.error(error))
    }

}

module.exports = {
    encrypt,
    decrypt
}
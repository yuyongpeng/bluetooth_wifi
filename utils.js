/**
 * Created by yuyongpeng on 2018/5/14.
 */
var crypto = require('crypto');
var aesutil = module.exports = {};

aesutil.key = function () {
    const buf = Buffer.alloc(16);
    var x = crypto.randomFill(buf, (err, buf) => {
        if (err) throw err;
        // console.log(buf.toString('hex'));
    });
    return x;
}

aesutil.iv = function () {
    const buf = Buffer.alloc(8);
    var x = crypto.randomFill(buf, (err, buf) => {
        if (err) throw err;
        // console.log(buf.toString('hex'));
    });
    return x;
}

/**
 * aes加密
 * @param data 待加密内容
 * @param key 必须为32位私钥
 * @returns {string}
 */
aesutil.encryption = function (data, key, iv) {
    iv = iv || "";
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));
    return cipherChunks.join('');
}

/**
 * aes解密
 * @param data 待解密内容
 * @param key 必须为32位私钥
 * @returns {string}
 */
aesutil.decryption = function (data, key, iv) {
    if (!data) {
        return "";
    }
    iv = iv || "";
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    decipher.setAutoPadding(true);
    cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
    cipherChunks.push(decipher.final(clearEncoding));
    return cipherChunks.join('');
}
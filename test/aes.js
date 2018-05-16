/**
 * Created by yuyongpeng on 2018/5/14.
 */
/*var crypto = require('crypto');

var data = "156156165152165156156";
console.log('Original cleartext: ' + data);
var algorithm = 'aes-128-ecb';
var key = '78541561566';
var clearEncoding = 'utf8';
var iv = "";
//var cipherEncoding = 'hex';
//If the next line is uncommented, the final cleartext is wrong.
var cipherEncoding = 'base64';
var cipher = crypto.createCipheriv(algorithm, key,iv);

var cipherChunks = [];
cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
cipherChunks.push(cipher.final(cipherEncoding));
console.log(cipherEncoding + ' ciphertext: ' + cipherChunks.join(''));

var decipher = crypto.createDecipheriv(algorithm, key,iv);
var plainChunks = [];
for (var i = 0;i < cipherChunks.length;i++) {
    plainChunks.push(decipher.update(cipherChunks[i], cipherEncoding, clearEncoding));

}
plainChunks.push(decipher.final(clearEncoding));
console.log("UTF8 plaintext deciphered: " + plainChunks.join(''));*/




var crypto = require('crypto');
// var cipher = crypto.createCipher('aes-256-cbc','InmbuvP6Z8')
// var text = '{"username":"yuyongpeng","mobile":"12345678901"}';
// var crypted = cipher.update(text,'utf8','hex')
// crypted += cipher.final('hex')
// console.log(crypted);
// var decipher = crypto.createDecipher('aes-256-cbc','InmbuvP6Z8')
// var dec = decipher.update(crypted,'hex','utf8')
// dec += decipher.final('utf8')
// console.log(dec);


/**
 * aes加密
 * @param data 待加密内容
 * @param key 必须为32位私钥
 * @returns {string}
 */
var encryption = function (data, key, iv) {
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
var decryption = function (data, key, iv) {
    if (!data) {
        return "";
    }
    iv = iv || "";
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var decipher = crypto.createDecipheriv('aes-256-ebc', key, iv);
    decipher.setAutoPadding(true);
    cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
    cipherChunks.push(decipher.final(clearEncoding));
    return cipherChunks.join('');
}
var text = '{"username":"yuyongpeng", "mobile":"12345"}';
var key = "ExchangePasswordPasswordExchange";    // 长度必须32
//var key = "f21dab5f1q2w3e4r";    // 长度必须32
var iv = new Buffer(crypto.randomBytes(16))
var ivstring = iv.toString('hex').slice(0, 16);   // 长度必须16
ivstring = 'f21dab5f0aca29c6'
console.log(ivstring);
mima = encryption(text,key,ivstring);
console.log(mima)
//mima = 'qaJDlAyIzXV25TbLCQySl0e8VLoFHAzcpB2saZLShecf3QpT7jnY8t40yQhVbdhEX9ECKIqHC80O7RGMlw6ndg=='
//console.log(decryption(mima,key, ivstring))

var crypto = require('crypto');
// var Buffer = require('Buffer');

var key = 'ExchangePasswordPasswordExchange'
var iv = new Buffer('f21dab5f0aca29c6')
// iv.fill(0)

var text = '{"username":"yuyongpeng", "mobile":"12345"}'

cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
output = cipher.update(text, 'utf8', 'base64')
output += cipher.final('base64')

console.log(output)







// var crypto = require('crypto');
// var key = 'ExchangePasswordPasswordExchange';
// // var iv = new Buffer(crypto.randomBytes(16))
// // var ivstring = iv.toString('hex').slice(0, 16);
// var cipher = crypto.createCipheriv('aes-256-cbc', key, ivstring)
// var  decipher = crypto.createDecipheriv('aes-256-cbc', key,ivstring);
//
// cipher.update(plaintext, 'utf8', 'base64');
// var encryptedPassword = cipher.final('base64');
// console.log(encryptedPassword)

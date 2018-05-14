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
    var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    decipher.setAutoPadding(true);
    cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
    cipherChunks.push(decipher.final(clearEncoding));
    return cipherChunks.join('');
}

// var key = "ExchangePasswordPasswordExchange";    // 长度必须32
// var iv = new Buffer(crypto.randomBytes(16))
// var ivstring = iv.toString('hex').slice(0, 16);   // 长度必须16
// console.log(ivstring);
// mima = encryption(text,key,ivstring);
// console.log(mima)
// console.log(decryption(mima,key, ivstring))
//
// var crypto = require('crypto');
// var key = 'ExchangePasswordPasswordExchange';
// var key = 'qawsedrftgyhujik';
// // var  plaintext = '150.01';
// var iv = new Buffer(crypto.randomBytes(16))
// // ivstring = iv.toString('hex');
// var ivstring = iv.toString('hex').slice(0, 16);
//
// var cipher = crypto.createCipheriv('aes-256-cbc', key, ivstring)
// var  decipher = crypto.createDecipheriv('aes-256-cbc', key,ivstring);
//
// cipher.update(plaintext, 'utf8', 'base64');
// var encryptedPassword = cipher.final('base64');
// console.log(encryptedPassword)

const key = crypto.pbkdf2Sync('secret', 'salt', 100000, 16, 'sha512');
console.log(key);
console.log(key.toString('hex'));
const buf = Buffer.alloc(16);
// crypto.randomFillSync(buf, (err, buf) => {
//     if (err) throw err;
//     console.log(buf.toString('hex'));
// });
//
// crypto.randomFill(buf, 5, (err, buf) => {
//     if (err) throw err;
//     console.log(buf.toString('hex'));
// });

// The above is equivalent to the following:
var x = crypto.randomFill(buf, (err, buf) => {
    if (err) throw err;
    console.log(buf.toString('hex'));
});
console.log(x);
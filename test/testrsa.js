/**
 * Created by yuyongpeng on 2018/5/12.
 */

var NodeRSA = require('node-rsa');
var key = new NodeRSA({b: 512});
var key2 = new NodeRSA('-----BEGIN RSA PRIVATE KEY-----\n'+
    'MIIBOQIBAAJAVY6quuzCwyOWzymJ7C4zXjeV/232wt2ZgJZ1kHzjI73wnhQ3WQcL\n'+
    'DFCSoi2lPUW8/zspk0qWvPdtp6Jg5Lu7hwIDAQABAkBEws9mQahZ6r1mq2zEm3D/\n'+
    'VM9BpV//xtd6p/G+eRCYBT2qshGx42ucdgZCYJptFoW+HEx/jtzWe74yK6jGIkWJ\n'+
    'AiEAoNAMsPqwWwTyjDZCo9iKvfIQvd3MWnmtFmjiHoPtjx0CIQCIMypAEEkZuQUi\n'+
    'pMoreJrOlLJWdc0bfhzNAJjxsTv/8wIgQG0ZqI3GubBxu9rBOAM5EoA4VNjXVigJ\n'+
    'QEEk1jTkp8ECIQCHhsoq90mWM/p9L5cQzLDWkTYoPI49Ji+Iemi2T5MRqwIgQl07\n'+
    'Es+KCn25OKXR/FJ5fu6A6A+MptABL3r8SEjlpLc=\n'+
    '-----END RSA PRIVATE KEY-----');
console.log(key.exportKey());


var crypto = require('crypto');


//console.log(crypto.getCiphers());
var crypto = require('crypto')
    ,fs = require('fs');

function signer(algorithm,key,data){
    var sign = crypto.createSign(algorithm);
    sign.update(data);
    sig = sign.sign(key, 'hex');
    return sig;
}

function verify(algorithm,pub,sig,data){
    var verify = crypto.createVerify(algorithm);
    verify.update(data);
    return verify.verify(pubkey, sig, 'hex')
}

var algorithm = 'RSA-SHA256';
var data = "abcdef";   //传输的数据
var privatePem = fs.readFileSync('server.pem');
var key = privatePem.toString();
console.log(key);
var sig = signer(algorithm,key,data); //数字签名

var publicPem = fs.readFileSync('cert.pem');
var pubkey = publicPem.toString();
console.log(verify(algorithm,pubkey,sig,data));         //验证数据，通过公钥、数字签名 =》是原始数据
console.log(verify(algorithm,pubkey,sig,data+"2"));    //验证数据，通过公钥、数字签名  =》不是原始数据


function foo() {
    this.hello = "world";
}
foo.prototype.hello = "蛋花汤";
foo.prototype.helloix = "IX";

var bar = new foo();
bar.hello = 'xxxx';
console.log(bar.hello);  // 输出world
console.log(bar.helloix);  // 输出IX

var bar2 = new foo()
console.log(bar2.hello);  // 输出world

console.log(foo.hello);
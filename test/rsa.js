/**
 * Created by yuyongpeng on 2018/5/14.
 */

var NodeRSA = require('node-rsa');
var key = new NodeRSA({b: 512});

var text = 'Hello RSA!';
var encrypted = key.encrypt(text, 'base64');
console.log('encrypted: ', encrypted);
var decrypted = key.decrypt(encrypted, 'utf8');
console.log('decrypted: ', decrypted);

//var key = new NodeRSA({b: 512, encryptionScheme: 'pkcs1_oaep', signingScheme: 'pkcs1-sha256'});
var key = new NodeRSA({b: 128, encryptionScheme: 'pkcs8_oaep', signingScheme: 'sha256'});
// var keyData = "-----BEGIN PRIVATE KEY-----
// MHgCAQAwDQYJKoZIhvcNAQEBBQAEZDBiAgEAAhEAlPqZYFJqmUHRGAcdsB4z8wID
// AQABAhAB1soX50yLkcCW2S+jMzbhAgkA0RDP77t6tvECCQC2bIwl7CRBIwIJANAz
// gADsog7hAggQKfgVGCJyPwIIb+I3sivqC1A=
//     -----END PRIVATE KEY-----
//     "
// key.importKey(keyData, 'pkcs8');
console.log(key.exportKey('pkcs8-private-pem'));
console.log(key.exportKey('pkcs8-public-pem'));
console.log(key.exportKey('pkcs8-private-der'));
console.log(key.exportKey('pkcs8-public-der'));

data = 'hello ble';
// key.encrypt(data, 'base64', 'utf8');
console.log(key.encryptPrivate(data, 'base64', 'utf8'));


const buf = Buffer.alloc(10);
crypto.randomFill(buf, (err, buf) => {
    if (err) throw err;
    console.log(buf.toString('hex'));
});

crypto.randomFill(buf, 5, (err, buf) => {
    if (err) throw err;
    console.log(buf.toString('hex'));
});

// The above is equivalent to the following:
crypto.randomFill(buf, 5, 5, (err, buf) => {
    if (err) throw err;
    console.log(buf.toString('hex'));
});
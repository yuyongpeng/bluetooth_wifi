var util = require('util');
var bleno = require('bleno');
var dphotos = require('./dphotos');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var DphotosPubkeyCharacteristic = function() {
    DphotosPubkeyCharacteristic.super_.call(this, {
        uuid: 'D002',
        properties: ['read'],
        descriptors: [
            new Descriptor({
                uuid: 'D012',
                value: 'get public key RSA'
            })
        ]
    });
    this._updateValueCallback = null;
};

util.inherits(DphotosPubkeyCharacteristic, Characteristic);

DphotosPubkeyCharacteristic.prototype.onReadRequest = function(offset, callback) {
    console.log(dphotos.key)
    var rt = {state: 'SUCESS', key: dphotos.key, iv: dphotos.iv};
    rt_json = JSON.stringify(rt);
    var rt_base64 = new Buffer(rt_json).toString('base64');
    callback(this.RESULT_SUCCESS, new Buffer(rt_base64,'utf8'));
};
// 订阅
DphotosPubkeyCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('DphotosPubkeyCharacteristic - onSubscribe');
    this._updateValueCallback = updateValueCallback;
};
module.exports = DphotosPubkeyCharacteristic;

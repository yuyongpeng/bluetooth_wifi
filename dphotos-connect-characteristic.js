var util = require('util');
var bleno = require('bleno');
var dphotos = require('./dphotos');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var DphotosConnectCharacteristic = function() {
    DphotosConnectCharacteristic.super_.call(this, {
        uuid: 'D011',
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

util.inherits(DphotosConnectCharacteristic, Characteristic);

DphotosConnectCharacteristic.prototype.onReadRequest = function(offset, callback) {
    console.log('-------------'+dphotos.key)
  callback(this.RESULT_SUCCESS, dphotos.key);
};
// 订阅
DphotosConnectCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('DphotosConnectCharacteristic - onSubscribe');
    this._updateValueCallback = updateValueCallback;
};
module.exports = DphotosConnectCharacteristic;

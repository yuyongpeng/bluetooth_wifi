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
};

util.inherits(DphotosPubkeyCharacteristic, Characteristic);

DphotosPubkeyCharacteristic.prototype.onReadRequest = function(offset, callback) {
    console.log(dphotos.prikey)
  callback(this.RESULT_SUCCESS, '1');
};

module.exports = DphotosPubkeyCharacteristic;

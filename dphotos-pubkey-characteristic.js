var util = require('util');
var bleno = require('bleno');
var dphotos = require('./dphotos');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var DphotosPubkeyCharacteristic = function() {
    DphotosPubkeyCharacteristic.super_.call(this, {
    uuid: 'DP02',
    properties: ['read'],
    descriptors: [
      new Descriptor({
        uuid: 'DP12',
        value: 'get public key RSA'
      })
    ]
  });
};

util.inherits(DphotosPubkeyCharacteristic, Characteristic);

DphotosPubkeyCharacteristic.prototype.onReadRequest = function(offset, callback) {
  callback(this.RESULT_SUCCESS, Buffer.from(dphotos.pubkey));
};

module.exports = DphotosPubkeyCharacteristic;

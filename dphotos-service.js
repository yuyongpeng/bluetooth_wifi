var util = require('util');

var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var DphotoPubkeyCharacteristic = require('./dphotos-pubkey-characteristic');
var DphotoPairCharacteristic = require('./dphotos-pair-characteristic');
var DphotoWifiCharacteristic = require('./dphotos-wifi-characteristic');

function DphotosService() {
    DphotosService.super_.call(this, {
      uuid: 'DP01',
      characteristics: [
          new DphotoPubkeyCharacteristic(),
          new DphotoPairCharacteristic(),
          new DphotoWifiCharacteristic()
      ]
  });
}

util.inherits(DphotosService, BlenoPrimaryService);

module.exports = DphotosService;

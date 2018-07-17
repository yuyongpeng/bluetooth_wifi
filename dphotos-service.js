var util = require('util');

var bleno = require('bleno');

var BlenoPrimaryService = bleno.PrimaryService;

var DphotoPubkeyCharacteristic = require('./dphotos-pubkey-characteristic');
var DphotoPairCharacteristic = require('./dphotos-pair-characteristic');
var DphotoWifiCharacteristic = require('./dphotos-wifi-characteristic');
var DphotoWifiCharacteristici_getip = require('./dphotos-wifi-characteristic-getip');
var DphotosConnectCharacteristic = require('./dphotos-connect-characteristic');

function DphotosService() {
    DphotosService.super_.call(this, {
      uuid: 'D001',
      characteristics: [
          // new DphotosConnectCharacteristic(),
          new DphotoPubkeyCharacteristic(),
          new DphotoPairCharacteristic(),
          new DphotoWifiCharacteristic(),
          new DphotoWifiCharacteristici_getip()
      ]
  });
}

util.inherits(DphotosService, BlenoPrimaryService);

module.exports = DphotosService;

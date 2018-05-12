var bleno = require('../..');
var DphotosService = require('./dphotos-service');
var NodeRSA = require('node-rsa');
var dphotos = require('dphotos')

var primaryService = new DphotosService();

bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);
    if (state === 'poweredOn') {
        // 开启广播
        bleno.startAdvertising('Battery', [primaryService.uuid]);
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
    var key = new NodeRSA({b: 512});
    dphotos.prikey = key;
    if (!error) {
        bleno.setServices([primaryService], function(error){
            console.log('set DphotosService: '  + (error ? 'error ' + error : 'success'));
        });
    }
});
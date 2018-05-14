var bleno = require('bleno');
var NodeRSA = require('node-rsa');
var dphotos = require('./dphotos');
var aes = require('./utils');
var DphotosService = require('./dphotos-service');

var primaryService = new DphotosService();

bleno.on('stateChange', function(state) {
    console.log('on -> stateChange: ' + state);
    if (state === 'poweredOn') {
        // 开启广播
        bleno.startAdvertising('dPHOTOS-tfb-1234', [primaryService.uuid]);
    } else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
    // dphotos.key = aes.key();
    // dphotos.iv = aes.iv();
    if (!error) {
        bleno.setServices([primaryService], function(error){
            console.log('set DphotosService: '  + (error ? 'error ' + error : 'success'));
        });
    }
});

bleno.on('mtu', function(error) {
    console.log('on -> advertisingStart: ' + (error ? 'error ' + error : 'success'));
    var key = new NodeRSA({b: 512});
    console.log(key.exportKey());
    dphotos.prikey = key.exportKey();
    if (!error) {
        bleno.setServices([primaryService], function(error){
            console.log('set DphotosService: '  + (error ? 'error ' + error : 'success'));
        });
    }
});

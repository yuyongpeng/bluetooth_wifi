var util = require('util');
var os = require('os');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var sleep = require('sleep');
var bleno = require('bleno');
var aes = require('./utils');
var dphotos = require('./dphotos');
var http = require('http');
var wpa_cli = require('wireless-tools/wpa_cli');

var co = require('co');
var rp = require("request-promise");

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var DphotosWifiCharacteristicGetip = function () {
    DphotosWifiCharacteristicGetip.super_.call(this, {
        uuid: 'D005',
        properties: ['read'],
        descriptors: [
            new Descriptor({
                uuid: 'D015',
                value: 'get wifi ip address'
            }),
            new Descriptor({
                uuid: 'D025',
                value: new Buffer([0x04, 0x01, 0x27, 0xAD, 0x01, 0x00, 0x00]) // maybe 12 0xC unsigned 8 bit
            })
        ]
    });
    this._value = '';
    this._updateValueCallback = null;
};

util.inherits(DphotosWifiCharacteristicGetip, Characteristic);

DphotosWifiCharacteristicGetip.prototype.onReadRequest = function (offset, callback) {
    // wpa_cli.status('wlan0', function (err, status) {
    //     console.dir(status);
    //     if (status.wpa_state == 'COMPLETED' && status.ip != undefined) {
    //         rt = { state: 'SUCESS', ip: status.ip, deviceid: '51c3c8a0-7f440-11e8-b8a8-79d477b2ab68' };
    //         rt_json = JSON.stringify(rt);
    //         secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
    //         // this._updateValueCallback(new Buffer(secrect,'utf8'));
    //         callback(this.RESULT_SUCCESS, new Buffer(secrect, 'utf8'));
    //     } else {
    //         rt = { state: 'FAIL', msg: 'can not get ip address', errorno: '1003' };
    //         rt_json = JSON.stringify(rt);
    //         secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
    //         // this._updateValueCallback(new Buffer(secrect,'utf8'));
    //         callback(this.RESULT_SUCCESS, new Buffer(secrect, 'utf8'));
    //     }
    // }.bind(this));

    wpa_cli.status('wlan0', function (err, status) {
        console.dir(status);
        if (status == undefined) {
            console.dir('1111');
            rt = { state: 'FAIL', msg: 'Please reconnect wifi', errorno: '1006' };
            rt_json = JSON.stringify(rt);
            secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
            console.log(rt_json);
            self._updateValueCallback(new Buffer(secrect, 'utf8'));
        } else if (status.wpa_state == 'INTERFACE_DISABLED') {
            console.dir('2222');
            rt = { state: 'FAIL', msg: 'Please reconnect wifi', errorno: '1006' };
            rt_json = JSON.stringify(rt);
            secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
            console.log(rt_json);
            self._updateValueCallback(new Buffer(secrect, 'utf8'));
        } else if (status.wpa_state == 'COMPLETED' && status.ip != undefined) {
            console.dir('3333');
            rt = { state: 'SUCESS', ip: status.ip, deviceid: '51c3c8a0-7f440-11e8-b8a8-79d477b2ab68' };
            rt_json = JSON.stringify(rt);
            console.log(rt_json);
            secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
            self._updateValueCallback(new Buffer(secrect, 'utf8'));
        }
    }.bind(this));
};

module.exports = DphotosWifiCharacteristicGetip;

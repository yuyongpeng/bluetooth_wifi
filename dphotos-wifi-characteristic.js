var util = require('util');
var os = require('os');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var DphotosWifiCharacteristic = function() {
    DphotosWifiCharacteristic.super_.call(this, {
    uuid: 'DP04',
    properties: ['read', 'write', 'notify'],
    descriptors: [
      new Descriptor({
        uuid: 'DP14',
        value: 'set wifi'
      }),
      new Descriptor({
        uuid: 'DP24',
        value: new Buffer([0x04, 0x01, 0x27, 0xAD, 0x01, 0x00, 0x00 ]) // maybe 12 0xC unsigned 8 bit
      })
    ]
  });
};

util.inherits(DphotosWifiCharacteristic, Characteristic);

DphotosWifiCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback){
    if (offset) {
        callback(this.RESULT_ATTR_NOT_LONG);
    }
    else if (data.length !== 1) {
        callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
    }
    else {
        data_json = data.toString('hex');
        pair_obj = JSON.parse(data_json)
        ssid = pair_obj.ssid;
        password = pair_obj.password;
        // network = commands.getstatusoutput("wpa_cli -iwlan0 add_network")
        // id = network[1]
        // commands.getstatusoutput("wpa_cli -iwlan0 set_network %s ssid '\"%s\"'" % (id, js['ssid']))
        // commands.getstatusoutput("wpa_cli -iwlan0 set_network %s ssid '\"%s\"'" % (id, js['ssid']))
        // commands.getstatusoutput("wpa_cli -iwlan0 set_network %s key_mgmt WPA-PSK" % id)
        // commands.getstatusoutput("wpa_cli -iwlan0 set_network %s psk '\"%s\"'" % (id, js['password']))
        // commands.getstatusoutput("wpa_cli -iwlan0 enable_network %s" % id)
        // commands.getstatusoutput("wpa_cli -iwlan0 save")

        execSync("wpa_cli -iwlan0 set_network " + id + " ssid " + ssid, function (error, stdout, stderr) {
            var data = stdout.toString();
            console.log(data);
        });
        execSync("wpa_cli -iwlan0 set_network " + id + " key_mgmt WPA-PSK ", function (error, stdout, stderr) {
            var data = stdout.toString();
            console.log(data);
        });
        execSync("wpa_cli -iwlan0 set_network " + id + " psk " + password, function (error, stdout, stderr) {
            var data = stdout.toString();
            console.log(data);
        });
        execSync("wpa_cli -iwlan0 enable_network " + id, function (error, stdout, stderr) {
            var data = stdout.toString();
            console.log(data);
        });
        execSync("wpa_cli -iwlan0 save ", function (error, stdout, stderr) {
            var data = stdout.toString();
            console.log(data);
        });
        callback(this.RESULT_SUCCESS);
    }
};

// 通知
DphotosPairCharacteristic.prototype.onNotify = function(offset, callback) {
    //callback(this.RESULT_SUCCESS, Buffer.from('{"state":"SUCESS","IP":"192.168.1.100"}', 'utf8'));
    callback(this.RESULT_SUCCESS, Buffer.from('{"state":"FAIL","msg":"error password","errorno":"2001"}', 'utf8'));
};

module.exports = DphotosWifiCharacteristic;

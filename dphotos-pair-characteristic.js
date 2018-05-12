var util = require('util');
var bleno = require('bleno');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var DphotosPairCharacteristic = function() {
    DphotosPairCharacteristic.super_.call(this, {
    uuid: 'D003',
    properties: ['read', 'write', 'notify'],
    descriptors: [
      new Descriptor({
        uuid: 'D013',
        value: 'BLE pair'
      })
    ]
  });
};

util.inherits(DphotosPairCharacteristic, Characteristic);

DphotosPairCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback){
    if (offset) {
        callback(this.RESULT_ATTR_NOT_LONG);
    }
    else if (data.length !== 1) {
        callback(this.RESULT_INVALID_ATTRIBUTE_LENGTH);
    }
    else {
        data_json = data.toString('hex');
        pair_obj = JSON.parse(data_json)
        username = pair_obj.username;
        mobile = pair_obj.mobile;
        callback(this.RESULT_SUCCESS);
    }
};
// 订阅
DphotosPairCharacteristic.prototype.onSubscribe = function(offset, callback) {
    if (os.platform() === 'darwin') {
        exec('pmset -g batt', function (error, stdout, stderr) {
            var data = stdout.toString();
            // data - 'Now drawing from \'Battery Power\'\n -InternalBattery-0\t95%; discharging; 4:11 remaining\n'
            var percent = data.split('\t')[1].split(';')[0];
            console.log(percent);
            percent = parseInt(percent, 10);
            callback(this.RESULT_SUCCESS, new Buffer([percent]));
        });
    } else {
        // return hardcoded value
        callback(this.RESULT_SUCCESS, new Buffer([98]));
    }
};
// 通知
// DphotosPairCharacteristic.prototype.onNotify = function(offset, callback) {
//     //callback(this.RESULT_SUCCESS, Buffer.from('{"state":"SUCESS","IP":"192.168.1.100"}', 'utf8'));
//     callback(this.RESULT_SUCCESS, Buffer.from('{"state":"FAIL","msg":"error password","errorno":"2001"}', 'utf8'));
// };
module.exports = DphotosPairCharacteristic;

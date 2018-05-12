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
    this._value = 'xxxxxxx11';
    this._updateValueCallback = null;
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
        // 如果注册了回调，就调用
        if (this._updateValueCallback) {
            console.log('DphotosPairCharacteristic - onWriteRequest: notifying');
            this._updateValueCallback(this._value);
        }

        callback(this.RESULT_SUCCESS);
    }
};
// 订阅
DphotosPairCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('DphotosPairCharacteristic - onSubscribe');
    this._updateValueCallback = updateValueCallback;
};
// 撤销订阅
EchoCharacteristic.prototype.onUnsubscribe = function() {
    console.log('DphotosPairCharacteristic - onUnsubscribe');
    this._updateValueCallback = null;
};

// 通知
// DphotosPairCharacteristic.prototype.onNotify = function() {
// console.log('NotifyOnlyCharacteristic on notify');
//     //callback(this.RESULT_SUCCESS, Buffer.from('{"state":"SUCESS","IP":"192.168.1.100"}', 'utf8'));
//     callback(this.RESULT_SUCCESS, Buffer.from('{"state":"FAIL","msg":"error password","errorno":"2001"}', 'utf8'));
// };
module.exports = DphotosPairCharacteristic;

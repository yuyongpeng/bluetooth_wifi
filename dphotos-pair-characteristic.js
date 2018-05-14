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
    this._value = '';
    this._updateValueCallback = null;
};

util.inherits(DphotosPairCharacteristic, Characteristic);

DphotosPairCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback){
    if (offset) {
        callback(this.RESULT_ATTR_NOT_LONG);
    }
    else if (data.length > 0) {
        data_str = data.toString('utf8');
        var tp = data_str.substr(0, 1);
        var ds = data_str.substr(1);
        // console.log(tp);
        // console.log(ds);
        this._value += ds;
        if (tp == '1'){
            var data_json = new Buffer(this._value, 'base64').toString('utf8');
            console.log(this._value);
            pair_obj = JSON.parse(data_json)
            username = pair_obj.username;
            mobile = pair_obj.mobile;
            console.log(pair_obj);
        }
        // {"username":"yuyongpeng", "mobile":"12345"}
        // eyJ1c2VybmFtZSI6Inl1eW9uZ3BlbmciLCAibW9iaWxlIjoiMTIzNDUifQ==
        // 0eyJ1c2VybmFtZSI6Inl01eW9uZ3BlbmciLCAibW09iaWxlIjoiMTIzNDUif1Q==
        // 0eyJ1c2VybmFtZSI6Inl
        // 01eW9uZ3BlbmciLCAibW
        // 09iaWxlIjoiMTIzNDUif
        // 1Q==

        // 如果注册了回调，就调用
        if (this._updateValueCallback) {
            console.log('DphotosPairCharacteristic - onWriteRequest: notifying');
            rt = {state: 'SUCESS', key: dphotos.key(), iv: dphotos.iv()};
            rt_json = JSON.stringify(rt);
            var rt_base64 = new Buffer(rt_json).toString('base64')
            this._updateValueCallback(rt_base64);
        }
        if(! withoutResponse){
            callback(this.RESULT_SUCCESS);
        }
    }
    else {
        console.log('444444');
    }
};
// 订阅
DphotosPairCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
    console.log('DphotosPairCharacteristic - onSubscribe');
    this._updateValueCallback = updateValueCallback;
};
// 撤销订阅
DphotosPairCharacteristic.prototype.onUnsubscribe = function() {
    console.log('DphotosPairCharacteristic - onUnsubscribe');
    this._value = '';
    this._updateValueCallback = null;
};

// 通知
// DphotosPairCharacteristic.prototype.onNotify = function() {
// console.log('NotifyOnlyCharacteristic on notify');
//     //callback(this.RESULT_SUCCESS, Buffer.from('{"state":"SUCESS","IP":"192.168.1.100"}', 'utf8'));
//     callback(this.RESULT_SUCCESS, Buffer.from('{"state":"FAIL","msg":"error password","errorno":"2001"}', 'utf8'));
// };
module.exports = DphotosPairCharacteristic;

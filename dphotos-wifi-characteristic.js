var util = require('util');
var os = require('os');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var sleep = require('sleep');
var bleno = require('bleno');
var aes = require('./utils');
var dphotos = require('./dphotos');
var http = require('http');
var socket = require('socket.io-client')('http://localhost:8081');
var wpa_cli = require('wireless-tools/wpa_cli');
var mqtt = require('mqtt')
var options = {
    port: 1883,
    host: '127.0.0.1',
}
//var client  = mqtt.connect(options)

var co = require('co');
var rp = require("request-promise");

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var DphotosWifiCharacteristic = function () {
    DphotosWifiCharacteristic.super_.call(this, {
        uuid: 'D004',
        properties: ['read', 'write', 'notify'],
        descriptors: [
            new Descriptor({
                uuid: 'D014',
                value: 'set wifi'
            }),
            new Descriptor({
                uuid: 'D024',
                value: new Buffer([0x04, 0x01, 0x27, 0xAD, 0x01, 0x00, 0x00]) // maybe 12 0xC unsigned 8 bit
            })
        ]
    });
    this._value = '';
    this._updateValueCallback = null;
};

util.inherits(DphotosWifiCharacteristic, Characteristic);

DphotosWifiCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
    var self = this;
    // if(! dphotos.pair){
    //     // 如果没有在相册上按下确定，就不允许后续操作
    //     if (this._updateValueCallback) {
    //         console.log('DphotosWifiCharacteristic - pair=false');
    //         rt = {state: 'FAIL'};
    //         rt_json = JSON.stringify(rt);
    //         secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
    //         var rt_base64 = new Buffer(rt_json).toString('base64')
    //         this._updateValueCallback(new Buffer(secrect,'utf8'));
    //     }
    //     callback(this.RESULT_UNLIKELY_ERROR);
    // }
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
        if (tp == '1') {
            all_data = this._value;
            this._value = '';
            console.log(all_data);
            try {
                data_json = aes.decryption(all_data, dphotos.key, dphotos.iv);
            } catch (err) {
                if (this._updateValueCallback) {
                    rt = { state: 'FAIL', msg: err.message, errorno: 'D00401' };
                    rt_json = JSON.stringify(rt);
                    this._updateValueCallback(new Buffer(rt_json, 'utf8'));
                }
                callback(this.RESULT_UNLIKELY_ERROR);
            }
            // var data_json = new Buffer(this._value, 'base64').toString('utf8');
            pair_obj = JSON.parse(data_json)
            bssid = pair_obj.bssid;
            bssid = "50:bd:5f:38:c3:07";
            ssid = pair_obj.ssid;
            password = pair_obj.password;
            console.log(pair_obj);

            var wifi_set = {
                "type": "request",
                "system": "wifi",
                "action": "setting",
                "parameters": {
                    "ssid": ssid,
                    "pass": password
                },
                "key": "openwrt148"
            }
            var client = mqtt.connect(options);
            if (this._updateValueCallback) {
                var over = false;
                var client = mqtt.connect(options)
                client.on('connect', async () => {
                    // client.subscribe('msg') //订阅msg的数据
                    client.publish('msg', JSON.stringify(wifi_set))
                    sleep.sleep(10);
                    var sum_second = 30;
                    var count = 0;
                    console.log('DphotosWifiCharacteristic - onWriteRequest: notifying');
                    // 获得wifi的ip地址o
                    try {
                        for (let i = 0; i < sum_second; i++) {
                            console.log(i);
                            await new Promise(function (resolve, reject) {
                                wpa_cli.status('wlan0', function (err, status) {
                                    if (err) return reject(err);
                                    console.dir('count = ' + i);
                                    console.dir(status);
                                    if (status == undefined) {
                                        console.dir('1111');
                                        rt = { state: 'FAIL', msg: 'can not connect wifi', errorno: '1002' };
                                        rt_json = JSON.stringify(rt);
                                        secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
                                        console.log(rt_json);
                                        self._updateValueCallback(new Buffer(secrect, 'utf8'));
                                        over = true;
                                    }
                                    if (status.wpa_state == 'COMPLETED' && status.ip != undefined) {
                                        console.dir('222');
                                        rt = { state: 'SUCESS', ip: status.ip, deviceid: '51c3c8a0-7f440-11e8-b8a8-79d477b2ab68' };
                                        rt_json = JSON.stringify(rt);
                                        console.log(rt_json);
                                        secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
                                        self._updateValueCallback(new Buffer(secrect, 'utf8'));
                                        over = true;
                                        i = sum_second;
                                        resolve();
                                        return;
                                    }
                                    setTimeout(resolve, 1000);
                                });
                            });
                        }

                        // for (var i = sum_second; i >= 0; i--) {
                        //     ((i)=>{
                        //         wpa_cli.status('wlan0', function (err, status) {
                        //             console.dir(status);
                        //             if (status.wpa_state == 'COMPLETED' && status.ip != undefined) {
                        //                 rt = { state: 'SUCESS', ip: status.ip, deviceid: '51c3c8a0-7f440-11e8-b8a8-79d477b2ab68' };
                        //                 console.log(rt);
                        //                 rt_json = JSON.stringify(rt);
                        //                 secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
                        //                 self._updateValueCallback(new Buffer(secrect, 'utf8'));
                        //                 return 
                        //             }
                        //             sleep.sleep(1);
                        //         });
                        //     })(i);
                        // }
                        // await new Promise(function (resolve, reject) {
                        //     wpa_cli.status('wlan0', function (err, status) {
                        //         if (err) return reject(err);
                        //         if (status != undefined) {
                        //             execSync('dhclient -r wlan0');
                        //             sleep.sleep(1);
                        //             execSync('dhclient wlan0');
                        //         }
                        //         resolve();
                        //     });
                        // });
                        console.log('333');
                        if (over == false) {
                            rt = { state: 'FAIL', msg: 'can not connect wifi', errorno: '1002' };
                            rt_json = JSON.stringify(rt);
                            secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
                            this._updateValueCallback(new Buffer(secrect, 'utf8'));
                            console.log('444');
                        }

                        // for (var i = 0; i < sum_second; i++) {
                        //     wpa_cli.status('wlan0', function (err, status) {
                        //         console.dir(status);
                        //         if (status.wpa_state == 'COMPLETED' && status.ip != undefined) {
                        //             rt = { state: 'SUCESS', ip: status.ip, deviceid: '51c3c8a0-7f440-11e8-b8a8-79d477b2ab68' };
                        //             rt_json = JSON.stringify(rt);
                        //             secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
                        //             this._updateValueCallback(new Buffer(secrect, 'utf8'));
                        //         }
                        //         if (count >= sum_second) {
                        //             rt = { state: 'FAIL', msg: 'can not connect wifi', errorno: '1002' };
                        //             rt_json = JSON.stringify(rt);
                        //             secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
                        //             this._updateValueCallback(new Buffer(secrect, 'utf8'));
                        //         }
                        //         count++;
                        //         sleep.sleep(1);
                        //     }.bind(this));
                        // }
                        // wifi_ipv4 = os.networkInterfaces().wlan0[0].address;
                        // rt = {state: 'SUCESS', ip: wifi_ipv4};
                        // rt_json = JSON.stringify(rt);
                        // secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
                        // // var rt_base64 = new Buffer(rt_json).toString('base64')
                        // this._updateValueCallback(new Buffer(secrect,'utf8'));
                    } catch (e) {
                        console.log(e);
                        console.log('888888');
                        rt = { state: 'FAIL', msg: 'wifi can not connect', errorno: '1002' };
                        rt_json = JSON.stringify(rt);
                        secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
                        console.log(secrect);
                        this._updateValueCallback(new Buffer(secrect, 'utf8'));
                    }
                    client.end()
                });
            }
        }
        if (!withoutResponse) {
            callback(this.RESULT_SUCCESS);
        }
    } else {
        callback(this.RESULT_UNLIKELY_ERROR);
    }
};

// 订阅
DphotosWifiCharacteristic.prototype.onSubscribe = function (maxValueSize, updateValueCallback) {
    console.log('DphotosWifiCharacteristic - onSubscribe');
    this._updateValueCallback = updateValueCallback;
    // socket.on('node-sub', function (data) {//等待界面的确认
    //     console.log('node-sub');
    //     var action = data.action;
    //     var state = data.state;
    //     if(action == 'wifi' && state == 'sucess'){
    //         console.log(data);
    //         // 配对成功设置一个标识，以后只要这个为true，就可以返回数据
    //         dphotos.pair = true;
    //         console.log('DphotosPairCharacteristic - onWriteRequest: notifying');
    //         rt = {state: 'SUCESS', key: dphotos.key, iv: dphotos.iv};
    //         rt_json = JSON.stringify(rt);
    //         var rt_base64 = new Buffer(rt_json).toString('base64');
    //         // data_json = aes.encryption(all_data, dphotos.key, dphotos.iv);
    //         updateValueCallback(new Buffer(rt_base64,'utf8'));
    //     }
    // });

};

// 通知
// DphotosPairCharacteristic.prototype.onNotify = function(offset, callback) {
//     //callback(this.RESULT_SUCCESS, Buffer.from('{"state":"SUCESS","IP":"192.168.1.100"}', 'utf8'));
//     callback(this.RESULT_SUCCESS, Buffer.from('{"state":"FAIL","msg":"error password","errorno":"2001"}', 'utf8'));
// };

module.exports = DphotosWifiCharacteristic;

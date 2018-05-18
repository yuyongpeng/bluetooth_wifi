var util = require('util');
var os = require('os');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

var bleno = require('bleno');
var aes = require('./utils');
var sleep = require('sleep');
var dphotos = require('./dphotos');
var http = require('http');
var socket = require('socket.io-client')('http://localhost:8081');

var co = require('co');

var Descriptor = bleno.Descriptor;
var Characteristic = bleno.Characteristic;

var DphotosWifiCharacteristic = function() {
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
        value: new Buffer([0x04, 0x01, 0x27, 0xAD, 0x01, 0x00, 0x00 ]) // maybe 12 0xC unsigned 8 bit
      })
    ]
  });
    this._value = '';
    this._updateValueCallback = null;
};

util.inherits(DphotosWifiCharacteristic, Characteristic);

DphotosWifiCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback){
    if(! dphotos.pair){
        // 如果没有在相册上按下确定，就不允许后续操作
        if (this._updateValueCallback) {
            console.log('DphotosWifiCharacteristic - pair=false');
            rt = {state: 'FAIL'};
            rt_json = JSON.stringify(rt);
            secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
            var rt_base64 = new Buffer(rt_json).toString('base64')
            this._updateValueCallback(new Buffer(secrect,'utf8'));
        }
        callback(this.RESULT_UNLIKELY_ERROR);
    }
    if (offset) {
        callback(this.RESULT_ATTR_NOT_LONG);
    }
    else if (data.length > 0) {
        data_str = data.toString('utf8');
        var tp = data_str.substr(0, 1);
        var ds = data_str.substr(1);
        console.log(tp);
        console.log(ds);
        this._value += ds;
        if (tp == '1') {
            all_data = this._value;
            this._value = '';
            console.log(all_data);
            try{
                data_json = aes.decryption(all_data, dphotos.key, dphotos.iv);
            }catch(err){
                if (this._updateValueCallback) {
                    rt = {state: 'FAIL', msg: err.message, errorno: 'D00401'};
                    rt_json = JSON.stringify(rt);
                    this._updateValueCallback(new Buffer(rt_json,'utf8'));
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
            network_id = 0;
            command_scan = "wpa_cli scan_result | grep "+ssid;
            scan_result = execSync(command_scan).toString('utf8').replace(/[\r\n]/g,"");
            var result_arr = scan_result.toString().split("nakedhub");
            console.log(result_arr);
            var encryption = ""; //默认是不需要密码的
            for(var idx in result_arr){
                var value = result_arr[idx];
                if(value.length>0){
                    var element = value.split("\t");
                    console.log(element[3]);
                    if(element[3] == '[ESS]'){
                        console.log('ESS....');
                    }
                    // wep ，加密
                    if(element[3] == '[WEP][ESS]'){
                        encryption = 'wep'
                    }
                    var wpa2=/WPA2-PSK/, wpa=/WPA-PSK/;
                    if(wpa2.test(element[3]) || wpa.test(element[3])){
                        encryption = 'wpa'
                    }
                }
            }
            var arr = scan_result.toString().split(ssid);
            console.log(arr);

            command_0 = "wpa_cli -iwlan0 add_network ";
            network_id = execSync(command_0).toString('utf8').replace(/[\r\n]/g,"");
            command_1 = "wpa_cli -iwlan0 set_network " + network_id + " ssid '\"" + ssid + "\"'";
            wap_value = execSync(command_1).toString('utf8');
            console.log(command_1+"  ==  "+wap_value);
            switch(encryption){
                case "":
                    command_2 = "wpa_cli -iwlan0 set_network " + network_id + " key_mgmt NONE ";
                    wap_value = execSync(command_2).toString('utf8');
                    console.log(command_2+"  ==  "+wap_value);
                    break;
                case "wpa":
                    command_3 = "wpa_cli -iwlan0 set_network " + network_id + " psk '\"" + password + "\"'";
                    wap_value = execSync(command_3).toString('utf8');
                    console.log(command_3+"  ==  "+wap_value);
                    break;
                case "wep":
                    command_2 = "wpa_cli -iwlan0 set_network " + network_id + " key_mgmt NONE ";
                    wap_value = execSync(command_2).toString('utf8');
                    console.log(command_2+"  ==  "+wap_value);
                    command_3 = "wpa_cli -iwlan0 set_network " + network_id + " wep_key0 '\"" + password + "\"'";
                    wap_value = execSync(command_3).toString('utf8');
                    console.log(command_3+"  ==  "+wap_value);
                    break;
            }
            command_4 = "wpa_cli -iwlan0 enable_network " + network_id;
            wap_value = execSync(command_4).toString('utf8');
            console.log(command_4+"  ==  "+wap_value);
            command_5 = "wpa_cli -iwlan0 select_network " + network_id;
            wap_value = execSync(command_5).toString('utf8');
            console.log(command_5+"  ==  "+wap_value);
            command_6 = "wpa_cli -iwlan0 save ";
            wap_value = execSync(command_6).toString('utf8');
            console.log(command_6+"  ==  "+wap_value);
            command_7 = "wpa_cli -iwlan0 reconfigure ";
            wap_value = execSync(command_7).toString('utf8');
            console.log(command_7+"  ==  "+wap_value);
            var statusCode = 400;

            var options = {
                uri: 'http://www.baidu.com',
                headers: {
                    'User-Agent': 'safari'
                },
                resolveWithFullResponse: true
            };
            rp(options).then(function(repos){

                console.log(repos.statusCode);

                if(statusCode == 200){
                    // 将接收到的信息发送给qt，进行显示
                    wifi_obj = {action:'wifi', state: 'SUCESS'};
                    socket.emit('node-to-qt', wifi_obj);
                    // 如果注册了回调，就调用
                    if (this._updateValueCallback) {
                        console.log('DphotosWifiCharacteristic - onWriteRequest: notifying');
                        // 获得wifi的ip地址
                        wifi_ipv4 = os.networkInterfaces().wlan0[0].address;
                        console.log(wifi_ipv4);
                        rt = {state: 'SUCESS', ip: wifi_ipv4};
                        // rt = {state: 'SUCESS', msg:'wifi can not connect', errorno:'1002'};
                        rt_json = JSON.stringify(rt);
                        secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
                        // var rt_base64 = new Buffer(rt_json).toString('base64')
                        this._updateValueCallback(new Buffer(secrect,'utf8'));
                    }
                }else{
                    // 将接收到的信息发送给qt，进行显示
                    wifi_obj = {action:'wifi', state: 'FAIL'};
                    socket.emit('node-to-qt', wifi_obj);
                    // 如果注册了回调，就调用
                    if (this._updateValueCallback) {
                        console.log('DphotosWifiCharacteristic - onWriteRequest: notifying');
                        rt = {state: 'FAIL', msg:'wifi can not connect to www', errorno:'1002'};
                        rt_json = JSON.stringify(rt);
                        secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
                        // var rt_base64 = new Buffer(rt_json).toString('base64')
                        this._updateValueCallback(new Buffer(secrect,'utf8'));
                    }
                }
            }).catch(function(err){
                console.log(err);
            });

            //
            // var get_url = function () {
            //     return new Promise(function (resolve, reject) {
            //         http.get('http://www.baidu.com/', (res) => {
            //             console.log('******'+res.statusCode);
            //             statusCode=res.statusCode;
            //         });
            //     });
            // }
            // var gen = function*() { // <== generator
            //     var f1 = yield get_url();
            //
            // };
            // sleep.sleep(10);
            // // co(gen); //自动运行gen方法,会顺序执行函数的内容，因为返回的是Promise，所以是同步的。
            // co(gen).then(function () {
            //
            // }).catch(function (err){ // 在readFile中抛出的错误可以在这里捕获到。
            //     console.log(err);
            // });

            // 如果注册了回调，就调用
            // if (this._updateValueCallback) {
            //     console.log('DphotosWifiCharacteristic - onWriteRequest: notifying');
            //     // 获得wifi的ip地址
            //     wifi_ipv4 = os.networkInterfaces().wlan0[0].address;
            //     console.log(wifi_ipv4);
            //     rt = {state: 'SUCESS', ip: wifi_ipv4};
            //     // rt = {state: 'SUCESS', msg:'wifi can not connect', errorno:'1002'};
            //     rt_json = JSON.stringify(rt);
            //     secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
            //     var rt_base64 = new Buffer(rt_json).toString('base64')
            //     this._updateValueCallback(new Buffer(secrect,'utf8'));
            // }
        }
        if (!withoutResponse) {
            callback(this.RESULT_SUCCESS);
        }
            // {"ssid":"hard-chain","password":"hard-chain2017"}
            // qaJDlAyIzXV25TbLCQySl0e8VLoFHAzcpB2saZLShecf3QpT7jnY8t40yQhVbdhEX9ECKIqHC80O7RGMlw6ndg==
            // 0qaJDlAyIzXV25TbLCQy
            // 0Sl0e8VLoFHAzcpB2saZ
            // 0LShecf3QpT7jnY8t40y
            // 0QhVbdhEX9ECKIqHC80O
            // 07RGMlw6ndg==
            // 0qaJDlAyIzXV25TbLCQy0Sl0e8VLoFHAzcpB2saZ0LShecf3QpT7jnY8t40y0QhVbdhEX9ECKIqHC80O17RGMlw6ndg==

            // network = commands.getstatusoutput("wpa_cli -iwlan0 add_network")
            // id = network[1]
            // commands.getstatusoutput("wpa_cli -iwlan0 set_network %s ssid '\"%s\"'" % (id, js['ssid']))
            // commands.getstatusoutput("wpa_cli -iwlan0 set_network %s ssid '\"%s\"'" % (id, js['ssid']))
            // commands.getstatusoutput("wpa_cli -iwlan0 set_network %s key_mgmt WPA-PSK" % id)
            // commands.getstatusoutput("wpa_cli -iwlan0 set_network %s psk '\"%s\"'" % (id, js['password']))
            // commands.getstatusoutput("wpa_cli -iwlan0 enable_network %s" % id)
            // commands.getstatusoutput("wpa_cli -iwlan0 save")
    }else{
        callback(this.RESULT_UNLIKELY_ERROR);
    }
};

// 订阅
DphotosWifiCharacteristic.prototype.onSubscribe = function(maxValueSize, updateValueCallback) {
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

var util = require('util');
var os = require('os');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;

var bleno = require('bleno');
var aes = require('./utils');
var dphotos = require('./dphotos');

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
            data_json = aes.decryption(all_data, dphotos.key, dphotos.iv);
            // var data_json = new Buffer(this._value, 'base64').toString('utf8');
            console.log(all_data);
            pair_obj = JSON.parse(data_json)
            ssid = pair_obj.ssid;
            password = pair_obj.password;
            console.log(pair_obj);
            network_id = 0;
            command_0 = "wpa_cli -iwlan0 add_network ";
            network_id = execSync(command_0).toString('utf8').replace(/[\r\n]/g,"");
            command_1 = "wpa_cli -iwlan0 set_network " + network_id + " ssid '\"" + ssid + "\"'";
            wap_value = execSync(command_1).toString('utf8');
            console.log(command_1+"  ==  "+wap_value);
            command_2 = "wpa_cli -iwlan0 set_network " + network_id + " key_mgmt WPA-PSK ";
            wap_value = execSync(command_2).toString('utf8');
            console.log(command_2+"  ==  "+wap_value);
            command_3 = "wpa_cli -iwlan0 set_network " + network_id + " psk '\"" + password + "\"'";
            wap_value = execSync(command_3).toString('utf8');
            console.log(command_3+"  ==  "+wap_value);
            command_4 = "wpa_cli -iwlan0 enable_network " + network_id;
            wap_value = execSync(command_4).toString('utf8');
            console.log(command_4+"  ==  "+wap_value);
            command_5 = "wpa_cli -iwlan0 save ";
            wap_value = execSync(command_5).toString('utf8');
            console.log(command_5+"  ==  "+wap_value);
            // execSync("wpa_cli -iwlan0 save ", function (error, stdout, stderr) {
            //     var data = stdout.toString();
            //     console.log(data);
            // });
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
                var rt_base64 = new Buffer(rt_json).toString('base64')
                this._updateValueCallback(new Buffer(secrect,'utf8'));
            }
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
};

// 通知
// DphotosPairCharacteristic.prototype.onNotify = function(offset, callback) {
//     //callback(this.RESULT_SUCCESS, Buffer.from('{"state":"SUCESS","IP":"192.168.1.100"}', 'utf8'));
//     callback(this.RESULT_SUCCESS, Buffer.from('{"state":"FAIL","msg":"error password","errorno":"2001"}', 'utf8'));
// };

module.exports = DphotosWifiCharacteristic;

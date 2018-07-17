var wpa_cli = require('wireless-tools/wpa_cli');
var sleep = require('sleep');
var sum_second = 30;
var count = 0;
for (var i = sum_second; i >= 0; i--) {
    console.log('xxxx ' + i);
    (function (i) {
        wpa_cli.status('wlan0', function (err, status) {
            console.dir('count = ' + i);
            if (status.wpa_state == 'COMPLETED' && status.ip != undefined) {
                rt = { state: 'SUCESS', ip: status.ip, deviceid: '51c3c8a0-7f440-11e8-b8a8-79d477b2ab68' };
                rt_json = JSON.stringify(rt);
                // secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
            }
            if (count >= sum_second) {
                rt = { state: 'FAIL', msg: 'can not connect wifi', errorno: '1002' };
                rt_json = JSON.stringify(rt);
                // secrect = aes.encryption(rt_json, dphotos.key, dphotos.iv);
            }
            if(i == 5){
                console.log('ddddd');
                
                return "wwww";
            }
            sleep.sleep(1);
        });
    })(i);
}

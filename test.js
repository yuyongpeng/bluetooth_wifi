/**
 * Created by yuyongpeng on 2018/5/14.
 */

var u = require('./utils');

console.log(u.key())
console.log(u.iv())



var test = '{"username":"yuyongpeng", "mobile":"12345"}';
var b = new Buffer(test);
var s = b.toString('base64');
console.log(s);

rt = {state: 'SUCESS', key: '1111', iv: '222222'};
rt_json = JSON.stringify(rt);
console.log(rt_json);
var b = new Buffer(rt_json).toString('base64')
var s = b.toString('uf8');
console.log(b)


var os = require('os');
var IPv4,hostName;
hostName=os.hostname();
for(var i=0;i<os.networkInterfaces().en0.length;i++){
    if(os.networkInterfaces().en0[i].family=='IPv4'){
        IPv4=os.networkInterfaces().en0[i].address;
    }
}
console.log('----------local IP: '+IPv4);
console.log('----------local host: '+hostName);


var http = require('http');
var options =
    {
        hostname : 'www.baidu.com',
        port : 80,
        method : 'POST',
        path : '/',
        handers:{}
    };
// var req = http.request(options,function(res){
// });
http.get('http://www.baidu.com/', (res) => {
    console.log(typeof (res.statusCode));
    console.log('STATUS:' + res.statusCode);
});
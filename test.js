/**
 * Created by yuyongpeng on 2018/5/14.
 */
var request = require('request');
request('http://www.baidu.com', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // 打印google首页
  }
})
exit(0);
const asyncReadFile = async function () { //声明async方法
    const f1 = await readFile('/etc/fstab'); //等待执行完毕
    const f2 = await readFile('/etc/shells'); //等待执行完毕
    console.log(f1.toString());
    console.log(f2.toString());
};
asyncReadFile();


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
var co = require('co');
var gen = function*() { // <== generator
    var f1 = yield http.get('http://www.baidu.com/', (res) => {
    });

    console.log('---'+f1.toString());
};
co(gen); //自动运行gen方法,会顺序执行函数的内容，因为返回的是Promise，所以是同步的。


var rp = require("request-promise");
var sleep = require('sleep');

var options = {
    uri: 'http://www.baidu.com',
    headers: {
        'User-Agent': 'safari'
    },
    resolveWithFullResponse: true
};
rp(options).then(function(repos){
    sleep.sleep(5);
    console.log(repos.statusCode);
}).catch(function(err){
    console.log(err);
});


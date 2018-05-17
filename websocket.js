/**
 * Created by yuyongpeng on 2018/5/17.
 */
var http = require('http'), io = require('socket.io');
var app = http.createServer(), io = io.listen(app);
app.listen(8081, '127.0.0.1');

var DphotoPairCharacteristic = require('./dphotos-pair-characteristic');
var dphotos = require('./dphotos');

// var io = require('socket.io')(80);

// 用于存储所有socket以广播数据
var iolist = [];

io.sockets.on('connection', function (socket) {
    // console.log(socket);

    // 将连入socket加入列表
    iolist.push(socket);
    // 记录index，在disconnect（断开连接）发生时将对应的socket删除
    var socke_idx = iolist.indexOf(socket);
    // 定义on disconnect事件行为
    socket.on('disconnect', function () {
        // 将断开连接的socket从广播列表里删除
        iolist.splice(socke_idx, 1);
        console.log('io list: ' + iolist.length);
    });

    // 当前蓝牙状态的传递，主要是nodejs给QT传递状态
    socket.on('node-to-qt', function (data) {
        console.log('receive: ' + JSON.stringify(data));
        // socket.emit('bluetoothwifistate_sub', data);
        socket.broadcast.emit('qt-sub', data);

        // for (i in iolist) {
        //     console.log(i);
        //     console.log(iolist[i].id);
        //     iolist[i].emit('bluetoothwifistate2', data);
        // }
    });

    // QT界面给nodejs传递配置成功的状态（qt界面按下了"确定"按钮）
    socket.on('qt-to-node', function (data) {
        // 将消息发送给订阅者
        console.log('receive: ' + data);
        var x = {action:'bluetooth', state:'sucess'};
        var action = data.action;
        var state = data.state;
        if(action == 'pairConfir' && state == 'sucess'){
            // 在界面上按下了配对确定按钮
            rt = {state: 'SUCESS', key: dphotos.key, iv: dphotos.iv};
            rt_json = JSON.stringify(rt);
            var rt_base64 = new Buffer(rt_json).toString('base64');
            // data_json = aes.encryption(all_data, dphotos.key, dphotos.iv);
            // this._updateValueCallback(new Buffer(rt_base64,'utf8'));
            DphotoPairCharacteristic._updateValueCallback(new Buffer(rt_base64,'utf8'));
        }

        socket.broadcast.emit('node_sub', data);
    });   // 定义socket on connection（连入）事件行为
});
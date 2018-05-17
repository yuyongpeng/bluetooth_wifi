/**
 * Created by yuyongpeng on 2018/5/17.
 */
var socket = require('socket.io-client')('http://localhost:8081');
// socket.on('connect', function(){});
// socket.on('event', function(data){});
// socket.on('disconnect', function(){});

// socket.on('news', function (data) {//接收到服务器发送过来的名为'new'的数据
//     console.log(data.hello);//data为应服务器发送过来的数据。
//     socket.emit('my new event', { my:'new data' });//向服务器发送数据，实现双向数据传输
// });

socket.emit('node-to-qt', {action:'bluetooth', state:'sucess'});
socket.on('node_sub', function (data) {//接收另一个名为'other'数据，
    console.log(data);
});
// socket.on('bluetoothwifistate', function (data) {//接收另一个名为'other'数据，
//     console.log(data);
// });
// socket.close();

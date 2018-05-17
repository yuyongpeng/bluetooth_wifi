/**
 * Created by yuyongpeng on 2018/5/17.
 */

var socket = require('socket.io-client')('http://localhost:8081');

// socket.emit('bluepair', {state:'sucess'});
socket.on('qt-sub', function (data) {//接收另一个名为'other'数据，
    console.log(data);
});
socket.emit('qt-to-node', {action:'pairConfir', state:'sucess'});
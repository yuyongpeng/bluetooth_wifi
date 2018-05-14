/**
 * Created by yuyongpeng on 2018/5/12.
 */
var util = require('util');
var events = require('events');

function Dphotos() {
    events.EventEmitter.call(this);
    this.key = 'ExchangePasswordPasswordExchange';
    this.iv = 'f21dab5f0aca29c6';
    this.pubkey = '';
    this.prikey = '';

}

util.inherits(Dphotos, events.EventEmitter);

// 设置 公钥和私钥
Dphotos.prototype.setprikey = function(key) {
    this.prikey = key;
    console.log('set pri key = ' + this.prikey);
};
Dphotos.prototype.setpubkey = function(key) {
    this.pubkey = key;
    console.log('set pub key = ' + this.pubkey);
};

// 获得 公钥和私钥
Dphotos.prototype.getprikey = function(key) {
    return this.prikey;
};
Dphotos.prototype.getpubkey = function(key) {
    return this.pubkey;
};

module.exports.Dphotos = Dphotos;
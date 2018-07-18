/**
 * Created by yuyongpeng on 2018/5/12.
 */
var util = require('util');
var events = require('events');
var aesutil = require('./utils');
var fs = require('fs');
var config = require('./config');

function Dphotos() {
    events.EventEmitter.call(this);
    this.key = 'ExchangePasswordPasswordExchange';
    this.iv = 'f21dab5f0aca29c6';
    this.pubkey = '';
    this.prikey = '';
    this.pair = false; // 初始，配对不成功。
}

util.inherits(Dphotos, events.EventEmitter);

// 设置 公钥和私钥
Dphotos.setprikey = function(key) {
    this.prikey = key;
    console.log('set pri key = ' + this.prikey);
};
Dphotos.setpubkey = function(key) {
    this.pubkey = key;
    console.log('set pub key = ' + this.pubkey);
};

/**
 * 设置key和iv并返回新生成的key和iv
 * @param {*} key 
 * @param {*} iv 
 */
Dphotos.setKeyIv = function(){
    var key = aesutil.key;
    var iv = aesutil.iv;
    var obj = {"key":key, "iv":iv}; 
    console.log(obj);
    fs.writeFileSync(config.root + '/' + config.cache_file, JSON.stringify(obj));
    return {"key":key, "iv":iv};
}

// 获得 公钥和私钥
Dphotos.getprikey = function(key) {
    return this.prikey;
};
Dphotos.getpubkey = function(key) {
    return this.pubkey;
};
/**
 * 获得当前的key和id
 */
Dphotos.getKeyIv = function(){
   var content = fs.readFileSync(config.root + '/' + config.cache_file);
   return JSON.parse(content);
}

module.exports = Dphotos;
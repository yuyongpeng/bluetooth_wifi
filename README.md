#bluetooth_wifi

## 安装树莓派需要的蓝牙和wifi基础库

$ sudo apt-get install bluez wpasupplicant

## node wpa_supplicant 需要 libdbus支持

sudo apt-get install libdbus-1-dev


## bluetooth-hci-socket

sudo apt-get install libudev-dev build-essential

## 树莓派上部署流程

$ wget https://nodejs.org/dist/v4.8.7/node-v4.8.7-linux-armv7l.tar.gz
$ tar zxvf node-v4.8.7-linux-armv7l.tar.gz
$ mv node-v4.8.7-linux-armv7l /usr/local/node
$ vim /etc/profile
export PATH=/usr/local/node/bin:$PATH
$ . /etc/profile
$ git clone http://github.com/yuyongpeng/bluetooth_wifi
$ cd bluetooth_wifi
$ npm install




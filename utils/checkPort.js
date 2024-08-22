const dgram = require('dgram');
const net = require('net');
function isPortInUdpUse(port, callback) {
    const server = dgram.createSocket('udp4');

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            callback(null, true); // 端口已被使用
        } else {
            callback(err, false); // 其他错误
        }
        server.close();
    });

    server.on('listening', () => {
        callback(null, false);
        server.close(); // 如果能成功监听，则立即关闭
    });

    server.bind(port);
}
function isPortInUse(port, callback) {
    const server = net.createServer(() => { });
    server.listen(port, () => {
        server.close();
        callback(null, false);
    });
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            callback(null, true);
        } else {
            callback(err, false);
        }
    });
}
module.exports.isPortInUse = isPortInUse;
module.exports.isPortInUdpUse = isPortInUdpUse;

//   isPortInUse(8080, (err, inUse) => {
//     if (err) {
//       console.error('检查端口时发生错误:', err);
//       return;
//     }
//     console.log(`端口8080${inUse ? '已被使用' : '未被使用'}`);
//   });
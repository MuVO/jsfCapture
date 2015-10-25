var db = require('./database.js');
db.createTable();

var nFlow = require('./netflow.js');
var udp = require('dgram').createSocket('udp4');

udp.bind(9996);
udp.on('listening',function(){
	console.info('Listening on UDP port %s',
	    udp.address().port);
    })
    .on('close',function(){
	conslole.warn('Socket closed');
    })
    .on('message',function(msg,rinfo){
	console.log('Received %d bytes from %s',msg.length,rinfo.address);
	db.save(nFlow.parse(msg),rinfo.address);
    });

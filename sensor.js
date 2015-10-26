var db	= require('./database.js')('netflow.dat').init();
var udp	= require('dgram').createSocket('udp4');
var nFlow = require('./netflow.js');

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
	db.save(nFlow(msg),rinfo.address);
    });

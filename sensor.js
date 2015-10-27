// Database
var db	= require('./database.js')('netflow.dat').init();

// Network components
var udp	= require('dgram').createSocket('udp4');
var sock = require('socket.io')(3080);
var log = sock.of('/log');

// etc...
var nFlow = require('./netflow.js');
var util = require('util');

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
	log.emit('message',util.format('Received %d bytes from %s',msg.length,rinfo.address));

	db.save(nFlow(msg),rinfo.address);
    });

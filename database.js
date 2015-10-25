var createTable = new Object({
    packets: [
	'CREATE TABLE IF NOT EXISTS `packets` ('
	    + '`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,'
	    + '`ip` VARCHAR,'
	    + '`version` INTEGER,'
	    + '`count` INTEGER,'
	    + '`sys_uptime` INTEGER,'
	    + '`unix_secs` INTEGER,'
	    + '`unix_nsecs` INTEGER,'
	    + '`flow_sequence` INTEGER,'
	    + '`engine_type` INTEGER,'
	    + '`engine_id` INTEGER,'
	    + '`sampling_interval` INTEGER'
	+ ')',
	'CREATE INDEX IF NOT EXISTS `ip` ON `packets` (`ip`)',
    ],
    records: [
	'CREATE TABLE IF NOT EXISTS `records` ('
	    + '`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,'
	    + '`packet_id` INTEGER NOT NULL,'
	    + '`srcaddr` BIGINT,'
	    + '`dstaddr` BIGINT,'
	    + '`nexthop` BIGINT,'
	    + '`input` INTEGER,'
	    + '`output` INTEGER,'
	    + '`dPkts` INTEGER,'
	    + '`dOctets` INTEGER,'
	    + '`first` INTEGER,'
	    + '`last` INTEGER,'
	    + '`srcport` INTEGER,'
	    + '`dstport` INTEGER,'
	    + '`pad1` INTEGER,'
	    + '`tcp_flags` INTEGER,'
	    + '`prot` INTEGER,'
	    + '`tos` INTEGER,'
	    + '`src_as` INTEGER,'
	    + '`dst_as` INTEGER,'
	    + '`src_mask` INTEGER,'
	    + '`dst_mask` INTEGER,'
	    + '`pad2` INTEGER'
	+ ')',
	'CREATE INDEX IF NOT EXISTS `packet_id` ON `records` (`packet_id`)',
	'CREATE INDEX IF NOT EXISTS `srcaddr` ON `records` (`srcaddr`)',
	'CREATE INDEX IF NOT EXISTS `dstaddr` ON `records` (`dstaddr`)',
    ]
});

var dbName='netflow.dat';
var db = require('dblite')(require('path').join(__dirname,dbName));
db.query('PRAGMA busy_timeout=30000');

db.on('info',function(data){console.info(data);})
  .on('error',function(data){console.error(data.toString());})
  .on('close',function(data){console.error('DB closed');});

exports.createTable = function(){
    for(t in createTable)
	for(var i=0;i<createTable[t].length;i++)
	    db.query(createTable[t][i]);
};

exports.close = function(){return db.close();}

exports.save = function(packet,ip){
    packet.ip=ip?ip:null;
    db.query('INSERT INTO `packets` (ip,version,count,sys_uptime,unix_secs,unix_nsecs,flow_sequence,engine_type,engine_id,sampling_interval)'
	+' VALUES(:ip,:version,:count,:sys_uptime,:unix_secs,:unix_nsecs,:flow_sequence,:engine_type,:engine_id,:sampling_interval)',packet);

    db.lastRowID('packets',function(packet_id){
	for(var i=0;i<packet.count;i++){
	    packet.recs[i].packet_id=packet_id;
	    db.query('INSERT INTO `records` VALUES (null,'
		    + ':packet_id,'
		    + ':srcaddr,'
		    + ':dstaddr,'
		    + ':nexthop,'
		    + ':input,'
		    + ':output,'
		    + ':dPkts,'
		    + ':dOctets,'
		    + ':first,'
		    + ':last,'
		    + ':srcport,'
		    + ':dstport,'
		    + '0,'
		    + ':tcp_flags,'
		    + ':prot,'
		    + ':tos,'
		    + ':src_as,'
		    + ':dst_as,'
		    + ':src_mask,'
		    + ':dst_mask,'
		    + '0)',
		packet.recs[i]);
	}
    });
};

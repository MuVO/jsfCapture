module.exports = function(packet){
    return {
	version: packet.readUInt16BE(0),
	count: packet.readUInt16BE(2),
	sys_uptime: packet.readUInt32BE(4),
	unix_secs: packet.readUInt32BE(8),
	unix_nsecs: packet.readUInt32BE(12),
	flow_sequence: packet.readUInt32BE(16),
	engine_type: packet.readUInt8(20),
	engine_id: packet.readUInt8(21),
	sampling_interval: packet.readUInt16BE(22),
	recs: nfRecs(packet.slice(24),packet.readUInt16BE(2)),
    };
}

function nfRecs(data,count){
    var recs = new Array();
    for(i=0;i<count;i++){
	var pos = i * 48;
	recs.push({
	    srcaddr: data.readUInt32BE(pos + 0),
	    dstaddr: data.readUInt32BE(pos + 4),
	    nexthop: data.readUInt32BE(pos + 8),
	    input: data.readUInt16BE(pos + 12),
	    output: data.readUInt16BE(pos + 14),
	    dPkts: data.readUInt32BE(pos + 16),
	    dOctets: data.readUInt32BE(pos + 20),
	    first: data.readUInt32BE(pos + 24),
	    last: data.readUInt32BE(pos + 28),
	    srcport: data.readUInt16BE(pos + 32),
	    dstport: data.readUInt16BE(pos + 34),
	    pad1: data.readUInt8(36),
	    tcp_flags: data.readUInt8(37),
	    prot: data.readUInt8(38),
	    tos: data.readUInt8(39),
	    src_as: data.readUInt16BE(pos + 40),
	    dst_as: data.readUInt16BE(pos + 42),
	    src_mask: data.readUInt8(44),
	    dst_mask: data.readUInt8(45),
	    pad2: data.readUInt16BE(pos + 46),
	});
    }
    return recs;
}

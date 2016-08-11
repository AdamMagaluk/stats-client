var dgram = require('dgram');
var util = require('util');
var url = require('url');

var Client = module.exports = function(hoststring, dimensions, options) {
  if (!options) {
    options = {};
  }
  
  var split = hoststring.split(':');
  this.host = split[0];
  this.port = Number(split[1]);
  this.dimensions = dimensions || {};
  this.useTelegrafFormat = !!options.telegraf;
  this.prefix = options.prefix;
  this.debug = !!options.debug;

  // Create socket (ignore errors)
  this.socket = dgram.createSocket('udp4');
  this.socket.on('error', function() {});
};

Client.prototype.timing = function(bucket, value, dimensions) {
  this.send(bucket, value + '|ms', dimensions);
};

Client.prototype.count = function(bucket, value, dimensions) {
  this.send(bucket, value + '|c', dimensions);
};

Client.prototype.increment = function(bucket, dimensions) {
  this.count(bucket, 1, dimensions);
};

Client.prototype.decrement = function(bucket, dimensions) {
  this.count(bucket, -1, dimensions);
};

Client.prototype.gauge = function(bucket, value, dimensions) {
  this.send(bucket, value + '|g', dimensions);
};

Client.prototype.send = function(bucket, value, dimensions) {
  var self = this;
  
  if (this.prefix) {
    bucket = this.prefix + '.' + bucket;
  }

  dimensions = dimensions || {};
  for (var k in this.dimensions) {
    if (!dimensions.hasOwnProperty(k)) {
      dimensions[k] = this.dimensions[k];
    }
  }

  Object.keys(dimensions).forEach(function(k) {
    dimensions[k] = self._sanitize(dimensions[k]);
  });

  if (this.useTelegrafFormat) {
    var key = bucket;
    var tagKeys = Object.keys(dimensions);
    if (tagKeys.length > 0) {
      tagKeys.forEach(function(k) {
        key += ',' + k + '=' + dimensions[k];
      });
    }
  } else {
    var key = url.format({ pathname: bucket, query: dimensions });
  }


  if (this.debug) {
    console.log(key + ':' + value);
  }
  
  var buffer = new Buffer(key + ':' + value);
  
  // Send (ignore errors)
  this.socket.send(buffer, 0, buffer.length, this.port, this.host, function (err, bytes) {});
};

Client.prototype._sanitize = function(value) {
  return value.replace(/\:|\|/g, '_');
};

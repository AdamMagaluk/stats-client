var Client = require('./client');

var c = new Client('localhost:8125', { instance: 'i-123' }, { telegraf: true, prefix: 'link' });

setInterval(function() {
  var t = Math.round(Math.random() * 10);
  c.timing('some.timer', t, { tenant: 'test' }); // -> some.counter?tenant=test&instance=i123:1|c
}, 200);
setInterval(function() {
  var t = Math.round(Math.random() * 10);
  c.timing('some.timer', t,  { tenant: 'default' }); // -> some.counter?tenant=test&instance=i123:1|c
}, 500);


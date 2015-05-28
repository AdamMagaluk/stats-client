var Client = require('./client');

var c = new Client('localhost:8125', { instance: 'i123' });

c.increment('some.counter', { tenant: 'test' }); // -> some.counter?tenant=test&instance=i123:1|c

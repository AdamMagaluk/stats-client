# Node.js Statsd Client

Based on https://github.com/spreaker/nodejs-statsd-client but includes a way of interpreting dimensions that are not includes in the standard dot notation. 

Metrics with dimensions get sent with this format:

```
some.metric?dimension1=abc1&other=test:1|c
```

### How to install

``` bask
npm install stats-client
```

### How it works

``` js
var Client = require('stats-client')

// can supply dimensions that are send on all metrics
var client = new Client("localhost:8125", { instance: 'i-12312' }); 

// Count stat
client.count("num_logged_users", 1, { tenant: 'some-id' }); // dimension for individual metric
client.increment("num_logged_users", { tenant: 'some-id' });
client.decrement("num_logged_users", { tenant: 'some-id' });

// Timing stat
client.timing("request_ms", 250);

// Gauge stat
client.gauge("gauge_stats", 4);
```

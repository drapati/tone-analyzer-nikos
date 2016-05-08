#! /usr/bin/env node
'use strict';

if (process.env.GOOGLE_ANALYTICS){
  process.env.GOOGLE_ANALYTICS = process.env.GOOGLE_ANALYTICS.replace(/\"/g,'');
}
// Deployment tracking
require('cf-deployment-tracker-client').track();

var server = require('./app');
var port = process.env.PORT || process.env.VCAP_APP_PORT || 3000;
var host = process.env.HOST || process.env.VCAP_APP_HOST || '0.0.0.0';

server.listen(port, host, function () {
  console.log('Server running on port: %s:%d', host, port);
});

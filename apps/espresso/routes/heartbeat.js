var express = require('express');
var router  = express.Router();
var os      = require('os');
var util    = require('util');
var mdb     = require('../utils/mdb');

// GET basic heartbeat info
router.get('/', function(req, res, next) {
  doc = {};
  doc['state'] = 'alive';
  doc['epoch'] = (new Date().getTime()) / 1000;
  return res.send(doc);
});

// Return sufficient environment about environment variables for debugging, in a secure way.
router.get('/env', function(req, res, next) {
  var connStr = '' + mdb.getConnectionString();
  doc = {};
  doc['os.arch'] = os.arch()
  doc['os.cpu.count'] = os.cpus().length
  doc['os.type'] = os.type()
  doc['os.platform'] = os.platform()
  doc['os.release']  = os.release()
  doc['os.totalmem'] = os.totalmem()
  doc['os.uptime']   = os.uptime()
  doc['os.hostname'] = os.hostname()
  doc['os.homedir']  = os.homedir()
  doc['connStr.prefix'] = connStr.slice(0,22)
  doc['connStr.suffix'] = connStr.slice(-22)
  doc['connStr.length'] = connStr.length
  doc['db.name'] = mdb.getHackathonDbName()
  doc['coll.name'] = mdb.getHackathonCollName()
  doc['epoch'] = (new Date().getTime()) / 1000;
  return res.send(doc);
});
module.exports = router;

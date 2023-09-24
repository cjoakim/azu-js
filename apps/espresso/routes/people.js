var express = require('express');
var router  = express.Router();
var mdb     = require('../utils/mdb');

router.get('/:playerID/person', (req, res) => {
  mdb.getHackathonColl().find({playerID: req.params.playerID, doctype: 'person'}).toArray()
	  .then((people) => { res.send(people) });
});

router.get('/:playerID/batting', (req, res) => {
  mdb.getHackathonColl().find({playerID: req.params.playerID, doctype: 'batting'}).toArray()
	  .then((people) => { res.send(people) });
});

router.get('/:playerID/pitching', (req, res) => {
  mdb.getHackathonColl().find({playerID: req.params.playerID, doctype: 'pitching'}).toArray()
	  .then((people) => { res.send(people) });
});

router.get('/:playerID/alldocs', (req, res) => {
  mdb.getHackathonColl().find({playerID: req.params.playerID}).toArray()
	  .then((people) => { res.send(people) });
});

module.exports = router;

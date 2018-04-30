let express = require('express');
let router = express.Router();

let BITBOXCli = require('bitbox-cli/lib/bitboxcli').default;
let BITBOX = new BITBOXCli({
  protocol: 'http',
  host: "138.68.54.100",
  port: "8332",
  username: "bitcoin",
  password: "xhFjluMJMyOXcYvF"
});

router.get('/', function(req, res, next) {
  res.json({ status: 'control' });
});

router.get('/getInfo', function(req, res, next) {
  BITBOX.Control.getInfo()
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.get('/getMemoryInfo', function(req, res, next) {
  BITBOX.Control.getMemoryInfo()
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.get('/help', function(req, res, next) {
  BITBOX.Control.help()
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.post('/stop', function(req, res, next) {
  BITBOX.Control.stop()
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

module.exports = router;

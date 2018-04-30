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
  res.json({ status: 'mining' });
});

router.get('/getBlockTemplate', function(req, res, next) {
  res.json({ status: 'getBlockTemplate' });
});

router.get('/getMiningInfo', function(req, res, next) {
  BITBOX.Mining.getMiningInfo()
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.get('/getNetworkHashps', function(req, res, next) {
  res.json({ status: 'getNetworkHashps' });
});

router.get('/prioritiseTransaction', function(req, res, next) {
  res.json({ status: 'prioritiseTransaction' });
});

router.get('/submitBlock', function(req, res, next) {
  res.json({ status: 'submitBlock' });
});

module.exports = router;

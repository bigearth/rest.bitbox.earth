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

router.get('/getBlockTemplate/:templateRequest', function(req, res, next) {
  BITBOX.Mining.getBlockTemplate(req.params.templateRequest)
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.get('/getMiningInfo', function(req, res, next) {
  BITBOX.Mining.getMiningInfo()
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.get('/getNetworkHashps', function(req, res, next) {
  BITBOX.Mining.getNetworkHashps()
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

router.get('/submitBlock/:hex', function(req, res, next) {
  let parameters = '';
  if(req.query.parameters && req.query.parameters !== '') {
    parameters = true;
  }
  BITBOX.Mining.submitBlock(req.params.hex, parameters)
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

module.exports = router;

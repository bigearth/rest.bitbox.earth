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
  res.json({ status: 'address' });
});

router.get('/details/:address', function(req, res, next) {
  BITBOX.Address.details(req.params.address)
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/utxo/:address', function(req, res, next) {
  BITBOX.Address.utxo(req.params.address)
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

module.exports = router;

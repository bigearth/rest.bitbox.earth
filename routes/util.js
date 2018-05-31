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
  res.json({ status: 'util' });
});

router.get('/validateAddress/:address', function(req, res, next) {
  BITBOX.Util.validateAddress(req.params.address)
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

module.exports = router;

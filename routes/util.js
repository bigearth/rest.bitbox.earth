let express = require('express');
let router = express.Router();

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;
let BITBOX = new BITBOXCli();

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

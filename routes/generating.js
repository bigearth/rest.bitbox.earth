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
  res.json({ status: 'generating' });
});

nblocks (numeric, required): How many blocks are generated immediately.
address (string, required): The address to send the newly generated bitcoin to.
maxtries (numeric, optional): How many iterations to try (default = 1000000).
router.get('/generateToAddress/:nblocks/:address', function(req, res, next) {
  let maxtries = 1000000;
  if(req.query.maxtries) {
    maxtries = parseInt(req.query.maxtries);
  }
  BITBOX.Generating.generateToAddress(req.params.nblocks, req.params.address, maxtries)
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});


module.exports = router;

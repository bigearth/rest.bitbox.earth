let express = require('express');
let router = express.Router();

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;
let BITBOX = new BITBOXCli();

router.get('/', function(req, res, next) {
  res.json({ status: 'generating' });
});

router.post('/generateToAddress/:nblocks/:address', function(req, res, next) {
  let maxtries = 1000000;
  if(req.query.maxtries) {
    maxtries = parseInt(req.query.maxtries);
  }
  BITBOX.Generating.generateToAddress(req.params.nblocks, req.params.address, maxtries)
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});


module.exports = router;

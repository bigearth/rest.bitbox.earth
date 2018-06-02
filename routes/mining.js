let express = require('express');
let router = express.Router();

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;
let BITBOX = new BITBOXCli();

router.get('/', (req, res, next) => {
  res.json({ status: 'mining' });
});

router.get('/getBlockTemplate/:templateRequest', (req, res, next) => {
  BITBOX.Mining.getBlockTemplate(req.params.templateRequest)
  .then((result) => {
    res.send(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getMiningInfo', (req, res, next) => {
  BITBOX.Mining.getMiningInfo()
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

router.get('/getNetworkHashps', (req, res, next) => {
  BITBOX.Mining.getNetworkHashps()
  .then((result) => {
    res.json(JSON.stringify(result));
  }, (err) => { console.log(err);
  });
});

router.post('/submitBlock/:hex', (req, res, next) => {
  let parameters = '';
  if(req.query.parameters && req.query.parameters !== '') {
    parameters = true;
  }
  BITBOX.Mining.submitBlock(req.params.hex, parameters)
  .then((result) => {
    res.json(result);
  }, (err) => { console.log(err);
  });
});

module.exports = router;

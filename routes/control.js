let express = require('express');
let router = express.Router();

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

router.get('/stop', function(req, res, next) {
  BITBOX.Control.stop()
  .then((result) => {
    res.json({ result: result });
  }, (err) => { console.log(err);
  });
});

module.exports = router;

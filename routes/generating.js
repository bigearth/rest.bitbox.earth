let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.json({ status: 'generating' });
});

router.get('/generateToAddress', function(req, res, next) {
  res.json({ status: 'generateToAddress' });
});


module.exports = router;

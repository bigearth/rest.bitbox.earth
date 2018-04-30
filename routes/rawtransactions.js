let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({ status: 'rawtransaction' });
});

module.exports = router;

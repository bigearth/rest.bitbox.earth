let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
  res.json({ status: 'util' });
});

router.get('/estimateSmartFee', function(req, res, next) {
  res.json({ status: 'estimateSmartFee' });
});

router.get('/estimateSmartPriority', function(req, res, next) {
  res.json({ status: 'estimateSmartPriority' });
});

router.get('/createMultisig', function(req, res, next) {
  res.json({ status: 'createMultisig' });
});

router.get('/estimateFee', function(req, res, next) {
  res.json({ status: 'estimateFee' });
});

router.get('/estimatePriority', function(req, res, next) {
  res.json({ status: 'estimatePriority' });
});

router.get('/signMessageWithPrivKey', function(req, res, next) {
  res.json({ status: 'signMessageWithPrivKey' });
});

router.get('/validateAddress', function(req, res, next) {
  res.json({ status: 'validateAddress' });
});

router.get('/verifyMessage', function(req, res, next) {
  res.json({ status: 'verifyMessage' });
});

module.exports = router;

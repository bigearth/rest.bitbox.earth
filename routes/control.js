let express = require('express');
let router = express.Router();
let axios = require('axios');

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;
let BITBOX = new BITBOXCli();

let BitboxHTTP = axios.create({
  baseURL: process.env.RPC_BASEURL
});
let username = process.env.RPC_USERNAME;
let password = process.env.RPC_PASSWORD;

router.get('/', (req, res, next) => {
  res.json({ status: 'control' });
});

router.get('/getInfo', (req, res, next) => {
  BitboxHTTP({
    method: 'post',
    auth: {
      username: username,
      password: password
    },
    data: {
      jsonrpc: "1.0",
      id:"getinfo",
      method: "getinfo"
    }
  })
  .then((response) => {
    res.json(response.data.result);
  })
  .catch((error) => {
    res.send(error.response.data.error.message);
  });
});

// router.get('/getMemoryInfo', (req, res, next) => {
//   BitboxHTTP({
//     method: 'post',
//     auth: {
//       username: username,
//       password: password
//     },
//     data: {
//       jsonrpc: "1.0",
//       id:"getmemoryinfo",
//       method: "getmemoryinfo"
//     }
//   })
//   .then((response) => {
//     res.json(response.data.result);
//   })
//   .catch((error) => {
//     res.send(error.response.data.error.message);
//   });
// });
//
// router.get('/help', (req, res, next) => {
//   BITBOX.Control.help()
//   .then((result) => {
//     res.json(result);
//   }, (err) => { console.log(err);
//   });
// });
//
// router.post('/stop', (req, res, next) => {
//   BITBOX.Control.stop()
//   .then((result) => {
//     res.json(result);
//   }, (err) => { console.log(err);
//   });
// });

module.exports = router;

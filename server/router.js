var express = require('express');
var router = express.Router();
var reqHandlers = require('./request_handlers');



router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();
});


router.get('/', function (req, res) {
  res.send('Hello World!');
});

router.post('/users', reqHandlers.postUser);
router.get('/users', reqHandlers.getAllUsers);

router.post('/pots', reqHandlers.postUser);
router.get('/pots', reqHandlers.getAllUsers);

router.get('/auth', function (req, res) {
  res.redirect('https://sandbox-api.venmo.com/v1/oauth/authorize?client_id=2887&scope=access_profile');
});

module.exports = router;
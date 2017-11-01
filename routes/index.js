var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('shop/index', { 
    title: 'Express',
    message: 'Hello World!!!!'
   });
});

module.exports = router;

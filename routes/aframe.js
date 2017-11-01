var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/aa', (req, res, next) => {
  res.render('shop/aframe', { 
    title: 'A-Frame',
    message: 'Hello World!!!!'
   });
});

module.exports = router;
var express = require('express');
var router = express.Router();
const csrf = require('csurf');
const passport = require('passport');

const Product = require('../models/product');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', (req, res, next) => {
  //get all collections from products
  Product.find((err,docs) => {
    var productChunks = [];
    var chunkSize = 3;
    for(var i=0; i < docs.length; i += chunkSize){
      productChunks.push(docs.slice(i, i + chunkSize));
    }
    res.render('shop/index', { 
      title: 'Shopping Cart',
      products: productChunks
     });
  });
  
});

/* GET signup page. */
router.get('/user/signup', (req,res,next) => {
  var messages = req.flash('error');
  res.render('user/signup', {csrfToKen: req.csrfToken(), 
    messages: messages, 
    hasErrors: messages.length > 0,
    title: 'Sign Up'
  });
});

router.post('/user/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}));

router.get('/user/profile', (req,res,next) => {
  res.render('user/profile',{
    title: 'Profile'
  });
});


module.exports = router;

var express = require('express');
var router = express.Router();
const csrf = require('csurf');
const passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);



router.get('/profile', isLoggedIn , (req,res,next) => {
    res.render('user/profile',{
      title: 'Profile'
    });
  });

router.get('/logout', isLoggedIn, (req,res,next)=>{
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, (req,res,next) =>{
    next();
});

/* GET signup page. */
router.get('/signup', (req,res,next) => {
    var messages = req.flash('error');
    res.render('user/signup', {
      csrfToken: req.csrfToken(),
      messages: messages,
      hasErrors: messages.length > 0,
      title: 'Sign Up'
    });
  });
  
  router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
  }));
  
  router.get('/signin', (req,res,next) => {
      var messages = req.flash('error');
      res.render('user/signin', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0,
        title: 'Sign in'
        });
  });
  
  router.post('/signin', passport.authenticate('local.signin', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
  }));

  

  module.exports = router;

  //lets user see certain pages when loggin
  function isLoggedIn(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      res.redirect('/');
  };

  function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};
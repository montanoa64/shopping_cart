const passport = require('passport');
const User = require('../models/users');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err,user)=>{
        done(err,user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    //check that the email is not empty and that it is an actual email
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    //check that the password is a least 4 letters
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min:4});
    //get all the errors into a variable
    var errors =  req.validationErrors();
    if(errors){  //if we have errors
        var messages = [];
        errors.forEach((error)=>{ 
            //store the errors into the messages array
            messages.push(error.msg);
        });
        //return the errors in a nice message box
        return done(null, false, req.flash('error', messages))
    }
    //see if the email is already in the databse
    User.findOne({'email': email}, function(err,user){
        if(err){ //if there is some kind of error
            return done(err); // returns the error
        }
        if(user){ //if there is a user with that email
            //return a message saying that the email is already in use
            return done(null, false, { message: 'Email is already in use'});
        }
        //if there are no errors and the email is not in use
        //create a new user
        var newUser = new User()
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        //save the user in the database
        newUser.save((err,result)=>{
            if(err){
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

// passport.use('local.signin', new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password',
//     passReqToCallback: true
// }, function(req, email, password, done) {
//     //check that the email is not empty and that it is an actual email
//     req.checkBody('email', 'Invalid email').notEmpty().isEmail();
//     //check that the password is a least 4 letters
//     req.checkBody('password', 'Invalid password').notEmpty();
//     //get all the errors into a variable
//     var errors =  req.validationErrors();
//     if(errors){  //if we have errors
//         var messages = [];
//         errors.forEach((error)=>{ 
//             //store the errors into the messages array
//             messages.push(error.msg);
//         });
//         //return the errors in a nice message box
//         return done(null, false, req.flash('error', messages))
//     }
//     User.findOne({'email': email}, function(err,user){
//         if(err){ //if there is some kind of error
//             return done(err); // returns the error
//         }
//         if(!user){ //if there is no user with the email
//             //return a message saying that the email is already in use
//             return done(null, false, { message: 'User not found'});
//         }
//         if(!user.validPassword(password)){
//             return done(null, false, { message: 'Wrong password'});
//         }
//         //if there are no errors and the email is not in use
//         //create a new user
//         return done(null,user);
//     });
// }));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, {message: 'No user found.'});
        }
        if (!user.validPassword(password)) {
            //console.log(user.email);
            //console.log(user.password);
            //console.log(user.validPassword(password));
            return done(null, false, {message: 'Wrong password.'});
        }
        return done(null, user);
    });
}));
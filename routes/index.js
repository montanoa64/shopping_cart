var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');

const Product = require('../models/product');

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

router.get('/add-to-cart/:id', (req,res,next) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart: {});

  Product.findById(productId, (err, product) => {
    if(err){
      return res.redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

router.get('/shopping-cart',(req,res,next)=>{
  if(!req.session.cart){
    return res.render('shop/shopping-cart',{products: null});
  }
  var cart =  new Cart(req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', (req,res,next) =>{
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart =  new Cart(req.session.cart);
  res.render('shop/checkout', {total: cart.totalPrice})  
});

module.exports = router;

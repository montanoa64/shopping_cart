var express = require('express');
var router = express.Router();
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

module.exports = router;

const Product = require('../models/product');
const moongose = require('mongoose');

moongose.connect('localhost:27017/shooping');

var products = [
    new Product ({
        imagePath: 'https://upload.wikimedia.org/wikipedia/en/5/5e/Gothiccover.png',
        title: 'Gothic Video Game!!',
        description: 'Awsome Game',
        price: 15 
    }),

    new Product ({
        imagePath: 'https://i1.wp.com/bloody-disgusting.com/wp-content/uploads/2016/04/RERemake_US.jpg?resize=1000%2C1415',
        title: 'Resident Evil',
        description: 'Zombie Eating',
        price: 20 
    }),

    new Product ({
        imagePath: 'https://vignette.wikia.nocookie.net/mariokart/images/5/56/Box_NA_-_Mario_Kart_8.jpg/revision/latest?cb=20140521145803',
        title: 'Mario Kart 8',
        description: 'Nasty Racing',
        price: 25 
    })


];

var done = 0;

for (var i =0; i < products.length; i++){
    products[i].save((err,result) => {
        done++;
        if(done === products.length){
            exit();
        }
    });
}

function exit(){
    moongose.disconnect();
}
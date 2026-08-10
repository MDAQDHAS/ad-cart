const products = require('./data/products.json');
const Product = require('./models/productModel');
const dotenv = require('dotenv');
const connectDatabase = require('./config/connectDatabase');
const path = require('path');

// Setting dotenv file
dotenv.config({path: path.join(__dirname, 'config', 'config.env')});

connectDatabase();

const seedProducts = async () => {
    try {
        await Product.deleteMany();
        console.log('Products are deleted');

        await Product.insertMany(products);
        console.log('All Products are added.');

        process.exit();
    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

seedProducts();

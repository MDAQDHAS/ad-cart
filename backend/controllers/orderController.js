const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const { isDatabaseReady } = require('../config/connectDatabase');
const { fallbackProducts } = require('./productController');

const demoOrders = [];

//Create Order - /api/v1/order 
exports.createOrder = async (req, res) => {
    try {
        const cartItems = req.body;
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        const amount = Number(cartItems.reduce((acc, item) => (acc + item.product.price * item.qty), 0)).toFixed(2);
        const status = 'pending';
        let order;

        if (isDatabaseReady()) {
            order = await orderModel.create({ cartItems, amount, status, createdAt: new Date() });

            // Updating product stock
            for (const item of cartItems) {
                if (String(item.product._id).startsWith('demo')) continue;
                try {
                    const product = await productModel.findById(item.product._id);
                    if (product) {
                        product.stock = Math.max(0, (product.stock || 0) - item.qty);
                        await product.save();
                    }
                } catch (e) {
                    console.error('Stock update failed:', e.message);
                }
            }
        } else {
            if (process.env.NODE_ENV === 'production') {
                return res.status(503).json({
                    success: false,
                    message: 'Database is currently unavailable. Orders cannot be saved.'
                });
            }
            for (const item of cartItems) {
                const p = fallbackProducts.find((x) => x._id === item.product._id);
                if (p) p.stock = Math.max(0, p.stock - item.qty);
            }
            order = { _id: 'order' + (demoOrders.length + 1), cartItems, amount, status, createdAt: new Date() };
            demoOrders.push(order);
        }

        res.json({ success: true, order });
    } catch (error) {
        console.error('createOrder error:', error.message);
        res.status(500).json({ success: false, message: 'Unable to place order' });
    }
}

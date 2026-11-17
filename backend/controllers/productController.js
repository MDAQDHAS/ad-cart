const ProductModel = require('../models/productModel');
const { isDatabaseReady } = require('../config/connectDatabase');
const fallbackProducts = require('../data/products.json').map((p, i) => ({
    ...p,
    _id: 'demo' + (i + 1),
    numOfReviews: p.numOfReviews || 0,
    createdAt: p.createdAt || new Date().toISOString()
}));

exports.fallbackProducts = fallbackProducts;

let seeded = false;

// If the database is connected but empty, load the sample products once.
async function ensureSeeded() {
    if (seeded) return;
    const count = await ProductModel.countDocuments();
    if (count === 0) {
        await ProductModel.insertMany(require('../data/products.json'));
        console.log('Database was empty - sample products added.');
    }
    seeded = true;
}

//Get Products API - /api/v1/products
exports.getProducts = async (req, res) => {
    const keyword = req.query.keyword ? String(req.query.keyword).trim() : '';
    try {
        if (!isDatabaseReady()) throw new Error('Database not connected');
        await ensureSeeded();
        const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const query = keyword ? { name: { $regex: escaped, $options: 'i' } } : {};
        const products = await ProductModel.find(query);
        return res.json({ success: true, products });
    } catch (error) {
        console.error('getProducts fallback:', error.message);
        const lower = keyword.toLowerCase();
        const products = keyword
            ? fallbackProducts.filter((p) => p.name.toLowerCase().includes(lower))
            : fallbackProducts;
        return res.json({ success: true, products });
    }
}

//Get Single Product API - /api/v1/product/:id
exports.getSingleProduct = async (req, res) => {
    try {
        let product = null;
        if (String(req.params.id).startsWith('demo')) {
            product = fallbackProducts.find((p) => p._id === req.params.id);
        } else if (isDatabaseReady()) {
            product = await ProductModel.findById(req.params.id);
        }
        if (!product) {
            return res.status(404).json({ success: false, message: 'Unable to get Product with that ID' });
        }
        return res.json({ success: true, product });
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: 'Unable to get Product with that ID'
        });
    }
}

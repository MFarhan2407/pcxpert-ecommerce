const { Product, Store } = require('../models');

class ProductController {
    static async home(req, res) {
        try {
            const products = await Product.findAll({
                include: Store
            });

            res.render('home', { products });
        } catch (error) {
            res.send(error)
            
        }
    }

    static async showDetail(req, res) {
        try {
            const id = req.params.id;
            const product = await Product.findByPk(id, { include: Store });

            res.render('product-detail', { product })
        } catch (error) {
            res.send(error)
        }
    }
}

module.exports = ProductController
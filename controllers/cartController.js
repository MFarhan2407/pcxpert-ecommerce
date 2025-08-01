const { where } = require('sequelize');
const { Cart, Product } = require('../models')

class CartController {
    static async addToCart(req, res) {
        const userId = req.session.user.id;
        const { productId } = req.params;
        const { quantity } = req.body;
        // console.log("Product ID:", productId);


        const product = await Product.findByPk(productId);
        if(!product) throw new Error('Produk tidak ditemukan');

        const requestQty = Number(quantity) || 1;

        if(requestQty > product.stock) {
            return res.send(`Stok tidak cukup! Maksimal hanya ${product.stock} unit`);
        }
        

        let cart = await Cart.findOne({ where: { UserId: userId, ProductId: productId } });

        if (cart) {
            const totalQty = cart.quantity + requestQty;
            if(totalQty > product.stock) {
                return res.send(`Tidak bisa menambahkan. Anda sudah punya ${cart.quantity}, stok hanya ${product.stock}`);
            }
            cart.quantity = totalQty
            await cart.save();
        } else {
            await Cart.create({ UserId: userId, ProductId: productId, quantity: requestQty });
        }
    }

 

    static async showCart(req, res) {
        try {
            
            const userId = req.session.user.id;
            const cartItems = await Cart.findAll({
                where: { UserId: userId },
                include: Product
            });

            let total = 0;
            cartItems.forEach(el => {
                total += el.Product.price * el.quantity
            });
    
            res.render('cart', { cartItems, total });
        } catch (error) {
            res.send(error)
            
        }
    }
    

    static async removeFromCart(req, res) {
        const userId = req.session.user.id;
        const { productId } = req.params;

        await Cart.destroy({ where: { UserId: userId, ProductId: productId } });
        res.redirect('/cart');
    }

}

module.exports = CartController
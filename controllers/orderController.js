const { Cart, Product, Order, OrderItem, sequelize } = require('../models')
const { QueryTypes } = require('sequelize');

class OrderController {
  static async checkout(req, res) {
    try {
      const userId = req.session.user.id;

      const cartItems = await Cart.findAll({
        where: { UserId: userId },
        include: Product
      });

      if (cartItems.length === 0) {
        throw new Error("Cart kosong.");
      }

      for (const item of cartItems) {
        if (item.quantity > item.Product.stock) {
          throw new Error(`Stok untuk "${item.Product.name}" tidak cukup.`);
        }
      }

      for (const item of cartItems) {
        item.Product.stock -= item.quantity;
        await item.Product.save();
      }

      const totalBelanja = cartItems.reduce((acc, item) => {
        return acc + item.quantity * item.Product.price;
      }, 0);

      const [orderResult] = await sequelize.query(
        `
          INSERT INTO "Orders" ("UserId", "totalPrice", "createdAt", "updatedAt")
          VALUES (:userId, :totalPrice, NOW(), NOW())
          RETURNING *
        `,
        {
          replacements: { userId, totalPrice: totalBelanja },
          type: sequelize.QueryTypes.INSERT
        }
      );
      const order = orderResult[0];
      for (const item of cartItems) {
        await sequelize.query(
          `
            INSERT INTO "OrderItems" 
            ("OrderId", "ProductId", "quantity", "priceAtPurchase", "createdAt", "updatedAt")
            VALUES (:orderId, :productId, :quantity, :price, NOW(), NOW())
          `,
          {
            replacements: {
              orderId: order.id,
              productId: item.Product.id,
              quantity: item.quantity,
              price: item.Product.price
            },
            type: sequelize.QueryTypes.INSERT
          }
        );
      }

      await Cart.destroy({ where: { UserId: userId } });
      req.flash('success', `Checkout berhasil. Total belanja: Rp ${totalBelanja.toLocaleString()}`);
      res.redirect('/cart');
    } catch (error) {
      req.flash('error', 'Cart kosong.');
      return res.redirect('/cart');

    }
  }


  static async orderHistory(req, res) {
    try {
      const userId = req.session.user.id;

      const query = `
      SELECT 
        o.id AS "orderId",
        o."totalPrice",
        o."createdAt" AS "tanggal",
        oi.quantity,
        oi."priceAtPurchase",
        p.name AS "productName"
      FROM "Orders" o
      JOIN "OrderItems" oi ON o.id = oi."OrderId"
      JOIN "Products" p ON oi."ProductId" = p.id
      WHERE o."UserId" = :userId
      ORDER BY o."createdAt" DESC
    `;

      const results = await sequelize.query(query, {
        replacements: { userId },
        type: QueryTypes.SELECT
      });


      const grouped = {};
      results.forEach(row => {
        if (!grouped[row.orderId]) {
          grouped[row.orderId] = {
            orderId: row.orderId,
            totalPrice: row.totalPrice,
            tanggal: row.tanggal.toISOString().split('T')[0],
            items: []
          };
        }
        grouped[row.orderId].items.push({
          productName: row.productName,
          quantity: row.quantity,
          price: row.priceAtPurchase
        });
      });

      const formatted = Object.values(grouped);

      // res.json(formatted);

      res.render('order-history', { orders: formatted });
    } catch (error) {
      console.log("Gagal cek history", error);
      res.status(500).send("Gagal mengambil riwayat transaksi");
    }
  }



}

module.exports = OrderController
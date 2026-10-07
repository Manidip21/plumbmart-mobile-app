const { sequelize } = require("../config/database");

const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

const checkout = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const { paymentMethod = "DIRECT_PAYMENT" } = req.body;

    // 1. Get user's cart
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          include: [
            {
              model: Product,
            },
          ],
        },
      ],
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    // 2. Check if cart exists and is not empty
    if (!cart || cart.CartItems.length === 0) {
      await transaction.rollback();

      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // 3. Validate payment method based on user role
    if (userRole === "CUSTOMER") {
      if (paymentMethod !== "DIRECT_PAYMENT") {
        await transaction.rollback();

        return res.status(403).json({
          success: false,
          message: "Customers can only use direct payment",
        });
      }
    } else if (userRole === "DEALER") {
      if (
        paymentMethod !== "UPFRONT" &&
        paymentMethod !== "CREDIT_30" &&
        paymentMethod !== "CREDIT_90"
      ) {
        await transaction.rollback();

        return res.status(403).json({
          success: false,
          message: "Invalid payment method for dealer",
        });
      }

      // Get dealer credit eligibility
      const User = require("../models/User");

      const dealer = await User.findByPk(userId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!dealer) {
        await transaction.rollback();

        return res.status(404).json({
          success: false,
          message: "Dealer account not found",
        });
      }

      // Check 30-day credit eligibility
      if (paymentMethod === "CREDIT_30" && !dealer.credit30Eligible) {
        await transaction.rollback();

        return res.status(403).json({
          success: false,
          message: "30-day credit is not approved for this dealer",
        });
      }

      // Check 90-day credit eligibility
      if (paymentMethod === "CREDIT_90" && !dealer.credit90Eligible) {
        await transaction.rollback();

        return res.status(403).json({
          success: false,
          message: "90-day credit is not approved for this dealer",
        });
      }
    } else {
      await transaction.rollback();

      return res.status(403).json({
        success: false,
        message: "This user role cannot place orders",
      });
    }

    // 4. Re-check products and calculate total
    let totalAmount = 0;

    for (const item of cart.CartItems) {
      const product = item.Product;

      if (!product || !product.isActive) {
        await transaction.rollback();

        return res.status(400).json({
          success: false,
          message: `Product for cart item ${item.id} is no longer available`,
        });
      }

      if (product.stock < item.quantity) {
        await transaction.rollback();

        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
          availableStock: product.stock,
          requestedQuantity: item.quantity,
        });
      }

      totalAmount += Number(product.price) * item.quantity;
    }

    // 5. Mock payment handling
    // Real payment gateway integration will be added later.
    let paymentStatus = "PAID";

    if (paymentMethod === "CREDIT_30" || paymentMethod === "CREDIT_90") {
      paymentStatus = "CREDIT_APPROVED";
    }

    // 6. Create order
    const order = await Order.create(
      {
        userId,
        totalAmount: totalAmount.toFixed(2),
        status: "CONFIRMED",
        paymentMethod,
        paymentStatus,
      },
      { transaction },
    );

    // 7. Create order items and reduce stock
    for (const item of cart.CartItems) {
      const product = item.Product;

      await OrderItem.create(
        {
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        },
        { transaction },
      );

      await product.update(
        {
          stock: product.stock - item.quantity,
        },
        { transaction },
      );
    }

    // 8. Clear cart items
    await CartItem.destroy({
      where: { cartId: cart.id },
      transaction,
    });

    // 9. Commit everything
    await transaction.commit();

    // 10. Return order confirmation
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: {
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
      },
    });
  } catch (error) {
    await transaction.rollback();

    console.error("Checkout error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "imageUrl"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const orderId = req.params.id;

    const order = await Order.findOne({
      where: {
        id: orderId,
        userId,
      },
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["id", "name", "imageUrl"],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

module.exports = {
  checkout,
  getOrders,
  getOrderById,
};

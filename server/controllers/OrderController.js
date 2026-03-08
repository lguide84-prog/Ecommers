import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Address from "../models/Address.js";
import { sendOrderNotification } from "../utils/whatsappUtils.js";

// Place order with QR payment
export const placeOrderOnline = async (req, res) => {
  try {
    const { items, addressId, transactionId } = req.body;
    const userId = req.user._id;

    // Validation
    if (!transactionId) {
      return res.status(400).json({ success: false, message: "Transaction ID required" });
    }

    // Check duplicate transaction
    const existingOrder = await Order.findOne({ transactionId });
    if (existingOrder) {
      return res.status(400).json({ success: false, message: "Transaction ID already used" });
    }

    // Calculate amount
    let amount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ success: false, message: "Product not found" });
      }
      
      const itemPrice = product.offerPrice || product.price;
      amount += itemPrice * item.quantity;
      
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        size: item.size,
        price: itemPrice
      });

      // Update stock for clothing items
      if (product.productType === 'clothing' && item.size) {
        await product.updateSizeStock(item.size, item.quantity, 'decrease');
      }
    }

    // Create order
    const order = await Order.create({
      userId,
      items: orderItems,
      amount,
      address: addressId,
      transactionId,
      paymentType: 'QR Code',
      isPaid: true,
      status: 'Payment Received'
    });

    // Add to user's order history
    await User.findByIdAndUpdate(userId, {
      $push: { orderHistory: order._id }
    });

    // Get full details for WhatsApp
    const user = await User.findById(userId);
    const address = await Address.findById(addressId);
    
    // Prepare WhatsApp message
    const orderData = {
      orderId: order._id,
      customerName: user.name,
      customerPhone: user.phone || address.phone,
      totalAmount: amount,
      transactionId,
      address: `${address.street}, ${address.city}, ${address.state} - ${address.zipcode}`,
      items: orderItems.map(item => ({
        name: item.product?.name || 'Product',
        quantity: item.quantity,
        price: item.price
      }))
    };

    // Send WhatsApp notification
    const whatsappResult = await sendOrderNotification(orderData);
    
    // Update order with WhatsApp status
    if (whatsappResult.success) {
      order.whatsappSent = true;
      await order.save();
    }

    res.json({ 
      success: true, 
      message: "Order placed successfully",
      orderId: order._id,
      whatsappUrl: whatsappResult.whatsappUrl
    });
    
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.product')
      .populate('address')
      .sort('-createdAt');
    
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders (seller/admin only)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email phone')
      .populate('items.product')
      .populate('address')
      .sort('-createdAt');
    
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      orderId, 
      { status },
      { new: true }
    );

    // Update status in user's order history
    await User.updateOne(
      { 'orderHistory.orderId': orderId },
      { $set: { 'orderHistory.$.status': status } }
    );

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get QR code URL
export const getQRCode = async (req, res) => {
  try {
    // You can store QR code URL in env or config
    const qrCodeUrl = process.env.QR_CODE_URL || '/images/payment-qr.jpg';
    res.json({ success: true, qrCodeUrl });
  } catch (error) {
    console.error("Get QR code error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get WhatsApp link for specific order
export const getOrderWhatsAppLink = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await Order.findById(orderId)
      .populate('userId', 'name phone')
      .populate('address')
      .populate('items.product', 'name price');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Prepare order data
    const orderData = {
      orderId: order._id,
      customerName: order.userId?.name || "Customer",
      customerPhone: order.userId?.phone || "Not provided",
      totalAmount: order.amount,
      paymentType: order.paymentType,
      transactionId: order.transactionId,
      address: order.address 
        ? `${order.address.street}, ${order.address.city}, ${order.address.state} - ${order.address.zipcode}`
        : "Address not provided",
      items: order.items.map(item => ({
        name: item.product?.name || "Product",
        quantity: item.quantity,
        price: (item.product?.price || 0) * item.quantity
      }))
    };

    // Generate WhatsApp URL
    const { generateOrderWhatsAppMessage, getWhatsAppURL } = await import('../utils/whatsappUtils.js');
    const message = generateOrderWhatsAppMessage(orderData);
    const whatsappUrl = getWhatsAppURL(message);

    res.status(200).json({
      success: true,
      whatsappUrl: whatsappUrl,
      orderData: {
        orderId: orderData.orderId,
        customerName: orderData.customerName,
        totalAmount: orderData.totalAmount
      }
    });

  } catch (error) {
    console.error("Error generating WhatsApp link:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
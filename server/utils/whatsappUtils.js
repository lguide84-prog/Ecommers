// WhatsApp utility for order notifications

// Format order message
export const generateOrderWhatsAppMessage = (orderData) => {
  const {
    orderId,
    customerName,
    customerPhone,
    totalAmount,
    transactionId,
    address,
    items
  } = orderData;

  let message = `🛍️ *NEW ORDER RECEIVED* 🛍️\n\n`;
  message += `📦 *Order ID:* ${orderId}\n`;
  message += `👤 *Customer:* ${customerName}\n`;
  message += `📞 *Phone:* ${customerPhone}\n`;
  message += `💰 *Total Amount:* ₹${totalAmount}\n`;
  message += `💳 *Transaction ID:* ${transactionId}\n\n`;
  
  message += `📍 *Delivery Address:*\n${address}\n\n`;
  
  message += `📋 *Order Items:*\n`;
  items.forEach((item, index) => {
    message += `${index + 1}. ${item.name} x${item.quantity} = ₹${item.price}\n`;
  });
  
  message += `\n✅ *Payment Status:* Received\n`;
  message += `🕐 *Order Time:* ${new Date().toLocaleString()}`;

  return encodeURIComponent(message);
};

// Get WhatsApp URL (using your business number)
export const getWhatsAppURL = (message) => {
  const phoneNumber = process.env.WHATSAPP_NUMBER || '79064 82210'; // Your WhatsApp number
  return `https://wa.me/${phoneNumber}?text=${message}`;
};

// Send order notification (returns URL)
export const sendOrderNotification = async (orderData) => {
  try {
    const message = generateOrderWhatsAppMessage(orderData);
    const whatsappUrl = getWhatsAppURL(message);
    
    return {
      success: true,
      whatsappUrl,
      message: "WhatsApp link generated"
    };
  } catch (error) {
    console.error("WhatsApp notification error:", error);
    return {
      success: false,
      error: error.message
    };
  }
};
export const sendOrderConfirmation = (userEmail, orderDetails) => {
  console.log('\n======================================================');
  console.log("              MCDONALD'S RECEIPT - MOCK EMAIL         ");
  console.log('======================================================');
  console.log(`To: ${userEmail}`);
  console.log(`Subject: Your Order Confirmation #${orderDetails._id}`);
  console.log('------------------------------------------------------');
  console.log('Order Items:');
  orderDetails.items.forEach((item, index) => {
    console.log(`  ${index + 1}. Product ID: ${item.productId} | Qty: ${item.quantity} | Price: $${(item.priceAtPurchase).toFixed(2)}`);
  });
  console.log('------------------------------------------------------');
  console.log(`Total Amount Paid: $${(orderDetails.totalAmount).toFixed(2)}`);
  console.log(`Status: ${orderDetails.status}`);
  console.log('======================================================\n');
};

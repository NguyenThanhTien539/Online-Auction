import nodemailer from "nodemailer";

export const sendMail = (email: string, title: string, content: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // use false for STARTTLS; true for SSL on port 465
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_ADDRESS,
    to: email,
    subject: title,
    html: content,
  };

  // Send the email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
};




// ============================================
// AUCTION END EMAIL TEMPLATES
// ============================================

interface EmailTemplateParams {
  productName: string;
  productLink: string;
  finalPrice: number;
  winnerName?: string;
  sellerName?: string;
}

// Winner Email Template
export const getWinnerEmailTemplate = (params: EmailTemplateParams): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { color: #fff; margin: 0; font-size: 28px; }
    .content { background: #fff; padding: 40px 30px; border: 1px solid #e5e5e5; }
    .badge { display: inline-block; background: #10b981; color: #fff; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-bottom: 20px; }
    .product-info { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .product-name { font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
    .price { font-size: 32px; font-weight: bold; color: #667eea; margin: 15px 0; }
    .button { display: inline-block; background: #667eea; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .button:hover { background: #5568d3; }
    .info-text { color: #6b7280; font-size: 14px; margin: 15px 0; }
    .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Congratulations on Your Win!</h1>
    </div>
    <div class="content">
      <div class="badge">WINNER</div>
      <p>You have successfully won the auction for:</p>
      
      <div class="product-info">
        <div class="product-name">${params.productName}</div>
        <div class="price">${params.finalPrice.toLocaleString('vi-VN')} VND</div>
      </div>

      <p class="info-text">Please complete the payment within 48 hours to finalize your purchase. Failure to pay on time may result in cancellation of the order.</p>

      <a href="${params.productLink}" class="button">View Product Details</a>

      <p class="info-text">After payment confirmation, the seller will contact you to arrange delivery.</p>

      <p style="margin-top: 30px;">Thank you for participating in our auction!</p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply.</p>
      <p>&copy; 2026 Online Auction Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Seller Email Template - With Winner
export const getSellerWithWinnerEmailTemplate = (params: EmailTemplateParams): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { color: #fff; margin: 0; font-size: 28px; }
    .content { background: #fff; padding: 40px 30px; border: 1px solid #e5e5e5; }
    .badge { display: inline-block; background: #3b82f6; color: #fff; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-bottom: 20px; }
    .product-info { background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981; }
    .product-name { font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
    .info-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    .info-label { color: #6b7280; font-weight: 500; }
    .info-value { color: #1f2937; font-weight: bold; }
    .price { font-size: 28px; color: #10b981; }
    .button { display: inline-block; background: #10b981; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .button:hover { background: #059669; }
    .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Auction Ended Successfully</h1>
    </div>
    <div class="content">
      <div class="badge">SOLD</div>
      <p>Great news! Your product has been sold successfully.</p>
      
      <div class="product-info">
        <div class="product-name">${params.productName}</div>
        <div class="info-row">
          <span class="info-label">Winner</span>
          <span class="info-value">${params.winnerName}</span>
        </div>
        <div class="info-row" style="border-bottom: none;">
          <span class="info-label">Final Price</span>
          <span class="info-value price">${params.finalPrice.toLocaleString('vi-VN')} VND</span>
        </div>
      </div>

      <p><strong>Next Steps:</strong></p>
      <ul style="color: #6b7280; line-height: 2;">
        <li>Wait for the buyer to complete payment (48 hours)</li>
        <li>Prepare the product for shipping</li>
        <li>Contact the buyer to arrange delivery</li>
      </ul>

      <a href="${params.productLink}" class="button">View Product Details</a>

      <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">You will be notified once the buyer completes the payment.</p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply.</p>
      <p>&copy; 2026 Online Auction Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Seller Email Template - No Winner
export const getSellerNoWinnerEmailTemplate = (params: EmailTemplateParams): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { color: #fff; margin: 0; font-size: 28px; }
    .content { background: #fff; padding: 40px 30px; border: 1px solid #e5e5e5; }
    .badge { display: inline-block; background: #6b7280; color: #fff; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; margin-bottom: 20px; }
    .product-info { background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
    .product-name { font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
    .button { display: inline-block; background: #f59e0b; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .button:hover { background: #d97706; }
    .info-text { color: #6b7280; font-size: 14px; line-height: 1.8; }
    .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Auction Ended</h1>
    </div>
    <div class="content">
      <div class="badge">NO WINNER</div>
      <p>Your auction has ended, but unfortunately there were no successful bids.</p>
      
      <div class="product-info">
        <div class="product-name">${params.productName}</div>
      </div>

      <p class="info-text"><strong>Possible reasons:</strong></p>
      <ul class="info-text">
        <li>Starting price might be too high</li>
        <li>Product description or images need improvement</li>
        <li>Consider relisting with adjusted terms</li>
      </ul>

      <a href="${params.productLink}" class="button">View Product Details</a>

      <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">You can relist this product or contact support for assistance.</p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply.</p>
      <p>&copy; 2026 Online Auction Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Loser Email Template
export const getLoserEmailTemplate = (params: EmailTemplateParams): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #64748b 0%, #475569 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { color: #fff; margin: 0; font-size: 28px; }
    .content { background: #fff; padding: 40px 30px; border: 1px solid #e5e5e5; }
    .product-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .product-name { font-size: 20px; font-weight: bold; color: #1f2937; margin-bottom: 10px; }
    .price { font-size: 24px; font-weight: bold; color: #64748b; margin: 10px 0; }
    .button { display: inline-block; background: #3b82f6; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .button:hover { background: #2563eb; }
    .info-text { color: #6b7280; font-size: 14px; margin: 15px 0; }
    .footer { text-align: center; padding: 20px; color: #9ca3af; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Auction Ended</h1>
    </div>
    <div class="content">
      <p>Thank you for participating in the auction for:</p>
      
      <div class="product-info">
        <div class="product-name">${params.productName}</div>
        <p class="info-text">Final winning price:</p>
        <div class="price">${params.finalPrice.toLocaleString('vi-VN')} VND</div>
      </div>

      <p>Unfortunately, your bid was not the highest. But don't worry, there are many other great products available!</p>

      <a href="${params.productLink}" class="button">Explore Similar Products</a>

      <p style="margin-top: 30px; color: #6b7280; font-size: 14px;">Keep participating and you might win the next auction!</p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply.</p>
      <p>&copy; 2026 Online Auction Platform. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};



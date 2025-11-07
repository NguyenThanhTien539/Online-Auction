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

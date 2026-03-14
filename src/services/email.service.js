require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

 const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

async function createTransporter() {
    const accessToken = await oAuth2Client.getAccessToken();

    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USER,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            accessToken: accessToken.token,
        },
    });
}

//verify connection configuration
async function verifyTransporter() {
    const transporter = await createTransporter();
    transporter.verify((error, success) => {
        if (error) {
            console.error('Error connecting:', error);
        } else {
            console.log('Email service ready');
        }
    });
}
verifyTransporter();



const sendEmail = async (to, subject, text, html) => {
    try {
        const transporter = await createTransporter();

        const info = await transporter.sendMail({
            from: `"Learn Backend" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log('Email sent:', info.messageId);

    } catch (error) {
        console.error('Error sending email:', error);
    }
};



async function sendRegistrationEmail(userEmail, name) {
   
const subject = "🎉 Welcome to The Backend!";

const text = `
Hi ${name},

Welcome to Backend Team!

Your account has been successfully created and we're excited to have you on board.

You can now start exploring the platform and backend Team development step by step.

If you did not create this account, please ignore this email.

Best regards,
The Backend Team
`;

const html = `
<div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
  <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:10px; box-shadow:0 5px 15px rgba(0,0,0,0.1);">
    
    <h2 style="color:#333;">Welcome to Learn Backend 🚀</h2>

    <p style="font-size:16px;">Hi <b>${name}</b>,</p>

    <p style="font-size:16px; color:#555;">
      Your account has been successfully created. We're excited to have you join our platform!
    </p>

    <p style="font-size:16px; color:#555;">
      You can now start learning backend development and explore all the features available to you.
    </p>

    <div style="text-align:center; margin:30px 0;">
      <a href="#" style="background:#4CAF50; color:white; padding:12px 25px; text-decoration:none; border-radius:6px; font-weight:bold;">
        Start Learning
      </a>
    </div>

    <p style="font-size:14px; color:#777;">
      If you did not create this account, you can safely ignore this email.
    </p>

    <hr style="margin:25px 0;">

    <p style="font-size:13px; color:#999; text-align:center;">
      © ${new Date().getFullYear()} Learn Backend. All rights reserved.
    </p>

  </div>
</div>
`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
   
const subject = "✅ Transaction Successful";

const text = `
Hi ${name},

Your transaction has been completed successfully.

Transaction Details:
Amount: $${amount}
Recipient Account: ${toAccount}

If you did not initiate this transaction, please contact support immediately.

Best regards,
The Backend Team
`;

const html = `
<div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px;">
  <div style="max-width:600px; margin:auto; background:white; padding:30px; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

    <h2 style="color:#2e7d32;">Transaction Successful ✅</h2>

    <p style="font-size:16px;">Hi <b>${name}</b>,</p>

    <p style="font-size:15px; color:#555;">
      Your transaction has been completed successfully. Below are the details:
    </p>

    <table style="width:100%; border-collapse:collapse; margin:20px 0;">
      <tr>
        <td style="padding:10px; border-bottom:1px solid #eee;"><b>Amount</b></td>
        <td style="padding:10px; border-bottom:1px solid #eee;">$${amount}</td>
      </tr>
      <tr>
        <td style="padding:10px; border-bottom:1px solid #eee;"><b>Recipient Account</b></td>
        <td style="padding:10px; border-bottom:1px solid #eee;">${toAccount}</td>
      </tr>
      <tr>
        <td style="padding:10px;"><b>Status</b></td>
        <td style="padding:10px; color:#2e7d32;"><b>Completed</b></td>
      </tr>
    </table>

    <p style="font-size:14px; color:#777;">
      If you did not initiate this transaction, please contact our support team immediately.
    </p>

    <hr style="margin:25px 0">

    <p style="font-size:13px; color:#999; text-align:center;">
      © ${new Date().getFullYear()} Learn Backend. All rights reserved.
    </p>

  </div>
</div>
`;












    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Failed';
    const text = `Hi ${name},\n\nYour transaction of $${amount} to account ${toAccount} has failed.\n\nBest regards,\nThe Learn Backend Team`;
    const html = `<p>Hi ${name},</p><p>Your transaction of $${amount} to account ${toAccount} has failed.</p><p>Best regards,<br>The Backend Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransactionFailureEmail,
    
};


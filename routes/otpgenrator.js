const express = require('express');
const router = express.Router();
const OTP = require("../models/otp");
const nodemailer = require('nodemailer');
const axios = require('axios');
const path = require('path');
const hbs = require('nodemailer-express-handlebars');
const { body } = require('express-validator');

// Configure nodemailer with your email service credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'neonsha@gmail.com',
    pass: 'aphmouatlraoksqx',
  },
});

const handlebarOptions = {
  viewEngine: {
    extname: '.hbs',
    partialsDir: path.resolve('./views/partials'),
    defaultLayout: false,
  },
  viewPath: path.resolve('./views'),
  extName: '.hbs',
};

transporter.use('compile', hbs(handlebarOptions));

router.post('/generate-otp', async (req, res) => {
  const { email } = req.body
  try {
    // Make a request to the API to check if the email exists
    const response = await axios.get(`https://tsk-final-backend.vercel.app/api/members/users?email=${{email}}`);
    const userExists = response.data.exists;
    if (userExists) {
      return res.status(400).json({ error: 'Email does not exist' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const newOTP = new OTP({ otp });
    await newOTP.save();
    res.send(email)
    // Compose the email
    const mailOptions = {
      from: '"Taskstack" <neonsha@gmail.com>',
      to: {email},
      subject: 'OTP Verification',
      template: 'otp',
      context:{
        generatedOtp : otp,
      }
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'An unexpected error occurred while sending the email' });
      } else {
        res.json({ otp });
      }
    });
  } catch (error) {
    console.error('Error checking email existence:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, EnteredOTP } = req.body;

    // Make a request to the API to check if the email exists
    const response = await axios.get(`https://tsk-final-backend.vercel.app/api/members/users?email=${email}`);

    const userExists = response.data.exists;

    if (!userExists) {
      return res.status(400).json({ error: 'Email does not exist' });
    }

    const latestOTP = await OTP.findOne({}, {}, { sort: { createdAt: -1 } }).exec();
    if (!latestOTP) {
      return res.status(400).json({ error: 'No OTP found' });
    }
    if (latestOTP.otp === EnteredOTP) {
      return res.json({ message: 'Login Successful' });
    } else {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ error: 'An unexpected error occurred' });
  }
});

module.exports = router;

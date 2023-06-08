const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 11,
    },
  });
  
  const OTP = mongoose.model('otp', otpSchema);
  
module.exports = mongoose.model("otp", otpSchema);

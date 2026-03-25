const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Mock OTP generation (In production, use crypto and nodemailer)
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, msg: "Email required" });

    try {
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ email });
        }
        
        const otp = generateOTP();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
        await user.save();

        console.log(`\n================================`);
        console.log(`MOCK OTP FOR ${email}: ${otp}`);
        console.log(`================================\n`);

        res.json({ success: true, msg: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
            return res.status(400).json({ success: false, msg: "Invalid or expired OTP" });
        }
        
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1d' });
        
        res.json({ success: true, token, email: user.email });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

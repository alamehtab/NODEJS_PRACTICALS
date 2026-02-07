const userModel = require("../model/user");
const User = userModel.User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const email = require("../utils/mail")
const sendEmail = email.sendEmail

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const isExist = await User.findOne({ email: email });
        if (isExist)
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });
        res.status(201).json({ message: "User registered successfully", user: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
        // Create token
        const token = jwt.sign({ email: email, role: user.role, id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.forgotPasswordOTP = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // hash OTP before saving
    const hashedOTP = await bcrypt.hash(otp, 10);
    user.resetOtp = hashedOTP;
    user.resetOtpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();
    await sendEmail(
        user.email,
        "Password Reset OTP",
        `Your OTP is ${otp}. It is valid for 5 minutes.`
    );
    res.json({ message: "OTP sent to email" });
};

exports.resetPasswordWithOTP = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({
            email,
            resetOtpExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "OTP expired or invalid" });
        }

        const isOtpValid = await bcrypt.compare(otp, user.resetOtp);
        if (!isOtpValid) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOtp = undefined;
        user.resetOtpExpiry = undefined;

        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// exports.forgetPass = async (req, res) => {
//     try {
//         const { email } = req.body
//         const user = await User.findOne({ email: email })
//         if (!user) {
//             return res.status(401).json({ message: "Invalid credentials" })
//         }
//         const otp = Math.floor(100000 + Math.random() * 900000)
//         const hashedOtp = await bcrypt.hash(otp, process.env.JWT_SECRET)
//         user.resetOtp = hashedOtp
//         user.resetOtpExpiriy = Date.now() + 5 * 60 * 1000
//         await user.save()
//         await sendEmail(email, `OTP to reset your password","Your OTP to reset your password is ${otp}. It will be valid for 5 minutes.`)
//         return res.status(200).json({ message: "Otp sent to your registered email." })
//     } catch (error) {
//         return res.status(500).json({ message: error.message })
//     }
// }

// exports.resetpassword = async (req, res) => {
//     try {
//         const { email, otp, newpassword } = req.body
//         const user = await User.findOne({ email, resetOtpExpiriy: { $gt: Date() } })
//         if (!user) {
//             return res.status(401).json({ message: "Invalid credentials" })
//         }
//         const otpMatch = await bcrypt.compare(otp, user.resetOtp)
//         if (!otpMatch) {
//             return res.status(401).json({ message: "Invalid OTP." })
//         }
//         user.password = await bcrypt.hash(newpassword, 10)
//         user.resetOtp = undefined
//         user.resetOtpExpiriy = undefined
//         await user.save()
//         return res.status(200).json({ message: "Your password was changed." })
//     } catch (error) {
//         return res.status(500).json({ message: error.message })
//     }
// }
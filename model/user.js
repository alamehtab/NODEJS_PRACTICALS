// const mongoose = require("mongoose");
// const { Schema } = mongoose;
// const userSchema = new Schema({
//     name: String,
//     email: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     role: {
//         type: String,
//         default: "user"
//     }
// });
// exports.User = mongoose.model("User", userSchema);

const mongoose = require("mongoose")
const { Schema } = mongoose
const userSchema = new Schema({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    resetOtp: { type: String },
    resetOtpExpiriy: Date,
    profilePicture: { type: String }
})
exports.User = mongoose.model("User", userSchema)
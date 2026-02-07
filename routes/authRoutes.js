// const express = require("express");
// const router = express.Router();
// const authController = require("../controller/authController");
// const authMiddleware = require("../middleware/authMiddleware");

// // Public routes
// router.post("/register", authController.register);
// router.post("/login", authController.login);

// // Protected route
// router.get("/profile", authMiddleware.authMiddleware, (req, res) => {
//     res.json({
//         message: "Protected route accessed",
//         user: req.user
//     });
// });

// exports.router = router;

const express = require("express")
const router = express.Router()
const authController = require("../controller/authController")
const authMiddleware = require("../middleware/authMiddleware")
const { upload } = require("../middleware/upload")
const { uploadProfilePic } = require("../controller/uploadController")

router
    .post("/register", authController.register)
    .post("/login", authController.login)
    .post("/forgetpassword",authController.forgotPasswordOTP)
    .post("/resetpassword",authController.resetPasswordWithOTP)
    .get("/profile", authMiddleware.authMiddleware, (req, res) => {
        res.json({
            message: "profile endpoint accessed",
            user: req.user
        })
    })
    .get("/admin", authMiddleware.authMiddleware, authMiddleware.roleMiddleware("admin"), (req, res) => {
        res.json({
            message: "admin profile accessed"
        })
    })
    .post("/upload-file",authMiddleware.authMiddleware,authMiddleware.roleMiddleware("admin"),upload.single("profile"),uploadProfilePic)
exports.router = router
const jwt = require("jsonwebtoken")

exports.authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token not provided" })
        }
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.roleMiddleware = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(401).json({ message: "You are authorized to access this endpoint." })
        }
        next()
    }
}
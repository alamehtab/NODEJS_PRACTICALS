const productController = require("../controller/productController")
const express = require("express")
const router = express.Router()

router
    .post("/create-product", productController.createSingleProduct)
    .post("/insert-many-products",productController.insertMultpleProduct)
    .post("/pagination",productController.pagination)

exports.router = router
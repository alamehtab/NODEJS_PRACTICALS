const productModel = require("../model/product")
const Product = productModel.Product

exports.createSingleProduct = async (req, res) => {
    try {
        const products = new Product(req.body)
        await products.save()
        return res.status(201).json({ message: "Porducts created!", products })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.insertMultpleProduct = async (req, res) => {
    try {
        const products = await Product.insertMany(req.body)
        return res.status(201).json({ message: "Products created!", products })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.pagination = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit
        const totalProducts = await Product.countDocuments()

        const products = await Product.find().skip(skip).limit(limit)
        return res.status(200).json({
            totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            products
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.paginationWithSorting = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit
        const order = req.query.order === "asc" ? 1 : -1
        const sortBy = req.query.sortBy || "price"
        const sortObject = {}
        sortObject[sortBy] = order
        const totalProducts = await Product.countDocuments()

        const products = await Product.find().sort(sortObject).skip(skip).limit(limit)
        return res.status(200).json({
            totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limit),
            products
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
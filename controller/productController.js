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

exports.searchFilter = async (req, res) => {
    try {
        const search = req.query.search || ""
        const products = await Product.find({ title: { $regex: search, $options: "i" } })
        return res.status(200).json({ products })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.searchWithPaginationAndSorting = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit
        const sortBy = req.query.sortBy || "price"
        const order = req.query.order === "asc" ? 1 : -1
        const search = req.query.search || ""
        const sortobject = {}
        sortobject[sortBy] = order
        const query = { title: { $regex: search, $options: "i" } }
        const totalProducts = await Product.countDocuments(query)
        const products = await Product.find(query).sort(sortobject).skip(skip).limit(limit)
        return res.status(200).json({
            totalProducts,
            currentpage: page,
            totalPages: Math.ceil(totalProducts / limit),
            products
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.filterProducts = async (req, res) => {
    try {
        const filter = {}
        const excludedfields = ["page", "limit", "sortBy", "order", "minPrice", "maxPrice"]
        for (let key in req.query) {
            if (!excludedfields.includes(key)) {
                filter[key] = req.query[key]
            }
        }
        if (req.query.minPrice || req.query.maxprice) {
            filter.price = {}
            if (req.query.minPrice) {
                filter.price.$gte = Number(req.query.minPrice)
            }
            if (req.query.maxPrice) {
                filter.query.$lte = Number(req.query.maxPrice)
            }
        }
        const products = await Product.find(filter)
        return res.status(200).json({ count: products.length, products })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

exports.multiFilterSortSearchPage = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit
        const sortBy = req.query.sortBy || "price"
        const order = req.query.order === "asc" ? 1 : -1
        const sortObject = {}
        sortObject[sortBy] = order
        const filter = {}
        if (req.query.search) {
            filter.title = { $regex: req.query.search, $options: "i" }
        }
        const excludedFilter = ["page", "limit", "sortBy", "order", "minPrice", "maxPrice", "search"]
        for (let key in req.query) {
            if (!excludedFilter.includes(key)) {
                filter[key] = req.query[key]
            }
        }
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {}
            if (req.query.minPrice) {
                filter.price.$gte = Number(req.query.minPrice)
            }
            if (req.query.maxPrice) {
                filter.price.$lte = Number(req.query.maxPrice)
            }
        }
        const totalProducts = await Product.countDocuments(filter)
        const products = await Product.find(filter).sort(sortObject).skip(skip).limit(limit)
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

exports.multiFilter = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * limit
        const sortBy = req.query.sortBy || "price"
        const order = req.query.order === "asc" ? 1 : -1
        const sortObject = {}
        sortObject[sortBy] = order
        const filter = {}
        if (req.query.search) {
            filter.title = { $regex: req.query.search, $options: "i" }
        }
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {}
            if (req.query.minPrice) {
                filter.price.$gte = Number(req.query.minPrice)
            }
            if (req.query.maxPrice) {
                filter.price.$lte = Number(req.query.maxPrice)
            }
        }
        const excludedFilters = ["page", "limit", "sortBy", "order", "minPrice", "maxPrice", "search"]
        for (let key in req.query) {
            if (!excludedFilters.includes(key)) {
                filter[key] = req.query[key]
            }
        }
        const totalProducts = await Product.countDocuments(filter)
        const products = await Product.find(filter).sort(sortObject).skip(skip).limit(limit)
        return res.status(200).json({
            totalProducts,
            currentPage: page,
            totalPages: Math.ceil(totalProducts / limits),
            products
        })
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}
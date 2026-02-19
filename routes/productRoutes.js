const productController = require("../controller/productController")
const express = require("express")
const router = express.Router()

router
    .post("/create-product", productController.createSingleProduct)
    .post("/insert-many-products",productController.insertMultpleProduct)
    .post("/pagination",productController.pagination)
    .post("/pagination-sorting",productController.paginationWithSorting)
    .post("/search-filter",productController.searchFilter)
    .post("/searchwith-pagination",productController.searchWithPaginationAndSorting)
    .post("/filter",productController.filterProducts)
    .post("/multifilter",productController.multiFilterSortSearchPage)

exports.router = router
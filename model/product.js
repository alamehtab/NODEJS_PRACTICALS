const mongoose = require("mongoose")
const { Schema } = mongoose

const productSchema = new Schema({
    title: { type: String },
    description: { type: String },
    price: { type: Number },
    brand: { type: String }
})

exports.Product = mongoose.model("Products", productSchema)
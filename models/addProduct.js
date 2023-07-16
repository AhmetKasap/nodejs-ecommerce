const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productName : {type:String, require:true},
    productPrice: {type:String, require:true},
    productCategories : {type:String, require:true},
    productPhoto : {
        filename : {type: String},
        path : {type : String},
        originalname : {type : String}
    },
})

const AddProduct = mongoose.model('PRODUCT', productSchema)
module.exports = AddProduct 
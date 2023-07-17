const express = require('express')
const router = express.Router()
const Product = require('../models/addProduct')

router.get('/categories/:categoriesName', (req,res) => {
    const categoriesName = req.params.categoriesName

    Product.find()
    .then(product => {
        res.render('categories', {product : product, categoriesName: categoriesName})
    })
})






module.exports = router
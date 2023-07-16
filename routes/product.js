const express = require('express')
const router = express.Router()
const Product = require('../models/addProduct')


router.get('/product', (req,res) => {

    Product.find()
    .then(product => {
        res.render('product', {product:product})
    })
    .catch(err => {console.log(err)})

    
})

module.exports = router

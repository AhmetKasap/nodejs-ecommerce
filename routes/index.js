const express = require('express')
const router = express.Router()
const Product = require('../models/addProduct')


router.get('/', (req,res) => {
    
    Product.find()
    .then(product => {
        res.render('index', {product:product} )
    })
    .catch(err => {console.log(err)})
})

module.exports = router
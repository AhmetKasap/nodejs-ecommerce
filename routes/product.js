const express = require('express')
const router = express.Router()
const Product = require('../models/addProduct')
const auth = require('../middlewares/auth')


router.get('/product', auth.authenticationToken, (req,res) => {

    Product.find()
    .then(product => {
        res.render('product', {product:product})
    })
    .catch(err => {console.log(err)})

    
})

module.exports = router

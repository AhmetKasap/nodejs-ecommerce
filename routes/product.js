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


router.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    Product.findByIdAndDelete(id)
        .then(result => {
            res.redirect('/product');
        })
        .catch(err => {
            console.log(err);
        });
});
module.exports = router




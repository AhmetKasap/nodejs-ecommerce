const express = require('express')
const router = express.Router()
const Product = require('../models/addProduct')
const auth = require('../middlewares/auth')
const upload = require('../middlewares/multer')

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

router.post('/update/:id', upload.single('image'), (req,res) => {
    
    const id = req.params.id
    console.log(req.body.productName,req.body.productPrice,req.body.productCategories, req.file)

    const update = {
        productName : req.body.productName,
        productPrice : req.body.productPrice,
        productCategories : req.body.productCategories,
        productPhoto : {
            filename: req.file.filename,
            path: req.file.path,
            originalname: req.file.originalname
        }
    }

    Product.findByIdAndUpdate(id, update)
    .then(result => {
        console.log("güncelleme başarılı", result)
        res.redirect('/product')
    })
    .catch(err => {console.log("güncelleme hatalı", err)})

})

module.exports = router




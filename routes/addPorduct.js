const express = require('express')
const router = express.Router()
const upload = require('../middlewares/multer')
const addProduct = require('../models/addProduct')
const auth = require('../middlewares/auth')

router.get('/addproduct', auth.authenticationToken, (req,res) => {
    res.render('addproduct')
})

router.post('/addproduct', upload.single('image'), (req,res) => {
    
    const addproduct = new addProduct({
        productName : req.body.productName,
        productPrice : req.body.productPrice,
        productCategories : req.body.productCategories,
        productPhoto : {
            filename: req.file.filename,
            path: req.file.path,
            originalname: req.file.originalname
        }
    })

    addproduct.save()

    res.redirect('/product')

})


module.exports = router
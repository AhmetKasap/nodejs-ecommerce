const express = require('express')
const router = express.Router()
const upload = require('../middlewares/multer')
const addProduct = require('../models/addProduct')

router.get('/addproduct', (req,res) => {
    res.render('addproduct')
})

router.post('/addproduct', upload.single('image'), (req,res) => {
    console.log(req.file.filename)
    
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
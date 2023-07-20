const express = require('express')
const router = express.Router()
const admin = require('../controllers/admin')
const auth = require('../middlewares/auth')
const upload = require('../middlewares/multer')


router.get('/admin', admin.getAdmin)
router.post('/admin/login', admin.postLogin);

router.get('/addproduct', auth.authenticationToken, admin.getAddProduct)
router.post('/addproduct', upload.single('image'), admin.postAddProduct)

router.get('/product', auth.authenticationToken, admin.getProduct)
router.get('/delete/:id', admin.getDeleteProduct);
router.post('/update/:id', upload.single('image'), admin.postUpdateProduct)

router.get('/adminOrder',auth.authenticationToken, admin.getAdminOrder)
router.get('/sendMail/:id',  admin.sendMail)
router.get('/addArchive/:id', admin.addArchive)

module.exports = router
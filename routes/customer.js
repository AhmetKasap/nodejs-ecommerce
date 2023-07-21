const express = require('express')
const router = express.Router()
const customer = require('../controllers/customer')



router.get('/', customer.getIndex)
router.get('/categories/:categoriesName', customer.getCategories)

router.get('/basket', customer.getBasket)
router.get('/basket/:id', customer.getProductId);
router.get('/clearbasket', customer.getClearBasket)
router.post('/iyzico', customer.iyzicoTransaction)


module.exports = router
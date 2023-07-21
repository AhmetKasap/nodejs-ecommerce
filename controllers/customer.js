const Product = require('../models/product')
const CustomerInfo = require('../models/customerInfo')
const Iyzipay = require('iyzipay');
require('dotenv').config()


const getIndex = (req,res) => {
    
    Product.find()
    .then(product => {
        res.render('index', {product:product} )
    })
    .catch(err => {console.log(err)})
}


const getCategories = (req,res) => {
    const categoriesName = req.params.categoriesName

    Product.find()
    .then(product => {
        res.render('categories', {product : product, categoriesName: categoriesName})
    })
}


var products = []

const getBasket = (req,res) => {
    res.render('basket', {products:products})
    
}

const getProductId = (req, res) => {
    const id = req.params.id
    console.log(id)
    

    Product.findById(id)
    .then(data => {
        products.push(data)
        res.redirect('/basket')
    })

}

const getClearBasket = (req,res) => {
    products.splice(0,products.length)
    res.redirect('/basket')
}




const iyzicoTransaction = (req,res) => {
    const customerInfo = new CustomerInfo ({
        username : req.body.username,
        usersurname : req.body.usersurname,
        useremail : req.body.useremail,
        userphone : req.body.userphone,
        usercity : req.body.usercity,
        useradress : req.body.useradress,
        
        productId : products.map(data => data._id),
        productName: products.map(data => data.productName),
        productPrice: products.map(data => data.productPrice),
        productCategories : products.map(data => data.productCategories)

    })
    customerInfo.save()

    
    console.log(products)
   
    
    const basketItems = []
    products.map(data => {
        const strId = data._id.toString()
        
        const basketItem = {
            id: strId,
            name: data.productName,
            category1: data.productCategories,
            itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
            price: data.productPrice
        }
        basketItems.push(basketItem)
    })
    console.log(basketItems)

    var totalPrice = 0
    for(var i=0 ; i<basketItems.length ; i++) {
        totalPrice = parseFloat(basketItems[i].price) + totalPrice
    }
    
    console.log(totalPrice)

    

    

    

    const iyzipay = new Iyzipay({
        apiKey: process.env.IYZICO_API_KEY,
        secretKey: process.env.IYZICO_SECRET_KEY,
        uri: 'https://sandbox-api.iyzipay.com'
    });
    
    const data = {
        locale: Iyzipay.LOCALE.TR,
        price: totalPrice,
        paidPrice: totalPrice,
        currency: Iyzipay.CURRENCY.TRY,
        installment: '1',
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        callbackUrl: 'localhost:3000/successOrder',
        buyer: {
            id: '1',
            name: req.body.username,
            surname: req.body.usersurname,
            gsmNumber: req.body.userphone,
            email: req.body.useremail,
            identityNumber: '74300864791',
            registrationAddress: req.body.useradress,
            ip: '85.34.78.112',
            city: req.body.usercity,
            country: 'Turkey'
        },
        shippingAddress: {
            contactName: req.body.username,
            city: req.body.usercity,
            country: 'Turkey',
            address: req.body.useradress,
        },
        billingAddress: {
            contactName: req.body.username,
            city: req.body.usercity,
            country: 'Turkey',
            address: req.body.useradress,
        },
        
        basketItems: basketItems
    };
     
    iyzipay.checkoutFormInitialize.create(data, function (err, result) {
        console.log(err, result);
        const checkoutFormContent = result.checkoutFormContent
        console.log(checkoutFormContent)
        res.render('iyzico', {checkoutFormContent:checkoutFormContent})
      
    });
}




module.exports = {
    getIndex, getCategories, getBasket,getProductId,getClearBasket,iyzicoTransaction
}
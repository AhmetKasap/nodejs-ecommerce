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


const iyzipay = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: 'https://sandbox-api.iyzipay.com'
});

let getToken = ''

const iyzicoTransaction = (req,res) => {
    //?kullanıcı bilgileri ve sepetteki ürünler veritabanına kaydedildi.
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

    
    
    
    const data = {
        locale: Iyzipay.LOCALE.TR,
        price: totalPrice,
        paidPrice: totalPrice,
        currency: Iyzipay.CURRENCY.TRY,
        installment: '1',
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        callbackUrl : "http://localhost:3000/successOrder",
        
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
     
    //* iyzico formu 
    iyzipay.checkoutFormInitialize.create(data, async function (err, result) {
        const checkoutFormContent = await result.checkoutFormContent
        await res.render('iyzico', {checkoutFormContent:checkoutFormContent})
        

        //* dönenen script form metodundaki tokeni yakaladık.
        var tokenRegex = /token:"(.*?)"/;
        var match = checkoutFormContent.match(tokenRegex);
        if (match && match[1]) {
            var token = match[1];
            console.log("Alınan token:", token);
            getToken = token
            
        } else {
            console.log("Token bulunamadı.");
        }
        
        
    });

   
}

//*calbackUrl de ki linke post atıldı 
//*ödeme işlemi başarılıysa, status değeri = success döndü. ve kullanıcıya ödeme başarlı sayfası gösterildi
const postSuccessOrder = async (req, res) => {
    try {
        const result = await new Promise((resolve, reject) => {
            iyzipay.checkoutForm.retrieve({
                locale: Iyzipay.LOCALE.TR,
                token: getToken
            }, (err, result) => {
                if (err) {
                    reject(err);
                    res.send('ödeme esnasında bir hata oluştu')
                } else {
                    resolve(result);
                    res.render('success-order')
                }
            });
        });

        console.log(result);
    } catch (error) {
        console.error(error);
    }
}


module.exports = {
    getIndex, getCategories, getBasket,getProductId,getClearBasket,iyzicoTransaction,postSuccessOrder
}
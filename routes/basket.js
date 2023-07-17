const express = require('express')
const router = express.Router()


const Iyzipay = require('iyzipay');
require('dotenv').config()


 


router.get('/basket', (req,res) => {
    res.render('basket')
})


var products = []

router.get('/productId/:id', (req, res) => {
    const id = req.params.id
    console.log(id)
    

    Product.findById(id)
    .then(data => {
        products.push(data)
        res.render('basket', {products:products})
       
    })

});


router.post('/order', (req,res) => {
    const username = req.body.username
    const surname = req.body.surname
    const useremail = req.body.useremail
    const userphone = req.body.userphone
    const useradress = req.body.useradress
    const cardname = req.body.cardname
    const cardnumber = req.body.cardnumber
    const cardcvv = req.body.cardcvv
    const carddate = req.body.carddate

    const userInfo = {
        username,surname,useremail,userphone,cardname,cardnumber,cardcvv,carddate,useradress
    }

    console.log(userInfo)


    const iyzipay = new Iyzipay({
        apiKey: process.env.IYZICO_API_KEY,
        secretKey: process.env.IYZICO_API_SECRET,
        uri: 'https://sandbox-api.iyzipay.com'
    });

    const data = {
        locale: Iyzipay.LOCALE.TR,    // dil
        conversationId: '123456789',  //işlem id si
        price: '1',                   // fiyat 
        paidPrice: '1.2',             // vergi vs.
        currency: Iyzipay.CURRENCY.TRY, // para birimi
        basketId: 'B67832',
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        callbackUrl: 'https://www.merchant.com/callback',
        enabledInstallments: [2, 3, 6, 9],
        buyer: {
            id: 'BY789',   
            name: 'John',
            surname: 'Doe',
            gsmNumber: '+905350000000',
            email: 'email@email.com',
            identityNumber: '74300864791',
            lastLoginDate: '2015-10-05 12:43:35',
            registrationDate: '2013-04-21 15:12:09',
            registrationAddress: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            ip: '85.34.78.112',
            city: 'Istanbul',
            country: 'Turkey',
            zipCode: '34732'
        },
        shippingAddress: {
            contactName: 'Jane Doe',
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            zipCode: '34742'
        },
        billingAddress: {
            contactName: 'Jane Doe',
            city: 'Istanbul',
            country: 'Turkey',
            address: 'Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1',
            zipCode: '34742'
        },
        basketItems: [
            {
                id: 'BI101',
                name: 'Binocular',
                category1: 'Collectibles',
                category2: 'Accessories',
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: '0.3'
            },
            {
                id: 'BI102',
                name: 'Game code',
                category1: 'Game',
                category2: 'Online Game Items',
                itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
                price: '0.5'
            },
            {
                id: 'BI103',
                name: 'Usb',
                category1: 'Electronics',
                category2: 'Usb / Cable',
                itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
                price: '0.2'
            }
        ]
    };
    
    iyzipay.checkoutFormInitialize.create(data, function (err, result) {
        console.log(err, result);
        done();
    });







})

module.exports = router
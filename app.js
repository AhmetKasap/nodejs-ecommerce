const express = require('express')
const app = express()

//* body-parser
const bodyParser = require('body-parser');     
app.use(bodyParser.urlencoded({extended:false}));  

//*ejs, dotenv, public-static
app.set ('view engine', 'ejs')
app.use(express.static('public'));
require('dotenv').config()

//*database connection
const mongoose = require('mongoose')
const dbUrl = process.env.MONGODB_URL
mongoose.connect(dbUrl).then(res=> console.log("veritabanı bağlantısı kuruldu")).catch(err=> console.log("veri tabanı bağlantı hatası"))


//*routes
app.get('/', (req,res) => {
    res.render('index')
})

const basket = require('./routes/basket')
const admin = require('./routes/admin')
app.use(basket)
app.use(admin)






app.listen(3000)
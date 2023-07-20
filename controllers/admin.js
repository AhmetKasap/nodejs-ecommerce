const Admin = require('../models/admins')
const Product = require('../models/product')
const CustomerInfo = require('../models/customerInfo')
const ArchiveCustomerData = require('../models/archiveCustomerData')
const nodemailer = require("nodemailer");


 

const jwt = require('jsonwebtoken')


const getAdmin = (req,res) => {
    res.render('admin')
}


const createToken = async(id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:'1d'})
}

const postLogin = async (req, res) => {
    console.log(req.body.username);
    console.log(req.body.userpassword);

    const admin = await Admin.findOne({username : req.body.username})
    if(admin && admin.userpassword === req.body.userpassword){
        //* token oluşturma ve cookie kaydetme
        const token = await createToken(admin._id)
        res.cookie('jsonwebtoken', token, {httpOnly : true, maxAge : 1000*60*60*24})
        res.redirect('/product')
    }
    else{
        console.log("giriş hatalı")
        const errMessage = "Hatalı Girdiniz Lütfen Tekrar Deneyiniz."
        res.render('admin', {errMessage : errMessage})
    }
   
}

const getAddProduct = (req,res) => {
    res.render('addproduct')
}

const postAddProduct = (req,res) => {
    
    const addproduct = new Product({
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

}

const getProduct = (req,res) => {

    Product.find()
    .then(product => {
        res.render('product', {product:product})
    })
    .catch(err => {console.log(err)})

}

const getDeleteProduct = (req, res) => { 
    const id = req.params.id;
    Product.findByIdAndDelete(id)
        .then(result => {
            res.redirect('/product');
        })
        .catch(err => {
            console.log(err);
        });
}

const postUpdateProduct = (req,res) => {
    
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

}

const getAdminOrder = async (req,res) => {
    const customerInfos = await CustomerInfo.find()
    const archiveCustomerData = await ArchiveCustomerData.find()
    res.render('admin-order', {customerInfos:customerInfos, archiveCustomerData:archiveCustomerData})
    
}


const sendMail = async (req,res) => {
    const id = req.params.id

    const customerData = await CustomerInfo.findOne({_id : id})

    const transporter = await nodemailer.createTransport({
        service:'gmail',
        auth : {
            user : 'ahmetkaasap@gmail.com',
            pass : process.env.MAIL_PASSWORD_KEY
        }
    })

    const mailOptions = await {
        from : "ahmetkaasap@gmail.com",
        to : customerData.useremail,
        subject : 'Siparişiniz Alındı',
        text : 'Siparişiniz başarıyla alındı ve kargoya verildi. Aşağıdaki koddan kargo takibi yapabilirsiniz.'
    }

    transporter.sendMail(mailOptions)



}

const addArchive = async (req,res) => {

    const id = req.params.id;
    customerData = await CustomerInfo.findOne({_id : id})
    console.log(customerData)
    const archiveCustomerData = new ArchiveCustomerData({
        username : customerData.username,
        usersurname : customerData.usersurname,
        useremail : customerData.useremail,
        userphone : customerData.userphone,
        useradress : customerData.useradress,
        cardname : customerData.cardname,
        cardnumber : customerData.cardnumber,
        cardcvv : customerData.cardcvv,
        carddate : customerData.carddate,
       
        productName: customerData.productName,
        productPrice: customerData.productPrice
    })
    archiveCustomerData.save()

    await CustomerInfo.findByIdAndDelete(id)
        .then(result => {
            res.redirect('/adminOrder');
        })
        .catch(err => {
            console.log(err);
        });

}




module.exports = {
    getAdmin, postLogin, getAddProduct, postAddProduct, getProduct,getDeleteProduct,postUpdateProduct,getAdminOrder, sendMail, addArchive
}
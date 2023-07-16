const express = require('express')
const router = express.Router()
const Admin = require('../models/admins')
const jwt = require('jsonwebtoken')


router.get('/admin', (req,res) => {
    res.render('admin')
})

const createToken = async(id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn:'1d'})
}



router.post('/admin/login', async (req, res) => {
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
   

});

module.exports = router
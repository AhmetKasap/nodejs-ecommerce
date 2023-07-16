const express = require('express')
const router = express.Router()
const Admin = require('../models/admins')

router.get('/admin', (req,res) => {
    res.render('admin')
})

router.post('/admin/login', (req, res) => {
    console.log(req.body.username);
    console.log(req.body.userpassword);

    Admin.findOne().then(data => {
        if (req.body.username === data.username && req.body.userpassword === data.userpassword) {
            console.log("Giriş başarılı");
            res.redirect('/product')
        }
    });
});

module.exports = router
const express = require('express')
const router = express.Router()

router.get('/admin', (req,res) => {
    res.render('admin')
})

router.post('/admin-login', (req,res) => {
    const username = req.body.username
    const userpassword = req.body.userpassword
    console.log(username,userpassword)
})

module.exports = router
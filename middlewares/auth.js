const jwt = require('jsonwebtoken')
require('dotenv').config()


const authenticationToken = async (req,res,next) => {
    const token = req.cookies.jsonwebtoken   //* oluşturduğumuz token ı cookies den aldık

    if (token) { //* token var mı? varsa işleme gir yoksa admin sayfasına gönder
        jwt.verify(token, process.env.JWT_SECRET, (err) => { // token formatı doğru mu doğruysa next() yani sonraki işleme geç
            if(err) {
                res.redirect('/admin')
            }
            else{
                next()
            }
        })
    }
    else {
        res.redirect('/admin')
    }

}




module.exports = {
    authenticationToken
}
const mongoose = require('mongoose')


const customerSchema = new mongoose.Schema({
    username : {type: String, require : true},
    usersurname : {type: String, require : true},
    useremail : {type: String, require : true},
    userphone : {type: Number, require : true},
    useradress : {type: String, require : true},
    cardname : {type: String, require : true},
    cardnumber : {type: Number, require : true},
    cardcvv : {type: Number, require : true},
    carddate : {type: Number, require : true},
    productName : {type : [String], require : true},
    productPrice : {type : [Number], require : true}
})

const Customer = mongoose.model('CUSTOMERDATA',customerSchema )
module.exports = Customer
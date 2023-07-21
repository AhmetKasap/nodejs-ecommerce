const mongoose = require('mongoose')


const customerSchema = new mongoose.Schema({
    username : {type: String, require : true},
    usersurname : {type: String, require : true},
    useremail : {type: String, require : true},
    userphone : {type: Number, require : true},
    usercity : {type: String, require : true},
    useradress : {type: String, require : true},
    productId : {type : [mongoose.Types.ObjectId], require : true},
    productName : {type : [String], require : true},
    productPrice : {type : [Number], require : true},
    productCategories : {type : [String], require : true}
})

const Customer = mongoose.model('CUSTOMERDATA',customerSchema )
module.exports = Customer
const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    username : {type : String, require:true},
    userpassword : {type: String, require:true}
})


const AdminInfo = mongoose.model('ADMIN', adminSchema)

module.exports = AdminInfo
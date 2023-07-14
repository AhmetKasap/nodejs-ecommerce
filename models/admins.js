const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    username : {type : String, require:true},
    userpassword : {type: String, require:true}
})

const AdminPost = mongoose.model('ADMINPOST', adminSchema)

module.exports = AdminPost
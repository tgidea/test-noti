const mongoose = require('mongoose')
const expSchema = new mongoose.Schema({
    name : String,
    subscription: {
        type: String,
        unique: true
    }
});

module.exports = expSchema
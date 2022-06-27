const mongoose = require('mongoose')
const expSchema = new mongoose.Schema({
    name : String,
    subscription: {
        type: String,
        unique: true
    }
});

const secondSchemaModel = mongoose.model('contest1s',expSchema);

module.exports = secondSchemaModel;
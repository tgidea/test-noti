const mongoose = require('mongoose')
const dynamicSchema = (prefix)=> {
    const expSchema = new mongoose.Schema({
        name : {
            type: String,
            default: "Test"
        },
        subscription:{
            type: String,
            unique: true
        }         
    });
mongoose.model(prefix + "", expSchema, prefix);
}
module.exports = dynamicSchema
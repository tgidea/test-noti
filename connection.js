const mongoose = require('mongoose')
require('dotenv').config({ path: __dirname + '/config.env' });
const url = process.env.DATABASE;
// console.log(url);
const conn = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('success connection'))
    .catch((err) => console.log(err))
    module.exports=conn;
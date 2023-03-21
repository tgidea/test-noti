const path = require('path');
const axios = require('axios');
const rasta = path.join(__dirname, '../', 'config.env');
require('dotenv').config({ path: rasta });
const password = process.env.PASS;
const url = process.env.URL;

const receiveExcel = async(aray,platform)=>{
    const obj = {
        "data" : aray,
        platform,
        pass : `${password}`
    }
    await axios.post(`${url}`, obj);    
}
module.exports = receiveExcel
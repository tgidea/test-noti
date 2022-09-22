const path = require('path');
const axios = require('axios');
const { update } = require('../schema/schema');
const rasta = path.join(__dirname, '../', 'config.env');
require('dotenv').config({ path: rasta });
const password = process.env.PASS;
const url = process.env.URL;

const receiveExcel = async(aray,platform)=>{
    console.log(platform);
    const obj = {
        "data" : aray,
        platform,
        pass : `${password}`
    }
    let res = await axios.post(`${url}`, obj);    
}
module.exports = receiveExcel
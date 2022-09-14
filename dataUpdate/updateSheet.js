const path = require('path');
const axios = require('axios');
const { update } = require('../schema/schema');
const rasta = path.join(__dirname, '../', 'config.env');
require('dotenv').config({ path: rasta });
const password = process.env.PASS;
const url = process.env.URL;
const updateExcel = async (name, link, time , platform) => {
    try {
        let payload = { name, link, time , platform , pass : "helloji" };
                                        
    }
    catch (err) { console.log(err) }
}

const receiveExcel = async(aray,platform)=>{
    const obj = {
        "data" : aray,
        platform,
        pass : `${password}`
    }
    let res = await axios.post(`${url}`, obj);    
}
module.exports = receiveExcel
const path = require('path');
var FCM = require('fcm-node');
const rasta = path.join(__dirname, '../', 'config.env');
require('dotenv').config({ path: rasta });
var serverKey = `${process.env.SERVER_KEY}`;

function send(regTokens, response) {
    var fcm = new FCM(serverKey);
    var message = {
        registration_ids: regTokens,
        notification: {
            title: 'My Update',
            body: `${response}`,
            icon: "https://cdn-icons-png.flaticon.com/512/5278/5278658.png",
        },
               
    };
    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!" + err);
        }
        else {
            console.log(response);
        }
    });
}
module.exports = send;
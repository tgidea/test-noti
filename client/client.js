// const { send } = require("express/lib/response");

const public_keys = 'BIVj4YrGKo27YGVRf4oGmWEuQmKP3RU4-hpqYgiOA1euhIxTGww0tRira53W00qOunrM_6jimqHlKL3eKLZ2GQo';
const pushButton = document.getElementById('codechef');
const unsubscribeBtn = document.getElementById('unsubscribe');

const alert_msg = document.getElementById('alert_msg');

const isSubscribed = localStorage.getItem("subscribed");
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}
let count = 0;
async function sended() {
    try {
        const channel = document.getElementById('channel').value;
        const register = await navigator.serviceWorker.register('/worker.js', {
            scope: '/'
        });
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(public_keys)
        });
        localStorage.setItem("subscribed", JSON.stringify(subscription));
        fetch('/subscribe', {
            method: "POST",
            body: JSON.stringify({ channel, subscription }),
            headers: {
                "content-type": "application/json"
            }
        })
        .then(function(resp){
            return resp.json();
        })
        .then(function(data){            
            alert_msg.innerHTML = `${data.result}`;
            pushButton.disabled == true
            localStorage.setItem("subscribed", JSON.stringify(subscription));
        })
    }
    catch (err) {
        if (count == 0) {
            count = 1;
            console.log('trying again');
            await sended();
        }
        else if(count==1){
            count= count + 1;
            alert_msg.innerHTML = (`Please try again.`);
        }
        else{
            alert_msg.innerHTML = `Click <a href="help.html">here</a> if not able to subscribe`;   
        }
    }
}

pushButton.addEventListener('click', function () {
    if ('serviceWorker' in navigator) {
        const channel = document.getElementById('channel').value;
        if (channel.toString().trim().length > 0) {
            sended()
                .catch((err) => {
                    pushButton.disabled = false;
                    alert_msg.innerHTML = (`Please click again.`);
                    console.log(err);
                });
        }
        else {
            alert_msg.innerHTML = "Please fill carefully";
        }
    }
    else {
        alert_msg.innerHTML = "Check notification permission.";
    }
    document.getElementById('channel').value="";

})
unsubscribeBtn.addEventListener('click', unsubscribe);
async function unsubscribe() {
    const channelName = document.getElementById('channel').value;
    const subscription = localStorage.getItem('subscribed');
    if (channelName.toString().trim().length < 1) {
        return alert_msg.innerHTML = "Please fill carefully"
    }
    if (subscription == NaN || subscription == undefined || subscription == false || subscription == "NULL") {
        alert_msg.innerHTML = "Please subscribe first";
    }
    else {
        fetch('/unsubscribe', {
            method: "POST",
            body: JSON.stringify({ subscription, "channel":channelName }),
            headers: {
                "content-type": "application/json"
            }
        })
        .then(function(resp){
            return resp.json();
        })
        .then(function(data){            
            alert_msg.innerHTML = `${data.result}`;
        })
        document.getElementById('channel').value="";
    }

}
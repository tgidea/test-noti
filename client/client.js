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
            alert_msg.innerText = `${data.result}`;
            pushButton.disabled == true
            localStorage.setItem("subscribed", subscription);
        })
    }
    catch (err) {
        if (count == 0) {
            count = 1;
            console.log('trying again');
            await sended();
        }
        else {
            alert_msg.innerText = (`Please click again. Please ensure google push service is active if you are using brave browser`);
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
                    alert_msg.innerText = (`Please click again.`);
                    console.log(err);
                });
        }
        else {
            alert_msg.innerText = "Please fill carefully";
        }
    }
    else {
        alert_msg.innerText = "Check notification permission.";
    }

})
unsubscribeBtn.addEventListener('click', unsubscribe);
async function unsubscribe() {
    const channel = document.getElementById('channel').value;
    const endpoint = localStorage.getItem('subscribed');
    if (channel.toString().trim().length < 1) {
        return alert_msg.innerText = "Please fill carefully"
    }
    if (endpoint == NaN || endpoint == undefined || endpoint == false || endpoint == "NULL") {
        alert_msg.innerText = "Please subscribe first";
    }
    else {
        const out = await fetch('/unsubscribe', {
            method: "POST",
            body: JSON.stringify({ endpoint, channel }),
            headers: {
                "content-type": "application/json"
            }
        })
        alert_msg.innerText = `${out.result}`;
    }

}
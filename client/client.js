// const { send } = require("express/lib/response");

const public_keys = 'BIVj4YrGKo27YGVRf4oGmWEuQmKP3RU4-hpqYgiOA1euhIxTGww0tRira53W00qOunrM_6jimqHlKL3eKLZ2GQo';
const pushButton = document.getElementById('codechef');
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
pushButton.addEventListener('click', function () {
    pushButton.disabled = true;
    if ('serviceWorker' in navigator) {
        sended()
            .catch((err) => {
                pushButton.disabled = false;
                alert(`Please click again.`);
                console.log(err);
            });
    }
})

async function sended() {
    //register service worker
    if (isSubscribed==null || isSubscribed==undefined || isSubscribed==NaN || (  confirm('Do you want to subscribe again?'))  ) {
        try {
            const register = await navigator.serviceWorker.register('/worker.js', {
                scope: '/'
            });
            // document.getElementById('progress').innerText=`${register}`
            console.log(register);
            //register push
            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                //public vapid key
                applicationServerKey: urlBase64ToUint8Array(public_keys)
            });
            // document.getElementById('progress').innerText=`fetching`;
            //Send push notification
            console.log('fetching');
            const name = prompt('Enter your name');
            if (name.length > 2) {
                await fetch("/subscribe", {
                    method: "POST",
                    body: JSON.stringify({ subscription, "name": `${name}` }),
                    headers: {
                        "content-type": "application/json"
                    }
                });
                if (pushButton.disabled == true) {
                    localStorage.setItem("subscribed", true);
                    alert('Successfully Subscribed');
                }
            }
        }
        catch (err) {
            console.log(err);
            alert(`Please click again.          Please ensure google push service is active if you are using brave browser`);
        }
    }
}
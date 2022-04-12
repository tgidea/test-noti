// const { send } = require("express/lib/response");

const public_keys = 'BIVj4YrGKo27YGVRf4oGmWEuQmKP3RU4-hpqYgiOA1euhIxTGww0tRira53W00qOunrM_6jimqHlKL3eKLZ2GQo';
const pushButton = document.getElementById('codechef');
const unsubscribeBtn = document.getElementById('unsubscribe');
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
const namee = [];
pushButton.addEventListener('click', function () {
    // pushButton.disabled = true;
    if ('serviceWorker' in navigator) {
        namee.push(prompt('Enter a unique name using alphanumeric keys'));
        sended()
            .catch((err) => {
                pushButton.disabled = false;
                alert(`Please click again.`);
                console.log(err);
            });
    }
})
let count = 0;
async function sended() {
    //register service worker
    if (isSubscribed == null || isSubscribed == undefined || isSubscribed == NaN || isSubscribed == 'false' || (confirm('Do you want to subscribe again?'))) {
        try {
            const register = await navigator.serviceWorker.register('/worker.js', {
                scope: '/'
            });
            //register push
            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                //public vapid key
                applicationServerKey: urlBase64ToUint8Array(public_keys)
            });
            if (namee[(namee.length) - 1].length > 2) {
                const out=await fetch("/subscribe", {
                    method: "POST",
                    body: JSON.stringify({ subscription, "name": `${namee[(namee.length) - 1]}` }),
                    headers: {
                        "content-type": "application/json"
                    }
                });
                pushButton.disabled == true
                localStorage.setItem("subscribed", true);
                if(out.status==200){
                    alert('Successfully Subscribed');
                }
                else{
                    alert('Subscription failed due to some error');
                }
            }
        }
        catch (err) {
            if (count == 0) {
                count++;
                console.log('trying again');
                await sended();
            }
            else {
                alert(`Please click again. Please ensure google push service is active if you are using brave browser`);
            }
        }
    }
}
unsubscribeBtn.addEventListener('click', unsubscribe);
async function unsubscribe() {
    const name = prompt('Enter the unique name connected with your subscription.');
    if (name.length > 2) {
        try {
            const outputt = await fetch("/unsubscribe", {
                method: "POST",
                body: JSON.stringify({ name }),
                headers: {
                    "content-type": "application/json"
                }
            });

            if (outputt.status == 200) {
                localStorage.setItem('subscribed', 'false');
                alert('Successfull cancelled the subscription connected with this name.');
            }
            else {
                throw ('Failed to unsubscribe');
            }
        }
        catch (err) {
            console.log(err);
            alert('Sorry, already deleted. Please subscribe again or try again');
        }
    }
}
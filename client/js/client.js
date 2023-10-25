

const public_keys = 'BIVj4YrGKo27YGVRf4oGmWEuQmKP3RU4-hpqYgiOA1euhIxTGww0tRira53W00qOunrM_6jimqHlKL3eKLZ2GQo';
const pushButton = document.getElementById('codechef');
const unsubscribeBtn = document.getElementById('unsubscribe');

const alert_msg = document.getElementById('alert_msg');

const isSubscribed = localStorage.getItem("subscribed");
async function sendToken(token) {
    try {
        const channel = document.getElementById('channel').value;
        fetch('channel/subscribe', {
            method: "POST",
            body: JSON.stringify({ channel, subscription: token }),
            headers: {
                "content-type": "application/json"
            }
        })
            .then(function (resp) {
                return resp.json();
            })
            .then(function (data) {
                alert_msg.innerHTML = `${data.result}`;
                document.getElementById('channel').value = "";
                pushButton.disabled == true
                localStorage.setItem("subscribed", JSON.stringify(token));
            })
    }
    catch (err) {
        alert_msg.innerHTML = `Click <a href="help.html">here</a> if not able to subscribe`;
    }
}
const firebaseConfig = {
    apiKey: "AIzaSyDKGsoV344Ximd8NBJhilNOUp5rg8WVhYY",
    authDomain: "notification-167c9.firebaseapp.com",
    projectId: "notification-167c9",
    storageBucket: "notification-167c9.appspot.com",
    messagingSenderId: "835809630294",
    appId: "1:835809630294:web:3e9b2b8e0f66a4225843f7",
    measurementId: "G-GMM91N2NXG",
};
firebase.initializeApp(firebaseConfig);

const getToken = async () => {

    const messaging = firebase.messaging();
    Notification.requestPermission().then(permission => {
        if (permission == 'granted') {
            messaging.getToken({ vapidKey: "BLz6MaZ-JRFL77u_XhsBUwpiupOEM8H7WeAWv4LlYvMETt2eeqOZK2nUzN17XkjXzxAYYMHtf1Y9q1Xmw-Rf2PE" }).then(currentToken => {                                
                sendToken(currentToken);                
                return currentToken;
            })
        }
        else return null;
    })
    messaging.onMessage (res => {
        console.log(res);
    })
    // messaging.onBackgroundMessage((payload) => {
    //     // Customize notification here
    //     const notificationTitle = 'My Update Notification';
    //     const notificationOptions = {
    //       body: 'New Message : ',
    //       icon: '/firebase-logo.png'
    //     };
    //     self.registration.showNotification(notificationTitle, notificationOptions);
    //   });
}
pushButton.addEventListener('click', async () => {
    const channel = document.getElementById('channel').value;
    if (channel.toString().trim().length > 0) {
        await getToken();
    }
    else {
        alert_msg.innerHTML = "Please fill carefully";
    }
})

unsubscribeBtn.addEventListener('click', unsubscribe);
async function unsubscribe() {
    const channelName = document.getElementById('channel').value;
    const subscription = JSON.parse(localStorage.getItem('subscribed'));
    if (channelName.toString().trim().length < 1) {
        return alert_msg.innerHTML = "Please fill carefully"
    }
    if (subscription == NaN || subscription == undefined || subscription == false || subscription == "NULL") {
        alert_msg.innerHTML = "Please subscribe first";
    }
    else {
        fetch('channel/unsubscribe', {
            method: "POST",
            body: JSON.stringify({ subscription, "channel": channelName }),
            headers: {
                "content-type": "application/json"
            }
        })
            .then(function (resp) {
                return resp.json();
            })
            .then(function (data) {
                alert_msg.innerHTML = `${data.result}`;
            })
        document.getElementById('channel').value = "";
    }

}
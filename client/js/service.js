
const alert_msg = document.getElementById("alert_msg");
const messageCount = document.getElementById("messageCount");
const noti_req = document.getElementById("notification_request");
noti_req.addEventListener("submit", async (e) => {
    e.preventDefault();
    const channel = document.getElementById("channel");
    const password = document.getElementById("password");
    const message = document.getElementById("message");

    if (
        channel.value.toString().length < 1 ||
        password.value.toString().length < 1 ||
        message.value.toString().length < 1
    ) {
        alert_msg.innerHTML = "Please fill carefully";
        return;
    }

    try {
        fetch("/notification/sendnoti", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                channel: channel.value.toString(),
                password: password.value.toString(),
                message: message.value.toString(),
            }),
        })
            .then(function (resp) {
                console.log("resp");
                return resp.json();
            })
            .then(function (data) {
                console.log(data);
                alert_msg.innerHTML = data.result;
                password.value = "";
                message.value = "";
            });
    } catch (err) {
        console.log(err);
        alert_msg.innerHTML = "There is some server error.";
    }
});

function countText(value) {
    if (value.length >= 43) {
        const inputMsg = document.getElementById('message');
        const msg = inputMsg.value.substring(0, 42);
        console.log(msg);
        inputMsg.value = msg;
    } else {
        messageCount.innerText = `${42 - value.length}/42`;
    }
}    
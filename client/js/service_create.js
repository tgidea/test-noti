const alert_msg = document.getElementById("alert_msg");

const noti_req = document.getElementById("notification_request");
noti_req.addEventListener("submit", async (e) => {
  e.preventDefault();
  const channel = document.getElementById("channel");
  const password = document.getElementById("password");

  if (
    channel.value.toString().length < 1 ||
    password.value.toString().length < 1
  ) {
    alert_msg.innerHTML = "Please fill carefully";
    return;
  }

  try {
    fetch("channel/create", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        channel: channel.value.toString(),
        password: password.value.toString(),
      }),
    })
      .then(function (resp) {
        console.log("resp");
        return resp.json();
      })
      .then(function (data) {
        console.log(data);
        alert_msg.innerHTML = data.result;
      });
    password.value = "";
  } catch (err) {
    console.log(err);
    alert_msg.innerHTML = "There is some server error.";
  }
});
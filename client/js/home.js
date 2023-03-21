$(document).ready(function () {
    // Add smooth scrolling to all links in navbar + footer link
    $(".navbar a, footer a[href='#myPage']").on('click', function (event) {        
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 900, function () {
                window.location.hash = hash;
            });
        }
    });
    $(window).scroll(function () {
        $(".slideanim").each(function () {
            var pos = $(this).offset().top;
            var winTop = $(window).scrollTop();
            if (pos < winTop + 600) {
                $(this).addClass("slide");
            }
        });
    });
})


const name = document.getElementById('name');
const email = document.getElementById('email');
const comment = document.getElementById('comments');
const noti = document.getElementById('noti');
const clear = async () => {
    if (name.value == "" || email.value == "" || comment.value == "") {
        document.getElementById('noti').innerText = "Please fill carefully";
        return;
    }
    name.value = "";
    email.value = "";
    comment.value = "";
}
document.getElementById('contactform').addEventListener('submit', function (e) {
    e.preventDefault();
    if (name.value == "" || email.value == "" || comment.value == "") {
        document.getElementById('noti').innerText = "Please fill carefully";
        return;
    }
    fetch("message/formsubmit", {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            'name': name.value.toString(),
            'email': email.value.toString(),
            'comment': comment.value.toString(),
        }),
    })
        .then((resp) => {
            return resp.json();
        })
        .then((data) => {
            noti.innerText = `${data.result}`;
            noti.innerHTML += `<br>We will contact you soon.`;
            clear();
        })
});

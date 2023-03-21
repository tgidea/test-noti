const showTime = function (data) {
    
    const setTime = setInterval(function () {
        const tim = 180 - Math.ceil((Date.now() - data) / 1000);
        var ans;
        if (tim == NaN || tim == undefined) {
            ans = "";
            return;
        }
        else if (tim < 1) {
            ans = "Refresh Now";
            clearInterval(setTime);
        }
        else if (tim < 5 && tim > 0) {
            ans = `Refreshing in ${tim} seconds `;
        }
        else {
            ans = `Time left to update :  ${tim} seconds `
        }
        if (ans != undefined && ans != NaN) {
            const timeStamp = document.getElementById('lastupd').innerHTML = ans;
        }
    }, 1000);
}

const changeTime = function (str) {
    var num = "", num2 = "", carry = 0, actual = "", i;
    const len = str.length;
    for (i = len - 1; i > len - 5; i--) {
        if (str[i] == ':') {
            for (var j = i - 1; j >= i - 2; j--) {
                num2 += str[j];
            }
            break;
        }
        else {
            num += str[i];
        }
    }
    var minute = parseInt(num.split('').reverse().join(''));
    var hour = parseInt(num2.split('').reverse().join(''));
    minute += 30;
    if (minute > 60) {
        minute = minute - 60;
        hour += 3;
    }
    else {
        hour += 2;
    }
    for (var j = 0; j < i - 2; j++) {
        actual += str[j];
    }
    actual += " " + hour + ":" + minute;
    return actual;
}

const showData = (articles) => {
    const artitem = articles;
    
    var items_list = document.getElementById('items-list');
    if (artitem.length > 0) {
        // showTime(articles[0].codePrevUpd);

        for (var i = 0; i < artitem.length; i++) {
            // var time = changeTime(artitem[i].time.toString());
            var output = "";
            output += `
    <div class="card text-center" style="border-color:#f4511e;">
     <div class="card-body ">
     <p class="card-text font-weight-bold btn-color card-header ">${artitem[i].name}</p>
     <p class="card-text card-header ">Duration : ${artitem[i].duration}</p>
     <p class="card-text card-header "> ${artitem[i].toStart}</p>
     <p class="card-text card-header "><a style="border: 1px solid #f4511e;" href="${artitem[i].link}" class="btn btn-color">${artitem[i].time}  <sup>IST</sup></a></p>
       </div>
     </div>`
            items_list.innerHTML += output;
        }
    }
    else{
        items_list.innerHTML += `
        <div class="container text-center"><h5>No eventes are scheduled for now</h5></div>
        `
    }
}
const fetching = () => {
    try {
        fetch("codeforces.json")
            .then(function (resp) {
                return resp.json();
            })
            .then(function (data) {
                showData(data)
            });
    }
    catch (err) {
        console.log(err);
    }
}
// document.addEventListener('DOMCONTENTLOADED', fetching());
fetching();

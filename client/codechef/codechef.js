
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

const showData = (articles) => {
    const artitem = articles;
    var items_list = document.getElementById('items-list');
    if (artitem.length > 0) {
        // showTime(articles[0].codePrevUpd);

        for (var i = 0; i < artitem.length; i++) {
            var output = "";
            output += `
    <div class="card text-center border-color" style="border-color:#f4511e;">
     <div class="card-body ">
     <p class="card-text btn-color font-weight-bold card-header ">${artitem[i].name}</p>
     <p class="card-text card-header ">${artitem[i].day} ${artitem[i].month} ${artitem[i].time}  <sup>IST</sup></p>
    <a href="${artitem[i].link}" class="btn btn-color" style="border-color:#f4511e;">Set reminder</a>
       </div>
     </div>`
            items_list.innerHTML += output;
        }
    }
    else {
        items_list.innerHTML = `
        <div class="container text-center"><h5>No eventes are scheduled for now</h5></div>
        `
    }
}
const fetching = () => {
    try {
        fetch("codechef.json")
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

const showData = (articles) => {
    const artitem = articles;
    var items_list = document.getElementById('items-list');
    if (artitem.length > 0) {
        for (var i = 0; i < artitem.length; i++) {
            var output = "";
            output += `
    <div class="card text-center border-color">
     <div class="card-body ">
     <p class="card-text font-weight-bold color card-header ">${artitem[i].name}</p>
     <p class="card-text card-header "><a href="${artitem[i].timeLink}" class="btn ">${artitem[i].time}<sup>IST</sup> </a></p>
     <p class="card-text card-header "><a href="${artitem[i].link}">Contest Page</a></p>
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
        fetch("<%=platform %>.json")
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

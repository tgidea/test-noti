const changeTime = function (str) {

    var aray = str.split(" ");
    if(aray.length<2)return str;
    
    var time = ""+aray[1];
    time = time.split(':');
    var hrs = parseInt(time[0]);
    var min = parseInt(time[1]);
    if(min>=30){
        min = "00";
        hrs += 1;
    }
    else{
        min += 30;
    }
    hrs += 5;
    if(hrs>=12){
        hrs = hrs-12;
        if(aray[2]=="PM"){
            aray[2]="AM";
            var dayIdx = {
                "sunday" : 0,
                "monday" : 1,
                "tuesday" : 2,
                "wednesday" : 3,
                "thursday" : 4,
                "Friday" : 5,
                "saturday" : 6
            }
            var day = ['Sunday', 'Monday' ,'Tuesday','Wednesday','Thursday','Friday', 'Saturday' ];
            aray[0] = day[ (dayIdx[(""+aray[0]).toLowerCase()]+1)%7 ];            
        }
        else aray[2]="PM";
    }
    return "" + aray[0] + " " + hrs + ":" + min + " " + aray[2] +" IST";  
}

const showData = (articles) => {
    const artitem = articles; 
    var items_list = document.getElementById('items-list');
    if (artitem.length > 0) {        

        for (var i = 0; i < artitem.length; i++) {
            var time = changeTime(artitem[i].time.toString());
            var output = "";
            output += `
    <div class="card text-center" style="border-color:#f4511e;">
     <div class="card-body ">
        <p class="card-text font-weight-bold btn-color card-header "><a style="border: 1px solid #f4511e;" href="${artitem[i].link}" class="btn btn-color">${artitem[i].name}</a></p>     
        <p class="card-text card-header ">${time}</p>
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
        fetch("leetcode.json")
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

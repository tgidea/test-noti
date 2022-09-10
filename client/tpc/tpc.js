
const showData = (articles) => {
    const artitem = articles;
    
    var items_list = document.getElementById('items-list');
    if (artitem.length > 0) {        

        for (var i = 0; i < artitem.length; i++) {            
            var output = "" , colorr = "white" , backColor = "#f4511e";
            var inter = artitem[i].data.toString().toLowerCase();
            var initial = artitem[i].data , end = "";
            var idx1 = inter.indexOf('drive') , idx2 = inter.indexOf('result') ;
            try{
                if(idx1>0){
                    colorr = "#f3825f";
                    backColor = "black"
                }
                else if(idx2>0){
                    colorr = "#e7fa05";
                    backColor = "black";
                    initial = inter.slice(0,idx2+7);
                    end = inter.slice(idx2+6 , idx2.length);                
                }
            }
            catch(err){
                console.log(err);
            }          
            console.log(initial,end);  
            output += `
    <div class="card text-center" style="border-color:#f4511e;">
     <div class="card-body ">
     <p class="card-text font-weight-bold btn-color card-header "><a target="_blank" style=" color : ${backColor} ;border: 1px solid #f4511e; background-color:${colorr}" href="${artitem[i].link}" class="btn btn-color">${initial} <span style="font-weight: bolder;
     color: #1305fa;">${end}</span> </a></p>
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
        fetch("tpc.json")
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
fetching();

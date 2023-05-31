let url_id = String(getParam("id"));
let talking_about = void(0)
let change_talking_count = 1
var itemData = void(0)

//追加///////////////
var clientID = localStorage.getItem("SetagaQuestClientID")


$(function(){
    console.log(clientID)
    if (clientID === null){
        $("#notCustomer").show();
            return;
    } else {
        var postData = {
            "type": "Quiz",
            "url_id": url_id,
            "clientID": clientID
        }

        $.post("/init", postData).done(res => {
            console.log(res)
            if(res === "not customer"){
                $("#notCustomer").show();
                return;

            } else if(res === "incorrect ID"){
                $("#badRequest").show();
                $("#topTitle").text("Bad Request");
                return;

            } else if((String(res).includes("claimed item"))){
                var _alrHavingItemName = res.replace("claimed item", "")
                $("#claimed-item").show();
                $("#claimed-item-description-sub").text("既にこのイベントを完了しています(" + _alrHavingItemName + ")")
                return;
            } else {
                itemInfo = res;
                talking_about = itemInfo["talk_about"]
                $("#main").show();
                $("#serihu").text(talking_about[0]);
                var status = itemInfo["ItemStatus"];
                var clientInfo = {
                    "items": {
                        "clientID": clientID,
                        "itemName": String(itemInfo["ItemName"]),
                        [itemInfo["ItemName"]]: {
                            "base_damage": status["baseDmg"],
                            "attributes": status["attributes"],
                        }
                    }
                };
                $.post("/data", clientInfo);
            }
        })
    }
})
/////////////


function talking_change(){
    try{
        $("#serihu").text(talking_about[change_talking_count]);
        change_talking_count += 1
    } catch(e){
        return;
    }
}























































































function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
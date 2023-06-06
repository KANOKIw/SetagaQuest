let url_id = String(getParam("id"));
let talking_about = void(0);
let change_talking_count = 1;
var itemData = void(0);
var endsAt
var allEndsAt

//追加///////////////
var clientID = localStorage.getItem("SetagaQuestClientID");


$(function(){
    // お客さんのブラウザがローカルストレージ使用可能か/不可の場合IPアドレスで保存
    if (typeof localStorage !== 'undefined') {
        try {
            localStorage.setItem('dummy', '1');
            if (localStorage.getItem('dummy') === '1') {
                localStorage.removeItem('dummy');
                // 使用可能(これより下は使用不可)
            } else {
                clientID = "IP";
            }
        } catch(e) {
            clientID = "IP";
        }
    } else {
        clientID = "IP";
    }

    console.log(clientID)
    $.post("/getEndsAt", null).done(res => {
        console.log(res)
        endsAt = res["endsAt"]
        allEndsAt = res["allEndsAt"]

        if (clientID === null){
            $("#notCustomer").show();
            var countDownDate = new Date(allEndsAt).getTime();
            var countdown = setInterval(function() {
                var now = new Date().getTime();
                var distance = countDownDate - now;

                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                if (days === 0 && minutes === 0 && hours === 0){
                    $("#countDownNCM").text(`次の開催: 約 ${seconds}秒 後`)
                } else if (hours === 0 && days === 0){
                    $("#countDownNCM").text(`次の開催: 約 ${minutes}分 ${seconds}秒 後`)
                } else if (days === 0 && !(hours === 0) && !(minutes === 0)){
                    $("#countDownNCM").text(`次の開催: 約 ${hours}時間 ${minutes}分 ${seconds}秒 後`)
                } else {
                    $("#countDownNCM").text(`次の開催: 約 ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒 後`)
                }

                if (distance <= 120000) {
                    console.log("まもなく始まります");
                    $("#countDownNCM").css("color", "red")
                    $("#countDownNCM").text(`まもなく始まります: 4Fに向かいましょう!`)
                }
                if (distance <= 0) {
                    clearInterval(countdown);
                    $("#countDownNCM").css("color", "red")
                    $("#countDownNCM").text(`先ほど始まってしまいました。このサイトを再読み込みして次を確認しましょう！`)
                }
            }, 1000);
            return;
        } else {
            var p = {
                "clientID": clientID
            }
            $.post("/getNick", p).done(res => {
                if (!(res === null)){
                    $("#hello").text(res + "さん、こんにちは!")
                } else {
                    $("#hello").hide()
                }
            })

            var postData = {
                "type": "Quiz",
                "url_id": url_id,
                "clientID": clientID
            }

            $.post("/init", postData).done(res => {
                console.log(res)
                if(res === "not customer"){
                    $("#notCustomer").show();
                    var countDownDate = new Date(allEndsAt).getTime();
                    var countdown = setInterval(function() {
                        var now = new Date().getTime();
                        var distance = countDownDate - now;

                        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
                        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                        if (days === 0 && minutes === 0 && hours === 0){
                            $("#countDownNCM").text(`次の開催: 約 ${seconds}秒 後`)
                        } else if (hours === 0 && days === 0){
                            $("#countDownNCM").text(`次の開催: 約 ${minutes}分 ${seconds}秒 後`)
                        } else if (days === 0 && !(hours === 0) && !(minutes === 0)){
                            $("#countDownNCM").text(`次の開催: 約 ${hours}時間 ${minutes}分 ${seconds}秒 後`)
                        } else {
                            $("#countDownNCM").text(`次の開催: 約 ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒 後`)
                        }

                        if (distance <= 120000) {
                            console.log("まもなく始まります");
                            $("#countDownNCM").css("color", "red")
                            $("#countDownNCM").text(`まもなく始まります: 4Fに向かいましょう!`)
                        }
                        if (distance <= 0) {
                            clearInterval(countdown);
                            $("#countDownNCM").css("color", "red")
                            $("#countDownNCM").text(`先ほど始まってしまいました。このサイトを再読み込みして次を確認しましょう！`)
                        }
                    }, 1000);
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
                    }
                    /*会話ではアイテムもらわない予定
                    $.post("/data", clientInfo);*/
                    var countDownDate = new Date(endsAt).getTime();
                    var countdown = setInterval(function() {
                        var now = new Date().getTime();
                        var distance = countDownDate - now;

                        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                        if (days === 0 && minutes === 0 && hours === 0){
                            $("#countDown").text(`終了まで: ${seconds}秒`)
                        } else if (hours === 0 && days === 0){
                            $("#countDown").text(`終了まで: ${minutes}分 ${seconds}秒`)
                        } else if (days === 0 && !(hours === 0) && !(minutes === 0)){
                            $("#countDown").text(`終了まで: ${hours}時間 ${minutes}分 ${seconds}秒`)
                        } else {
                            $("#countDown").text(`終了まで: ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`)
                        }

                        if (distance <= 0) {
                            clearInterval(countdown);
                            console.log("タイムオーバー");
                            $("#countDown").css("color", "red")
                            $("#countDown").text(`タイムオーバー: 直ちに4Fに戻ってください`)
                        }
                    }, 1000);
                }
            })
        }
    })
})


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
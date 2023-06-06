var clientID = localStorage.getItem("SetagaQuestClientID");
var postData = {
    "clientID": clientID
}
var endsAt
var allEndsAt
$(function(){
    $("#notCustomer").hide()
    $("#map_layer").hide()
    $.post("/getEndsAt", null).done(res => {
        console.log(res)
        endsAt = res["endsAt"]
        allEndsAt = res["allEndsAt"]
    })
    var postData = {
        "type": "Quiz",
        "clientID": clientID
    }
  
    $.post("/init", postData).done(res => {
        if (res === "not customer"){
            $("#notCustomer").show()
            var countDownDate = new Date(allEndsAt).getTime();
            var countdown = setInterval(function() {
                var now = new Date().getTime();
                var distance = countDownDate - now;

                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);
                console.log(distance)
                
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
            $("#main").show()
            $("#goToOtherURL-nick").show()
            $.post("/clientData", postData).done(res => {
                var clientdata = res
                $("#helloDiv").show()
                $("#hello").text(clientdata["nickName"] + "さん、こんにちは!")
                
                clientitems = [clientdata["items"]]

                clientitems.sort((a, b) => {
                    return Number.parseInt(a["base_damage"]) < Number.parseInt(b["base_damage"]) ? -1 : 1;
                });

                console.log(clientitems)
                var noneImage = "https://cdn.discordapp.com/icons/1101399573991268374/a_c3ede8a7240af692d46e1d786b13dbb8.gif?size=1024"
                var iteminfo
                var itemImage
                try{
                    var squareheight = Object.keys(clientitems[0]).length * 550 + 100
                } catch(e){
                    var squareheight = 580
                    $("#loading").hide()
                }
                
                for (let itemname in clientitems[0]){
                    console.log(itemname)
                    iteminfo = clientdata["items"][itemname]
                    itemImage = clientdata["items"][itemname]["imageURL"]
                    console.log(itemImage)
                    var itemAttributes = ""
                    for (var element of iteminfo["attributes"]) {
                        itemAttributes += element + ', ';
                    }
                    var itemStatus = "基礎攻撃力: " + iteminfo["base_damage"] + ", 属性: " + itemAttributes;
                    $("#clientItems").append(`<img src=${itemImage} alt="itemImage" width="40%"><div>${itemname}<br>${itemStatus}</div><br>`)      
                }
                console.log(squareheight)
                $(".square").css("height", squareheight)
                if (clientitems[0] === (null || undefined)){
                    $("#clientItems").append(`<img src=${noneImage} alt="itemImage" width="40%"><div>まだアイテムを獲得していないようです！<br>頑張って見つけてください！</div><br>`);
                    $(".square").css("height", 550)
                }
                $("#loading").text("あなたの所持アイテム")

                var countDownDate = new Date(endsAt).getTime();
                var countdown = setInterval(function() {
                var now = new Date().getTime();
                var distance = countDownDate - now;

                var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                if (days === 0 && minutes === 0 && hours === 0){
                    $("#countDown").text(`次の開催: 約 ${seconds}秒 後`)
                } else if (hours === 0 && days === 0){
                    $("#countDown").text(`次の開催: 約 ${minutes}分 ${seconds}秒 後`)
                } else if (days === 0 && !(hours === 0) && !(minutes === 0)){
                    $("#countDown").text(`次の開催: 約 ${hours}時間 ${minutes}分 ${seconds}秒 後`)
                } else {
                    $("#countDown").text(`次の開催: 約 ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒 後`)
                }

                if (distance <= 0) {
                    clearInterval(countdown);
                    console.log("タイムオーバー");
                    $("#countDown").css("color", "red")
                    $("#countDown").text(`タイムオーバー: 直ちに4Fに戻ってください`)
                }
            }, 1000);
        })}
    })
})

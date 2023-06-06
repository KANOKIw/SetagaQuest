var clientID = localStorage.getItem("SetagaQuestClientID");
var postData = {
    "clientID": clientID
}
var endsAt
var allEndsAt
$(function(){
    $("#notCustomer").hide()
    $("#map_layer").hide()
    var postData = {
        "type": "Quiz",
        "clientID": clientID
    }

  
        $.post("/getEndsAt", null).done(res => {
            console.log(res)
            endsAt = res["endsAt"]
            allEndsAt = res["allEndsAt"]
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
                    $.post("/clientData", postData).done(res => {
                    var clientdata = res
                    $("#helloDiv").show()
                    $("#goToOtherURL-nick").show()
                    $("#hello").text(clientdata["nickName"] + "さん、こんにちは!")
                    $("#map_layer").show()
                    $("#countDown").show()
                    
                    // クイズスコア定義
                    let quizscore_test_poriS4 = clientdata["items"]["ポリジュース薬"]["base_damage"]
                    console.log(quizscore_test_poriS4)

                    // 進行状況表示
                    let total_4f = 0
                    if (quizscore_test_poriS4 === undefined){} else {
                        total_4f += 1
                        console.log(total_4f)
                    }

                    
                    // クイズスコア反映
                    if (quizscore_test_poriS4 < 200){
                        $("#map_4f_1_D").show()
                    } else if (quizscore_test_poriS4 == 200){
                        $("#map_4f_1_C").show()
                    } else if (quizscore_test_poriS4 == 300){
                        $("#map_4f_1_B").show()
                    } else if (quizscore_test_poriS4 == 400){
                        $("#map_4f_1_A").show()
                    } 
                    



                    
                    countDownToend("#countDown")
                })
            }
        })
    })
})


function countDownToend(elementID){
    var countDownDate = new Date(endsAt).getTime();
    var countdown = setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (days === 0 && minutes === 0 && hours === 0){
            $(elementID).text(`終了まで: ${seconds}秒`)
        } else if (hours === 0 && days === 0){
            $(elementID).text(`終了まで: ${minutes}分 ${seconds}秒`)
        } else if (days === 0 && !(hours === 0) && !(minutes === 0)){
            $(elementID).text(`終了まで: ${hours}時間 ${minutes}分 ${seconds}秒`)
        } else {
            $(elementID).text(`終了まで: ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`)
        }

        if (distance <= 0) {
            clearInterval(countdown);
            console.log("タイムオーバー");
            $(elementID).css("color", "red")
            $(elementID).text(`タイムオーバー: 直ちに4Fに戻ってください`)
        }
    }, 1000);
}
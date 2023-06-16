var clientID = localStorage.getItem("clientID");
var postData = {
    "clientID": clientID
}
var endsAt
var nextStartsAt
var team = localStorage.getItem("team")
console.log("team: " + team)
$(function(){
    $("#notCustomer").hide()
    $("#map_layer").hide()
    var postData = {
        "type": "Quiz",
        "clientID": clientID,
        "url": window.location.href,
        "team": team
    }

    var pd = {
        "team": team
    }
        $.post("/getEndsAt", pd).done(res => {
            console.log(res)
            endsAt = res["endsAt"][team]
            nextStartsAt = res["nextStartsAt"]
            $.post("/init", postData).done(res => {
                if (res === "not customer"){
                    $("#notCustomer").show()
                    var countDownDate = new Date(nextStartsAt).getTime();
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
                            if (days === 0 && minutes === 0 && hours === 0){
                                $("#countDownNCM").text(`まもなく始まります: 約 ${seconds}秒 後`)
                            } else if (hours === 0 && days === 0){
                                $("#countDownNCM").text(`まもなく始まります: 約 ${minutes}分 ${seconds}秒 後`)
                            }
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
                    try {
                    let quizscore_test_poriS4 = clientdata["items"]["undefined2"]

                    var total_4f = 0
                    if (quizscore_test_poriS4 === undefined){} else {
                        total_4f += 1
                        }
                    } catch {
                        $("#achieved_numbers_4f").text("エラー:お前は誰やねん")
                    } finally {
                        $("#achieved_numbers_4f").text(total_4f + "/15(決まってない)")
                    }

                    // ポップアップ表示
                    $(function(){
                        $('.js-modal-open').each(function(){
                            $(this).on('click',function(){
                                var target = $(this).data('target');
                                var modal = document.getElementById(target);
                                $(modal).fadeIn();
                                return false;
                            });
                        });
                        $('.js-modal-close').on('click',function(){
                            $('.js-modal').fadeOut();
                            return false;
                        }); 
                    });
                  
                    // ポップアップ書き換え to do kレベルごとに見た目変えるやつ
                    $(function(){
                        if ((clientdata["finishedevents"]).includes("4353")){
                            $("#modal_text_4f_1").text("定義されています")

                            var kago = void(0)// = undefined
                            for (let k of clientdata["kagos"]){
                                if (k["kagoname"] === "１ばんめっっっy"){
                                    kago = k
                                    break
                                }
                            }                                                                                                                
                            kago ? console.log(kago["kagolevel"]) : null
                        } else {
                            $("#modal_text_4f_1").prepend('<img src="https://cdn.discordapp.com/icons/1101399573991268374/a_c3ede8a7240af692d46e1d786b13dbb8.gif?size=1024">')
                        }
                    })


                    
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


let btn_intr = 0;
var correct = 0;
var wrong = 0;
var lastQuestion = 0;
var nickName = void(0);
var tof = false
var endsAt
var nextStartsAt
var fromcache = false
var previousdata


var url_id = String(getParam("id"));
var url_team = String(getParam("team"))
const nickName_URL_ID = "wawawa"
if (url_id === "nickName"){
    url_id = "badRequest";
} else if (url_id === nickName_URL_ID){
    url_id = "nickName";
} 

var badrequest = false
var team
if (url_team == "null"){
    if (url_id != "nickName"){
        team = localStorage.getItem("team")
    } else {
        badrequest = true
    }
} else {
    var zC = 0
    var aC = 0
    var tC = 0
    var dC = 0
    var gC = 0
    var jC = 0
    var intC = 0

    for (var s of Array.from(url_team)){
        if (s == "a"){
            aC++
        }
        if (s == "z"){
            zC++
        }
        if (String(Number.parseInt(s)) != "NaN"){
            intC++
        }
        if (s == "t"){
            tC++
        }
        if (s == "d"){
            dC++
        }
        if (s == "g"){
            gC++
        }
        if (s == "j"){
            jC++
        }
    }
 
    if (aC >= 2 && intC >= 2 && zC >= 2){
        team = "1"
    } else if (tC >= 2 && dC >= 2){
        team = "2"
    } else if (gC >= 2 && jC >= 2){
        team = "3"
    } else {
        badrequest = true
    }
}
console.log("team: " + team)


var kagoinfo;
var clientID = localStorage.getItem("clientID");


function sleep(waitMsec) {
    var startMsec = new Date();
    while (new Date() - startMsec < waitMsec);
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


function setCorrectCls(w){
    var selOne = document.getElementById("selectionOne")
    var selTwo = document.getElementById("selectionTwo")
    var selThree = document.getElementById("selectionThree")
    if (selOne.textContent.slice(2) === w){
        $("#One").addClass("correct").css("padding-left", "341px");
        $("#selOneC").addClass("correctDIV");
        $("#selOneC").text("〇");
    } else if(selTwo.textContent.slice(2) === w){
        $("#Two").addClass("correct").css("padding-left", "341px");
        $("#selTwoC").addClass("correctDIV");
        $("#selTwoC").text("〇");
    } else {
        $("#Three").addClass("correct").css("padding-left", "341px");
        $("#selThreeC").addClass("correctDIV");
        $("#selThreeC").text("〇");
    }

    var answercell = document.querySelector(`label[for='${document.querySelector("input[name='answer']:checked").id}']`)
    if (!(answercell.textContent.slice(2) === w)){
        var divcls = answercell.id.replace("selection", ""),
            judgecellid = `#sel${divcls}C`
        $(`#${divcls}`).addClass("miss").css("padding-left", "341px");
        $(judgecellid).addClass("missDIV");
        $(judgecellid).text("☓");
    }
}


function setCorrectClsByToF(o){
    var seltrue = document.getElementById("selectiontrue")
    var selfalse = document.getElementById("selectionfalse")
    if (seltrue.textContent === o){
        $("#true").addClass("correct")
        $("#selTrueC").addClass("correctDIV");
    } else {
        $("#false").addClass("correct")
        $("#selFalseC").addClass("correctDIV");
    }
    
    var answercell = document.querySelector(`label[for='${document.querySelector("input[name='answer']:checked").id}']`)
    if (!(answercell.textContent === o)){
        var divcls = answercell.id.replace("selection", "")
        $(`#${divcls}`).addClass("miss");
    }
}


function removeCorrectCls(){
    $("#selectionOne").removeClass("correct")
    $("#selectionTwo").removeClass("correct")
    $("#selectionThree").removeClass("correct")
    $("#selectiontrue").removeClass("correct")
    $("#selectionfalse").removeClass("correct")
    $("#true").removeClass("correct").removeClass("miss")
    $("#false").removeClass("correct").removeClass("miss")
    $("#One").removeClass("correct").removeClass("miss").css("padding-left", "400px");
    $("#Two").removeClass("correct").removeClass("miss").css("padding-left", "400px");
    $("#Three").removeClass("correct").removeClass("miss").css("padding-left", "400px");
    $("#selOneC").removeClass("correctDIV").removeClass("missDIV").text("")
    $("#selTwoC").removeClass("correctDIV").removeClass("missDIV").text("")
    $("#selThreeC").removeClass("correctDIV").removeClass("missDIV").text("")
}


function cleandoc(text) {
    const lines = text.split('\n').map(line => line.trim());
  
    while (lines.length > 0 && lines[0] === '') {
      lines.shift();
    }
  
    while (lines.length > 0 && lines[lines.length - 1] === '') {
      lines.pop();
    }

    return lines.join('\n');
}


$(function (){
    console.log("SetagaQuest.ClientID: " + clientID)
    $(".correctImg").hide()
    $.post("/getEndsAt", null).done(res => {
        console.log(res)
        endsAt = res["endsAt"][team]
        nextStartsAt = res["nextStartsAt"]
    
/////////////////////////////////////////////////////////////
        if (url_id === "reset"){
            if (clientID === null){
                console.log(null)
                $("#badRequest").show();
                $.post("/IDmaplist", null).done((res) => {
                    console.log(res)
                    for (kagoid of res){
                        console.log(kagoid)
                        localStorage.removeItem(`quizcache-${kagoid}`)
                    }
                    $("#topTitle").text("Bad Request");
                })
                return;
            } else {
                localStorage.removeItem("clientID")
                $.post("/IDmaplist", null).done((res) => {
                    console.log(res)
                    for (kagoid of res){
                        console.log(kagoid)
                        localStorage.removeItem(`quizcache-${kagoid}`)
                    }
                })
                return;
            }
        }
////////////////////////////////////////////////////////////

        if (badrequest){
            $("#badRequest").show();
            $("#topTitle").text("Bad Request");
            return;
        }

        if (typeof localStorage !== "undefined") {
            try {
                localStorage.setItem("dummy", "1");
                if (localStorage.getItem("dummy") === "1") {
                    localStorage.removeItem("dummy");
                } else {
                    clientID = "IP";
                }
            } catch(e) {
                clientID = "IP";
            }
        } else {
            clientID = "IP";
        }

        if (clientID === null){
            if (String(url_id) === "nickName"){
                var pd = {
                    "team": team
                }
                $.post("/newClientID", pd).done(newID => {
                    localStorage.setItem("clientID", newID);
                    clientID = newID
                    $("#whole").show();
                    $("#quiz").hide();
                    $("#registerNickname").show();
                    $("#nicked").show();
                    $("#submitNickname").click(x => clientNicked());
                    return;
                })
            } else {
                $("#notCustomer").show();
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
            }
        } else {
            var postData = {
                "type": "Quiz",
                "url_id": url_id,
                "clientID": clientID,
                "url": window.location.href,
                "team": team
            }
            console.log("SetagaQuest.ClientID: " + clientID)
            
            var p = {
                "clientID": clientID,
                "team": team
            }
            $.post("/getNick", p).done(res => {
                if (!(res === null)){
                    $("#hello").text(res + "さん、こんにちは!")
                } else {
                    $("#hello").hide()
                }
            })

            $.post("/init", postData).done(res => {
                console.log("init res:" + res)
                if(res === "not customer"){
                    $("#notCustomer").show();
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

                } else if(String(res).includes("claimed item")){
                    var _alrHavingItemName = res.replace("claimed item", "")
                    $("#claimed-item").show();
                    $("#claimed-item-description-sub").text("既にこのアイテムを獲得しています(" + _alrHavingItemName + ")")
                    $("#goToOtherURL-claimedItem").show();
                    $("#countDownAlrClm").show()
                    var countDownDate = new Date(endsAt).getTime();
                    var countdown = setInterval(function() {
                        var now = new Date().getTime();
                        var distance = countDownDate - now;

                        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                        if (days === 0 && minutes === 0 && hours === 0){
                            $("#countDownAlrClm").text(`終了まで: ${seconds}秒`)
                        } else if (hours === 0 && days === 0){
                            $("#countDownAlrClm").text(`終了まで: ${minutes}分 ${seconds}秒`)
                        } else if (days === 0 && !(hours === 0) && !(minutes === 0)){
                            $("#countDownAlrClm").text(`終了まで: ${hours}時間 ${minutes}分 ${seconds}秒`)
                        } else {
                            $("#countDownAlrClm").text(`終了まで: ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`)
                        }

                        if (distance <= 120000){
                            $("#countDownAlrClm").css("color", "red")
                            if (days === 0 && minutes === 0 && hours === 0){
                                $("#countDownAlrClm").text(`終了まで: ${seconds}秒 すぐに戻ってください`)
                            } else if (hours === 0 && days === 0){
                                $("#countDownAlrClm").text(`終了まで: ${minutes}分 ${seconds}秒 そろそろ戻ってください`)
                            }
                        }

                        if (distance <= 0) {
                            clearInterval(countdown);
                            console.log("タイムオーバー");
                            $("#countDownAlrClm").css("color", "red")
                            $("#countDownAlrClm").text(`タイムオーバー: 直ちに4Fに戻ってください`)
                        }
                    }, 1000);
                    return;

                } else if(res === "incorrect ID"){
                    $("#badRequest").show();
                    $("#topTitle").text("Bad Request");
                    return;

                } else if(res === "not nicked yet"){
                    $("#whole").show();
                    $("#quiz").hide();
                    $("#registerNickname").show();
                    $("#nicked").show();
                    $("#topTitle").text("ニックネーム");
                    $("#submitNickname").click(x => clientNicked());
                    return;

                } else if(res === "already nicked"){
                    $("#whole").show();
                    $("#quiz").hide();
                    $("#topTitle").text("ニックネーム");
                    $("#firstFind").text("既にニックネームが登録されています");
                    $("#firstfindDes").text("引き続きセタガクエストをお楽しみください");
                    $("#goToOtherURL-nick").show();
                    return;
                } else {
                    kagoinfo = res
                    console.log(kagoinfo)
                    $("#whole").show();
                    $("#tof").hide()

                    previousdata = localStorage.getItem(`quizcache-${url_id}`)
                    console.log(previousdata)
                    if (String(previousdata) === ("null" || "undefined" || null || undefined)){
                        btn_intr = 0
                    } else {
                        previousdata = JSON.parse(previousdata)
                        btn_intr = Number.parseInt(previousdata["btn_intr"])
                        correct = Number.parseInt(previousdata["correct"])
                        wrong = Number.parseInt(previousdata["wrong"])
                        lastQuestion = Number.parseInt(previousdata["lastQuestion"])

                        fromcache = true
                        var ans_btn = document.getElementById("answerButton");
                        ans_btn.textContent = "続ける"
                    }

                    $("#answerButton").click(function() {
                        checkAnswer(kagoinfo);
                    })

                    $(".showResult").hide();

                    $("#registerNickname").remove();
                    $("#quiz").show();
                    
                    console.log(kagoinfo["kagoname"])
                    $("#quizItem").text(kagoinfo["kagoname"]);
                    $("#quizImg").attr("src", kagoinfo["imageurl"]);
                    if (!(fromcache)){
                        $("#questionTitle").text("問: " + kagoinfo["questionOne"]["title"]);
                        if (kagoinfo["questionOne"]["tof"] === "true"){
                            tof = true
                            ToFStart()
                            $(".selection").hide()
                            $("#tof").show()
                            $("#selectiontrue").text("〇")
                            $("#selectionfalse").text("☓")
                        } else {
                            $("#selectionOne").text("1." + kagoinfo["questionOne"]["selFirst"]);
                            $("#selectionTwo").text("2." + kagoinfo["questionOne"]["selSecond"]);
                            $("#selectionThree").text("3." + kagoinfo["questionOne"]["selThird"]);
                        }
                        
                        $("#questionCount").text("1/" + (Object.keys(kagoinfo).length -3) + "問目");

                        $("#Des").hide();
                    } else {
                        $("#w").show()
                        $("#previouscaution").show()
                        $(".selection").hide()
                        $("#true").hide()
                        $("#false").hide()
                        $("#tof").show()
                        $("#Des").hide();
                    }
                    
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

                        if (distance <= 120000){
                            $("#countDown").css("color", "red")
                            if (days === 0 && minutes === 0 && hours === 0){
                                $("#countDown").text(`終了まで: ${seconds}秒 すぐに戻ってください`)
                            } else if (hours === 0 && days === 0){
                                $("#countDown").text(`終了まで: ${minutes}分 ${seconds}秒 そろそろ戻ってください`)
                            }
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


function ToFStart(){
    $("#selectiontrue").addClass("redbold");
    $("#selectionfalse").addClass("bluebold");
}
function ToFEnd(){
    $("#selectiontrue").removeClass("redbold");
    $("#selectionfalse").removeClass("bluebold");
}


function clientNicked(){
    var _clientNickName = $("#inputNicknameZone").val();
    var caution = document.getElementById("caution");
    
    nickName = $("#inputNicknameZone").val();

    // whitelisted
    localStorage.setItem("team", team);

    if (_clientNickName.length === 0){
        caution.textContent = "※一文字以上入力してください";
        return;
    }

    let info = {
        "x": _clientNickName,
        "clientID": clientID,
        "team": team
    }

    $.post("/data", info);
    $("#nicked").hide();
    $("#firstFind").text("ニックネームを登録しました!!");
    $("#firstfindDes").text("セタガクエストをお楽しみください");
    $("#goToOtherURL-nick").show();
    return
}


function checkAnswer(kagoinfo){
    var answer_sel = document.querySelector("input[name='answer']:checked");
    $("#selectCaution").css("visibility", "hidden")
    var ans_btn = document.getElementById("answerButton");
    
    if (!(fromcache)){
        if (answer_sel === null){
            $("#selectCaution").css("visibility", "visible")
            $("#selectCaution").text("※答えだと思うものを選択してください")
            return
        }
        var answer = document.querySelector(`label[for='${answer_sel.id}']`);
        if (!tof){
            answer = answer.textContent.slice(2);
        } else {
            answer = answer.textContent
        }
    } else {
        $("#previouscaution").hide()
        $("#w").hide()
        $(".selection").show()
        $("#true").show()
        $("#false").show()
        fromcache = false
    }

    const numOfQuestion = Object.keys(kagoinfo).length -3;

    if (lastQuestion === numOfQuestion){
        var level = kagoinfo["kagolevel"][String(correct)];
        var postdata = {
            "clientID": clientID,
            "url_id": url_id,
            "team": team,
            "kagoinfo": {
                "kagoname": kagoinfo["kagoname"],
                "kagolevel": level,
                "kagoimageurl": kagoinfo["imageurl"]
            }
        }

        $.post("/data", postdata);
        localStorage.removeItem(`quizcache-${url_id}`)

        $("#Quiz").hide();
        $(".showResult").show();
        $("#resultItemImg").hide();
        var resultShown = 0
        do {
            setTimeout(function(){
                $("#correctCNT").text("正解数: " + correct);
            }, 800);

            setTimeout(function(){
                $("#wrongCNT").text("不正解: " + wrong);
            }, 1600);

            setTimeout(function(){
                $("#resultItemImg").attr("src", kagoinfo["imageurl"]);
                $("#resultItemImg").show();
                $("#claimedItem").text(kagoinfo["kagoname"]);
            }, 2400);

            setTimeout(function(){
                var kagolevel = kagoinfo["kagolevel"][String(correct)];
                var kagodescription = "レベル： " + kagolevel

                $("#claimed-Item-Des").text(cleandoc(kagodescription));
                $("#goToOtherURL").show();
            }, 3200);
            if (void(nickName) === undefined){
                resultShown += 1;
            }
        } while (resultShown < 1)
        return;
    };


    if (btn_intr === 0){
        if (tof){
            setCorrectClsByToF(kagoinfo["questionOne"]["answer"])
        } else {
            setCorrectCls(kagoinfo["questionOne"]["answer"]);
        }
        if (!(kagoinfo["questionOne"]["description"] === "null")){
            $("#Des").show();
            $("#questionDescription").text(kagoinfo["questionOne"]["description"]);
            $("#questionDescription").show()
        }
        
        if (answer === kagoinfo["questionOne"]["answer"]){
            $("#judge").text("正解!!");
            $("#judge").show()
            correct += 1;
        } else {
            $("#judge").text("不正解...");
            $("#judge").show()
            wrong += 1;
        }
        
        btn_intr += 1;
        lastQuestion += 1;
        if (!(lastQuestion === numOfQuestion)){
            ans_btn.textContent = "次へ";
        } else {
            ans_btn.textContent = "結果を見る";
        }
        var forStorage = {
            "btn_intr": String(btn_intr),
            "correct": String(correct),
            "wrong": String(wrong),
            "lastQuestion": String(lastQuestion)
        }
        localStorage.setItem(`quizcache-${url_id}`, JSON.stringify(forStorage))

    } else if (btn_intr === 1){
        ToFEnd()
        removeCorrectCls();
        $(".selection").hide()
        $(".correctImg").hide();
        ans_btn.textContent = "回答する";
        $("#Des").hide();
        $("#judge").hide();
        $("#questionDescription").hide();

        $("#questionTitle").text("問: " + kagoinfo["questionTwo"]["title"]);
        if (kagoinfo["questionTwo"]["tof"] === "true"){
            ToFStart()
            tof = true
            $(".selection").hide()
            $("#tof").show()
            $("#selectiontrue").text("〇")
            $("#selectionfalse").text("☓")
        } else {
            tof = false
            $(".selection").show()
            $("#tof").hide()
            $("#selectionOne").text("1." + kagoinfo["questionTwo"]["selFirst"]);
            $("#selectionTwo").text("2." + kagoinfo["questionTwo"]["selSecond"]);
            $("#selectionThree").text("3." + kagoinfo["questionTwo"]["selThird"]);
        }
        $("#questionCount").text((lastQuestion +1) + "/" + numOfQuestion + "問目");
        
        if (!(answer_sel === (undefined || null))){
            answer_sel.checked = false;
        }
        btn_intr += 1;

    } else if (btn_intr === 2){
        if (tof){
            setCorrectClsByToF(kagoinfo["questionTwo"]["answer"])
        } else {
            setCorrectCls(kagoinfo["questionTwo"]["answer"]);
        }
        if (!(kagoinfo["questionTwo"]["description"] === "null")){
            $("#Des").show();
            $("#questionDescription").text(kagoinfo["questionTwo"]["description"]);
            $("#questionDescription").show()
        }
        
        if (answer === kagoinfo["questionTwo"]["answer"]){
            $("#judge").text("正解!!");
            $("#judge").show()
            correct += 1;
        } else {
            $("#judge").text("不正解...");
            $("#judge").show()
            wrong += 1;
        }
        
        btn_intr += 1;
        lastQuestion += 1;
        if (!(lastQuestion === numOfQuestion)){
            ans_btn.textContent = "次へ";
        } else {
            ans_btn.textContent = "結果を見る";
        }
        var forStorage = {
            "btn_intr": String(btn_intr),
            "correct": String(correct),
            "wrong": String(wrong),
            "lastQuestion": String(lastQuestion)
        }
        localStorage.setItem(`quizcache-${url_id}`, JSON.stringify(forStorage))

    } else if (btn_intr === 3){
        ToFEnd()
        removeCorrectCls();
        $(".selection").hide()
        $(".correctImg").hide();
        ans_btn.textContent = "回答する";
        $("#Des").hide();
        $("#judge").hide();
        $("#questionDescription").hide();

        $("#questionTitle").text("問: " + kagoinfo["questionThree"]["title"]);
        if (kagoinfo["questionThree"]["tof"] === "true"){
            tof = true
            ToFStart()
            $(".selection").hide()
            $("#tof").show()
            $("#selectiontrue").text("〇")
            $("#selectionfalse").text("☓")
        } else {
            tof = false
            $(".selection").show()
            $("#tof").hide()
            $("#selectionOne").text("1." + kagoinfo["questionThree"]["selFirst"]);
            $("#selectionTwo").text("2." + kagoinfo["questionThree"]["selSecond"]);
            $("#selectionThree").text("3." + kagoinfo["questionThree"]["selThird"]);
        }
        $("#questionCount").text((lastQuestion +1) + "/" + numOfQuestion + "問目");
        
        if (!(answer_sel === (undefined || null))){
            answer_sel.checked = false;
        }
        btn_intr += 1;

    } else if (btn_intr === 4){
        if (tof){
            setCorrectClsByToF(kagoinfo["questionThree"]["answer"])
        } else {
            setCorrectCls(kagoinfo["questionThree"]["answer"]);
        }
        if (!(kagoinfo["questionThree"]["description"] === "null")){
            $("#Des").show();
            $("#questionDescription").text(kagoinfo["questionThree"]["description"]);
            $("#questionDescription").show()
        }
        
        if (answer === kagoinfo["questionThree"]["answer"]){
            $("#judge").text("正解!!");
            $("#judge").show()
            correct += 1;
        } else {
            $("#judge").text("不正解...");
            $("#judge").show()
            wrong += 1;
        }

        btn_intr += 1;
        lastQuestion += 1;
        if (!(lastQuestion === numOfQuestion)){
            ans_btn.textContent = "次へ";
        } else {
            ans_btn.textContent = "結果を見る";
        }
        var forStorage = {
            "btn_intr": String(btn_intr),
            "correct": String(correct),
            "wrong": String(wrong),
            "lastQuestion": String(lastQuestion)
        }
        localStorage.setItem(`quizcache-${url_id}`, JSON.stringify(forStorage))

    } else if (btn_intr === 5){
        ToFEnd()
        removeCorrectCls();
        $(".selection").hide()
        $(".correctImg").hide();
        ans_btn.textContent = "回答する";
        $("#Des").hide();
        $("#judge").hide();
        $("#questionDescription").hide();

        $("#questionTitle").text("問: " + kagoinfo["questionFour"]["title"]);
        if (kagoinfo["questionFour"]["tof"] === "true"){
            tof = true
            ToFStart()
            $(".selection").hide()
            $("#tof").show()
            $("#selectiontrue").text("〇")
            $("#selectionfalse").text("☓")
        } else {
            tof = false
            $(".selection").show()
            $("#tof").hide()
            $("#selectionOne").text("1." + kagoinfo["questionFour"]["selFirst"]);
            $("#selectionTwo").text("2." + kagoinfo["questionFour"]["selSecond"]);
            $("#selectionThree").text("3." + kagoinfo["questionFour"]["selThird"]);
        }
        $("#questionCount").text((lastQuestion +1) + "/" + numOfQuestion + "問目");
        
        if (!(answer_sel === (undefined || null))){
            answer_sel.checked = false;
        }
        btn_intr += 1;

    } else if (btn_intr === 6){
        if (tof){
            setCorrectClsByToF(kagoinfo["questionFour"]["answer"])
        } else {
            setCorrectCls(kagoinfo["questionFour"]["answer"]);
        }
        if (!(kagoinfo["questionFour"]["description"] === "null")){
            $("#Des").show();
            $("#questionDescription").text(kagoinfo["questionFour"]["description"]);
            $("#questionDescription").show()
        }
        
        if (answer === kagoinfo["questionFour"]["answer"]){
            $("#judge").text("正解!!");
            $("#judge").show()
            correct += 1;
        } else {
            $("#judge").text("不正解...");
            $("#judge").show()
            wrong += 1;
        }
        
        btn_intr += 1;
        lastQuestion += 1;
        if (!(lastQuestion === numOfQuestion)){
            ans_btn.textContent = "次へ";
        } else {
            ans_btn.textContent = "結果を見る";
        }
        var forStorage = {
            "btn_intr": String(btn_intr),
            "correct": String(correct),
            "wrong": String(wrong),
            "lastQuestion": String(lastQuestion)
        }
        localStorage.setItem(`quizcache-${url_id}`, JSON.stringify(forStorage))

    } else if (btn_intr === 7){
        ToFEnd()
        removeCorrectCls();
        $(".selection").hide()
        $(".correctImg").hide();
        ans_btn.textContent = "回答する";
        $("#Des").hide();
        $("#judge").hide();
        $("#questionDescription").hide();

        $("#questionTitle").text("問: " + kagoinfo["questionFive"]["title"]);
        if (kagoinfo["questionFive"]["tof"] === "true"){
            tof = true
            ToFStart()
            $(".selection").hide()
            $("#tof").show()
            $("#selectiontrue").text("〇")
            $("#selectionfalse").text("☓")
        } else {
            tof = false
            $(".selection").show()
            $("#tof").hide()
            $("#selectionOne").text("1." + kagoinfo["questionFive"]["selFirst"]);
            $("#selectionTwo").text("2." + kagoinfo["questionFive"]["selSecond"]);
            $("#selectionThree").text("3." + kagoinfo["questionFive"]["selThird"]);
        }
        $("#questionCount").text((lastQuestion +1) + "/" + numOfQuestion + "問目");
        
        if (!(answer_sel === (undefined || null))){
            answer_sel.checked = false;
        }
        btn_intr += 1;

    } else if (btn_intr === 8){
        if (tof){
            setCorrectClsByToF(kagoinfo["questionFive"]["answer"])
        } else {
            setCorrectCls(kagoinfo["questionFive"]["answer"]);
        }
        if (!(kagoinfo["questionFive"]["description"] === "null")){
            $("#Des").show();
            $("#questionDescription").text(kagoinfo["questionFive"]["description"]);
            $("#questionDescription").show()
        }
        
        if (answer === kagoinfo["questionFive"]["answer"]){
            $("#judge").text("正解!!");
            $("#judge").show()
            correct += 1;
        } else {
            $("#judge").text("不正解...");
            $("#judge").show()
            wrong += 1;
        }
        
        btn_intr += 1;
        lastQuestion += 1;
        if (!(lastQuestion === numOfQuestion)){
            ans_btn.textContent = "次へ";
        } else {
            ans_btn.textContent = "結果を見る";
        }
        var forStorage = {
            "btn_intr": String(btn_intr),
            "correct": String(correct),
            "wrong": String(wrong),
            "lastQuestion": String(lastQuestion)
        }
        localStorage.setItem(`quizcache-${url_id}`, JSON.stringify(forStorage))
    }
}

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
var stars;
var rarity;
var fileN;
var notfound = false;

var url_id = String(getParam("id"));
var free = String(getParam("free"))
var hrr = String(getParam("hrr"));
var cid = String(getParam("cid"));
var fn = String(getParam("fn"));
var __index__ = getParam("index");
var nd = getParam("nd");
var rlurl_id = url_id
const nickName_URL_ID_A = "rankingAAAAAA"
const nickName_URL_ID_B = "rankingBBBBBB"
const nickName_URL_ID_FREE = "auth0-fr"
if (url_id == "nickName") notfound = true;
if (url_id == nickName_URL_ID_A) url_id = "nickName"
if (url_id == nickName_URL_ID_B) url_id = "nickName"
if (url_id == nickName_URL_ID_FREE) url_id = "nickName"

var team;
var que = [];
var current;
var suspended = [];
var __error__ = false;


var kagoinfo;
var clientID;
try{
   clientID = localStorage.getItem("clientID");
} catch(e){}


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
    if (selOne.textContent.slice(3) === w){
        $("#One").addClass("correct")
        $("#selOneC").addClass("correctDIV");
    } else if(selTwo.textContent.slice(3) === w){
        $("#Two").addClass("correct")
        $("#selTwoC").addClass("correctDIV");
    } else {
        $("#Three").addClass("correct")
        $("#selThreeC").addClass("correctDIV");
    }

    var answercell = document.querySelector(`label[for='${document.querySelector("input[name='answer']:checked").id}']`)
    if (!(answercell.textContent.slice(3) === w)){
        var divcls = answercell.id.replace("selection", ""),
            judgecellid = `#sel${divcls}C`
        $(`#${divcls}`).addClass("miss");
        $(judgecellid).addClass("missDIV");
    }
}


function setCorrectClsByToF(o){
    var seltrue = document.getElementById("selectiontrue");
    var selfalse = document.getElementById("selectionfalse");
    if (seltrue.textContent === o){
        $("#true").addClass("correct");
        $("#selTrueC").addClass("correctDIV");
    } else {
        $("#false").addClass("correct");
        $("#selFalseC").addClass("correctDIV");
    }
    
    var answercell = document.querySelector(`label[for='${document.querySelector("input[name='answer']:checked").id}']`);
    if (!(answercell.textContent === o)){
        var divcls = answercell.id.replace("selection", "");
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
    $("#One").removeClass("correct").removeClass("miss");
    $("#Two").removeClass("correct").removeClass("miss");
    $("#Three").removeClass("correct").removeClass("miss");
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


function hasLocalStorage(){
    var _nt = false;
    var _err = "";
    try{
        if (typeof localStorage !== "undefined") {
            try {
                var do_r = false;
                var _url = window.location.href;
                var lo = getParam("lo");
                localStorage.setItem("dummy", "1");
                if (!lo){
                    do_r = true;
                    if (_url.includes("?")){
                        _url += "&lo=pre";
                    } else {
                        _url += "?lo=pre";
                    }
                }
                if (do_r){
                    window.location.href = _url;
                }
                if (localStorage.getItem("dummy") === "1"){
                    localStorage.removeItem("dummy");
                } else {
                    _nt = true;
                    _err += "could't get value from localStorage";
                    $("#topTitle").text("エラー!(4)");
                }
            } catch(e) {
                _nt = true;
                _err += "localStorage.setItem is not a function";
                $("#topTitle").text("エラー!(3)");
            }
        } else {
            _nt = true;
            _err += "localStorage not defined(2)";
            $("#topTitle").text("エラー!(2)");
        }
    } catch (e){
        _err += "localStorage not defined(1)"+e;
        $("#topTitle").text("エラー!(1)");
        _nt = true;
    }
    if (_nt){
        $(".topcontainer").show();
        $(".undefined_localstorage").show();
        $("#whole").hide();
        $("#claimed-item").hide();
        $("#__er").text(_err).css("color", "black");
        return _nt;
    }
}


!function(){
    if (cid != "null" && fn != "null" && !nd && __index__ != null){
        if (Number.parseInt(__index__) > 10){
            __error__ = true;
            return;
        }
        var url = window.location.href;
        if (localStorage.getItem("clientID") == cid && 
            localStorage.getItem("fileN") == fn){
            url = url.replace("&cid="+cid, "");
            url = url.replace("?cid="+cid, "");
            url = url.replace("&fn="+fn, "");
            url = url.replace("?fn="+fn, "");
            url = url.replace("&index="+__index__, "");
            url = url.replace("?index="+__index__, "");
            if (url.includes("?")){
                url += "&nd=ye";
            } else {
                url += "?nd=ye";
            }
            localStorage.removeItem("alrc");
            window.location.href = url;
        } else {
            var __index = Number.parseInt(__index__);
            localStorage.setItem("clientID", cid);
            localStorage.setItem("fileN", fn);
            url = url.replace("&index="+__index, `&index=${__index + 1}`);
            url = url.replace("?index="+__index, `?index=${__index + 1}`);
            window.location.href = url;
        }
    }
}();


function reRegister(){
    window.location.href = "/src/customers/events/quiz/?id="+getParam("id");
}


$(function (){
    if (__error__){
        $(".topcontainer").show();
        $("#topTitle").show();
        $("#whole").show();
        $("#quiz").hide();
        $("#topTitle").text("エラー");
        $("#firstFind").text("登録に失敗しました。");
        $("#firstfindDes").html("下のボタンから再度お試しください。<br>ご不便をおかけしてしまい申し訳ありません。");
        $("#reRegisterer").show();
        return;
    }
    var _bs = "次のランキング_Aボス戦";
    var _es = "次のランキング_A開催";
    fileN = localStorage.getItem("fileN");
    if (localStorage.getItem("free")){
        if (url_id != "nickName"){
            _bs = "次のフリーボス戦";
            _es = "次のフリー開催";
            localStorage.setItem("free", "true");
            fileN = "0"
        }
    } 
    if (localStorage.getItem("fileN") == "2"){
        if (url_id != "nickName"){
            _bs = _bs.replace("A", "B");
            _es = _es.replace("A", "B");
            fileN = "2"
        }
    }
    console.log("SetagaQuest.ClientID: " + clientID);
    var p = {
        "clientID": clientID,
        "fileN": fileN
    }
    console.log(p)
    $.post("/getNick", p).done(res => {
        if (res.length > 0){
            $("#hello").html(
                `<div style="display: flex; align-items: end; justify-content: flex-end;"><h3 style="margin: 0;">
                    あなたのニックネームは
                </h3><h1 id="myNick" style="text-align: end; margin: 0;">${res}</h1><h3 style="margin: 0;">です</h3></div>`
            );
        } else {
            $("#hello").hide();
        }
    });
    $(".correctImg").hide();
    $(".topcontainer").css("width", "auto");
    $.post("/getEndsAt", null).done(res => {
        console.log(res);
        endsAt = res[_bs];
        nextStartsAt = res[_es];
    
        $(".topcontainer").show();
/////////////////////////////////////////////////////////////
        if (url_id === "reset"){
            localStorage.clear();
            if (clientID === null){
                $("#badRequest").show();
                $.post("/IDmaplist", null).done((res) => {
                    console.log(res)
                    for (kagoid of res){
                        console.log(kagoid);
                        localStorage.removeItem(`quizcache-${kagoid}`);
                    }
                    localStorage.removeItem("forAdmins-password")
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

        if (notfound){
            $("#badRequest").show();
            $("#topTitle").text("Not Found");
            $("#statusText").text("404 Not Found")
            $("#statusDes").text("(The page you requested was not found on this server)")
            return;
        }

        if (String(url_id) == "nickName"){
            $("title").text("【セタガクエスト】 ニックネーム登録");
        }

        if (clientID === null){
            if (String(url_id) === "nickName"){
                var pd = {
                    "fileN": fileN
                }
                $.post("/newClientID", pd).done(newID => {
                    if (res === "!isNickPart"){
                        // uncatchable
                        $("#notCustomer").show();
                        $("#countDownNCM").hide();
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
                                    $("#countDownNCM").text(`次の開催: 約 ${seconds}秒 後`)
                                } else if (hours === 0 && days === 0){
                                    $("#countDownNCM").text(`次の開催: 約 ${minutes}分 ${seconds}秒 後`)
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
                    if (hasLocalStorage())
                        return;
                    localStorage.setItem("clientID", newID);
                    clientID = newID
                    if (fileN != "0"){
                        localStorage.removeItem("free");
                    }
                    $("#topTitle").text("ニックネーム");
                    $("#whole").show();
                    $("#quiz").hide();
                    $("#registerNickname").show();
                    $("#nicked").show();
                    $("#submitNickname").click(x => clientNicked());
                    if (getMobileOS() == "iOS")
                        $(".iOS_caution").show();
                    $(".caution_rules").show();
                    return;
                })
            } else {
                $("#notCustomer").show();
                $("#countDownNCM").hide();
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
                        $("#countDownNCM").css("color", "red").hide();
                        $("#countDownNCM").text(`先ほど始まってしまいました。このサイトを再読み込みして次を確認しましょう！`);
                    }
                }, 1000);
                return;
            }
        } else {
            var __id = getParam("id")
            if (__id == nickName_URL_ID_A) fileN = "1"
            if (__id == nickName_URL_ID_B) fileN = "2"
            if (__id == nickName_URL_ID_FREE) fileN = "0"
            var postData = {
                "type": "Quiz",
                "url_id": url_id,
                "clientID": clientID,
                "url": window.location.href,
                "fileN": fileN
            }
            console.log("SetagaQuest.ClientID: " + clientID);

            $.post("/init", postData).done(res => {
                console.log("init res:" + res)
                if(res === "not customer"){
                    $("#notCustomer").show();
                    $("#countDownNCM").hide();
                    $("#topTitle").text("ハロー！");
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
                            $("#countDownNCM").css("color", "red");
                            if (days === 0 && minutes === 0 && hours === 0){
                                $("#countDownNCM").text(`次の開催: 約 ${seconds}秒 後`);
                            } else if (hours === 0 && days === 0){
                                $("#countDownNCM").text(`次の開催: 約 ${minutes}分 ${seconds}秒 後`);
                            }
                        }
                        
                        if (distance <= 0) {
                            clearInterval(countdown);
                            $("#countDownNCM").css("color", "red");
                            $("#countDownNCM").hide();
                        }
                    }, 1000);
                    return;

                } else if(res === "incorrect ID"){
                    $("#badRequest").show();
                    $("#topTitle").text("Bad Request");
                    return;

                } else if(res === "not nicked yet"){
                    localStorage.removeItem("free");
                    if (getParam("id") == nickName_URL_ID_FREE){
                        localStorage.setItem("free", "true");
                    }
                    $("#whole").show();
                    $("#quiz").hide();
                    $("#registerNickname").show();
                    if (getMobileOS() == "iOS")
                        $(".iOS_caution").show();
                    $(".caution_rules").show();
                    $("#nicked").show();
                    $("#topTitle").text("ニックネーム");
                    $("#submitNickname").click(x => clientNicked());
                    return;

                } else if(res === "not nicked yet but !isNickPart"){
                    $("#notCustomer").show();
                    $("#countDownNCM").hide();
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
                                $("#countDownNCM").text(`次の開催: 約 ${seconds}秒 後`)
                            } else if (hours === 0 && days === 0){
                                $("#countDownNCM").text(`次の開催: 約 ${minutes}分 ${seconds}秒 後`)
                            }
                        }

                        if (distance <= 0) {
                            clearInterval(countdown);
                            $("#countDownNCM").css("color", "red")
                            $("#countDownNCM").text(`先ほど始まってしまいました。このサイトを再読み込みして次を確認しましょう！`)
                        }
                    }, 1000);
                    return;

                } else if(res === "already nicked"){
                    $("#whole").show();
                    $("#quiz").hide();
                    $("#topTitle").text("ニックネーム");
                    $("#firstFind").text("既にニックネームが登録されています");
                    $("#firstfindDes").text("引き続きセタガクエストをお楽しみください");
                    $("#goToOtherURL-nick").show();
                    $(".caution_rules").show();
                    $("#topTitle").text("登録済み");
                    if (nd == "ye" && !localStorage.getItem("alrc")){
                        ned();
                        localStorage.setItem("alrc", true);
                    }
                    return;
                } else if(String(res).includes("claimed item")){
                    $("#whole").show();
                    $("#quiz").hide();
                    $("#firstFind").text("既にこの祠をクリアしています！");
                    $("#firstfindDes").text("引き続きセタガクエストをお楽しみください");
                    $("#topTitle").text("クリア済み");
                    $("#goToOtherURL-nick").show();
                    return;
                } else {
                    var postd = {
                        "id": clientID,
                        "fileN": fileN
                    }
                    var data;
                    $.post("/getdata", postd).done(q =>{
                        data = q;
                    
                        kagoinfo = res;
                        console.log(kagoinfo);
                        $("#whole").show();
                        $("#tof").hide();
                        var type = kagoinfo["type"];
                        var tx;
                        var soth = false;
                        tx = kagoinfo["type"];

                        try{
                            for (f of data["items"]){
                                if (f["type"] == type){
                                    stars = Number.parseInt(f["stars"])
                                    rarity = f["rarity"]
                                    soth = true;
                                }
                            }
                        } catch (e){
                            $("#registerNickname").hide();
                            $("#badRequest").show();
                            $("#topTitle").text("Fatal Error");
                            $("#statusText").text("500 Internal Server Error");
                            $("#statusDes").text("セタガクエストへお問い合わせください");
                            return;
                        }

                        $("#quiz").css("height", window.innerHeight+"px")
                        $("#quizItem").css("font-size", (window.innerHeight/14)+"px")

                        if ( soth ){
                            tx = type+"を強化する"
                        } else {
                            tx = type+"を獲得する"
                            stars = 0;
                            rarity = null;
                        }
                   
                        previousdata = localStorage.getItem(`quizcache-${url_id}`)
                        suspended_prev = localStorage.getItem(`quizcache-${url_id}-suspended`)
                        console.log(previousdata)
                        if (String(previousdata) === ("null" || "undefined" || null || undefined)){
                            btn_intr = 0
                        } else {
                            previousdata = JSON.parse(previousdata)
                            suspended = JSON.parse(suspended_prev)
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
                        
                        $("#quizItem").text(tx);
                        $("#quizImg").attr("src", kagoinfo["imageurl"]);
                        const numOfQuestion = Object.keys(kagoinfo).length -3;
                        var _que = ["questionOne", "questionTwo", "questionThree", "questionFour", "questionFive"]
                        for (var i = 0; i < numOfQuestion; i++){
                            que.push(_que[i]);
                        }
                        if (!(fromcache)){
                            do {
                                current = randomFromArray(que);
                            } while (suspended.includes(current));
                            suspended.push(current);
                            $("#questionTitle").text("問: " + kagoinfo[current]["title"]);
                            if (kagoinfo[current]["tof"] === "true"){
                                tof = true
                                ToFStart()
                                $(".selection").hide()
                                $("#tof").show()
                                $("#selectiontrue").text("〇")
                                $("#selectionfalse").text("☓")
                            } else {
                                $("#selectionOne").text("1: " + kagoinfo[current]["selFirst"]);
                                $("#selectionTwo").text("2: " + kagoinfo[current]["selSecond"]);
                                $("#selectionThree").text("3: " + kagoinfo[current]["selThird"]);
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
                                $("#countDown").text(`次のボス戦まで: ${seconds}秒`);
                            } else if (hours === 0 && days === 0){
                                $("#countDown").text(`次のボス戦まで: ${minutes}分 ${seconds}秒`);
                            } else if (days === 0 && !(hours === 0) && !(minutes === 0)){
                                $("#countDown").text(`次のボス戦まで: ${hours}時間 ${minutes}分 ${seconds}秒`);
                            } else {
                                $("#countDown").text(`次のボス戦まで: ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`);
                            }

                            if (distance <= 120000){
                                $("#countDown").css("color", "red")
                                if (days === 0 && minutes === 0 && hours === 0){
                                    $("#countDown").text(`次のボス戦まで: ${seconds}秒 先ほど始まってしまいました。このサイトを再読み込みして次を確認しましょう！`);
                                } else if (hours === 0 && days === 0){
                                    $("#countDown").text(`次のボス戦まで: ${minutes}分 ${seconds}秒 先ほど始まってしまいました。このサイトを再読み込みして次を確認しましょう！`);
                                }
                            }

                            if (distance <= 0) {
                                clearInterval(countdown);
                                console.log("タイムオーバー");
                                $("#countDown").css("color", "red");
                                $("#countDown").text(`先ほど始まってしまいました。このサイトを再読み込みして次を確認しましょう！`);
                            }
                        }, 1000);
                    })
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

    if (_clientNickName.length === 0){
        caution.textContent = "※一文字以上入力してください";
        return;
    }

    let info = {
        "x": _clientNickName,
        "clientID": clientID,
        "fileN": fileN
    }

    localStorage.removeItem("Grand_Final_WON");
    localStorage.removeItem("gf_dmg_dealt");
    localStorage.setItem("fileN", fileN);
    localStorage.setItem("clientID", clientID);
    var ul = window.location.href;
    ul += "&cid="+clientID;
    ul += "&fn="+fileN;
    ul += "&index=0";
    $.post("/data", info).done(res => {
        window.location.href = ul;
    });
}

function ned(){
    $("#nicked").hide();
    $("#firstFind").text("ニックネームを登録しました!!");
    $("#firstfindDes").text("セタガクエストをお楽しみください");
    $("#goToOtherURL-nick").show();
}


function checkAnswer(kagoinfo){
    var answer_sel = document.querySelector("input[name='answer']:checked");
    $("#selectCaution").css("visibility", "hidden");
    var ans_btn = document.getElementById("answerButton");
    
    if (!(fromcache)){
        if (answer_sel === null){
            $("#selectCaution").css("visibility", "visible");
            $("#selectCaution").text("※答えだと思うものを選択してください");
            return;
        }
        var answer = document.querySelector(`label[for='${answer_sel.id}']`);
        if (!tof){
            answer = answer.textContent.slice(3);
        } else {
            answer = answer.textContent;
        }
    } else {
        $("#previouscaution").hide();
        $("#w").hide();
        $(".selection").show();
        $("#true").show();
        $("#false").show();
        fromcache = false;
    }

    const numOfQuestion = Object.keys(kagoinfo).length -3;

    if (lastQuestion === numOfQuestion){
        var rarity_move = 0; // #rarity_move
        stars += Number.parseInt(kagoinfo["kagolevel"][String(correct)]);
        if (rarity == null){
            rarity = "common";
            rarity_move = 10;
        } else if (rarity == "common"){
            rarity = "uncommon";
            rarity_move = 30;
        } else if (rarity == "uncommon"){
            rarity = "rare";
            rarity_move = 55;
        } else if (rarity == "rare"){
            rarity = "epic";
            rarity_move = 75;
        } else if (rarity == "epic"){
            rarity = "legendary";
            rarity_move = 100;
        }
        var postdata = {
            "clientID": clientID,
            "url_id": url_id,
            "fileN": fileN,
            "kagoinfo": {
                "type": kagoinfo["type"],
                "stars": stars,
                "rarity": rarity
            }
        }

        $.post("/data", postdata);
        localStorage.removeItem(`quizcache-${url_id}`);
        localStorage.removeItem(`quizcache-${url_id}-suspended`);

        $("#Quiz").hide();
        $(".showResult").show();
        $("#resultItemImg").hide();
        $(".square").css("background-color", "rgb(197, 229, 147)");
        $("#rarity_move").css("width", rarity_move+"%");
        var resultShown = 0;
        do {
            setTimeout(function(){
                $("#correctCNT").text("正解数: " + correct);
            }, 800);

            setTimeout(function(){
                $("#wrongCNT").text("不正解: " + wrong);
            }, 1600);

            setTimeout(function(){
                var txt = kagoinfo["type"]+" "
                for (i=0;i<stars;i++){
                    txt+="★";
                }
                $("#resultItemImg").attr("src", kagoinfo["imageurl"]);
                $("#resultItemImg").show();
                $("#claimedItem").text(txt);
            }, 2400);

            setTimeout(function(){
                var kagolevel = kagoinfo["kagolevel"][String(correct)];
                var kagodescription = "スター: "+stars+"コ<br>";
                kagodescription += "今回獲得したスター: " + kagolevel+"コ<br>";
                kagodescription += "現在のレア度: " + rarity;
                $("#claimed-Item-Des").html(cleandoc(kagodescription));
                $(".displayer_rarity").show();
            }, 3200);
            setTimeout(function(){
                $("#goToOtherURL").show();
            }, 4000);
            if (void(nickName) === undefined){
                resultShown += 1;
            }
        } while (resultShown < 1);
        return;
    };


    if (btn_intr === 0){
        if (tof){
            setCorrectClsByToF(kagoinfo[current]["answer"])
        } else {
            setCorrectCls(kagoinfo[current]["answer"]);
        }
        console.log(kagoinfo[current]["description"])
        if (!(kagoinfo[current]["description"] == "null" || kagoinfo[current]["description"] == null || kagoinfo[current]["description"] == undefined)){
            $("#Des").show();
            $("#questionDescription").text(kagoinfo[current]["description"]);
            $("#questionDescription").show();
        } else {
            $("#Des").show();
            $("#questionDescription").text("この問題に解説はありません。");
            $("#questionDescription").show()
        }
        
        if (answer === kagoinfo[current]["answer"]){
            $("#judge").text("正解!!");
            $("#judge").show();
            correct += 1;
        } else {
            $("#judge").text("不正解...");
            $("#judge").show();
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
        localStorage.setItem(`quizcache-${url_id}-suspended`, JSON.stringify(suspended));

    } else if (btn_intr === 1){
        do {
            current = randomFromArray(que);
        } while (suspended.includes(current));
        suspended.push(current);
        ToFEnd()
        removeCorrectCls();
        $(".selection").hide()
        $(".correctImg").hide();
        ans_btn.textContent = "回答する";
        $("#Des").hide();
        $("#judge").hide();
        $("#questionDescription").hide();

        $("#questionTitle").text("問: " + kagoinfo[current]["title"]);
        if (kagoinfo[current]["tof"] === "true"){
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
            $("#selectionOne").text("1: " + kagoinfo[current]["selFirst"]);
            $("#selectionTwo").text("2: " + kagoinfo[current]["selSecond"]);
            $("#selectionThree").text("3: " + kagoinfo[current]["selThird"]);
        }
        $("#questionCount").text((lastQuestion +1) + "/" + numOfQuestion + "問目");
        
        if (!(answer_sel === (undefined || null))){
            answer_sel.checked = false;
        }
        btn_intr += 1;

    } else if (btn_intr === 2){
        if (tof){
            setCorrectClsByToF(kagoinfo[current]["answer"])
        } else {
            setCorrectCls(kagoinfo[current]["answer"]);
        }
        if (!(kagoinfo[current]["description"] == "null" || kagoinfo[current]["description"] == null || kagoinfo[current]["description"] == undefined)){
            $("#Des").show();
            $("#questionDescription").text(kagoinfo[current]["description"]);
            $("#questionDescription").show();
        } else {
            $("#Des").show();
            $("#questionDescription").text("この問題に解説はありません。");
            $("#questionDescription").show();
        }
        
        if (answer === kagoinfo[current]["answer"]){
            $("#judge").text("正解!!");
            $("#judge").show();
            correct += 1;
        } else {
            $("#judge").text("不正解...");
            $("#judge").show();
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
        localStorage.setItem(`quizcache-${url_id}-suspended`, JSON.stringify(suspended));

    } else if (btn_intr === 3){
        do {
            current = randomFromArray(que);
        } while (suspended.includes(current));
        suspended.push(current);
        ToFEnd()
        removeCorrectCls();
        $(".selection").hide()
        $(".correctImg").hide();
        ans_btn.textContent = "回答する";
        $("#Des").hide();
        $("#judge").hide();
        $("#questionDescription").hide();

        $("#questionTitle").text("問: " + kagoinfo[current]["title"]);
        if (kagoinfo[current]["tof"] === "true"){
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
            $("#selectionOne").text("1: " + kagoinfo[current]["selFirst"]);
            $("#selectionTwo").text("2: " + kagoinfo[current]["selSecond"]);
            $("#selectionThree").text("3: " + kagoinfo[current]["selThird"]);
        }
        $("#questionCount").text((lastQuestion +1) + "/" + numOfQuestion + "問目");
        
        if (!(answer_sel === (undefined || null))){
            answer_sel.checked = false;
        }
        btn_intr += 1;

    } else if (btn_intr === 4){
        if (tof){
            setCorrectClsByToF(kagoinfo[current]["answer"])
        } else {
            setCorrectCls(kagoinfo[current]["answer"]);
        }
        if (!(kagoinfo[current]["description"] == "null" || kagoinfo[current]["description"] == null || kagoinfo[current]["description"] == undefined)){
            $("#Des").show();
            $("#questionDescription").text(kagoinfo[current]["description"]);
            $("#questionDescription").show()
        } else {
            $("#Des").show();
            $("#questionDescription").text("この問題に解説はありません。");
            $("#questionDescription").show()
        }
        
        if (answer === kagoinfo[current]["answer"]){
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
        localStorage.setItem(`quizcache-${url_id}-suspended`, JSON.stringify(suspended));

    } else if (btn_intr === 5){
        do {
            current = randomFromArray(que);
        } while (suspended.includes(current));
        suspended.push(current);
        ToFEnd()
        removeCorrectCls();
        $(".selection").hide()
        $(".correctImg").hide();
        ans_btn.textContent = "回答する";
        $("#Des").hide();
        $("#judge").hide();
        $("#questionDescription").hide();

        $("#questionTitle").text("問: " + kagoinfo[current]["title"]);
        if (kagoinfo[current]["tof"] === "true"){
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
            $("#selectionOne").text("1: " + kagoinfo[current]["selFirst"]);
            $("#selectionTwo").text("2: " + kagoinfo[current]["selSecond"]);
            $("#selectionThree").text("3: " + kagoinfo[current]["selThird"]);
        }
        $("#questionCount").text((lastQuestion +1) + "/" + numOfQuestion + "問目");
        
        if (!(answer_sel === (undefined || null))){
            answer_sel.checked = false;
        }
        btn_intr += 1;

    } else if (btn_intr === 6){
        if (tof){
            setCorrectClsByToF(kagoinfo[current]["answer"])
        } else {
            setCorrectCls(kagoinfo[current]["answer"]);
        }
        if (!(kagoinfo[current]["description"] == "null" || kagoinfo[current]["description"] == null || kagoinfo[current]["description"] == undefined)){
            $("#Des").show();
            $("#questionDescription").text(kagoinfo[current]["description"]);
            $("#questionDescription").show()
        } else {
            $("#Des").show();
            $("#questionDescription").text("この問題に解説はありません。");
            $("#questionDescription").show()
        }
        
        if (answer === kagoinfo[current]["answer"]){
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
        localStorage.setItem(`quizcache-${url_id}-suspended`, JSON.stringify(suspended));

    } else if (btn_intr === 7){
        do {
            current = randomFromArray(que);
        } while (suspended.includes(current));
        suspended.push(current);
        ToFEnd()
        removeCorrectCls();
        $(".selection").hide()
        $(".correctImg").hide();
        ans_btn.textContent = "回答する";
        $("#Des").hide();
        $("#judge").hide();
        $("#questionDescription").hide();

        $("#questionTitle").text("問: " + kagoinfo[current]["title"]);
        if (kagoinfo[current]["tof"] === "true"){
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
            $("#selectionOne").text("1: " + kagoinfo[current]["selFirst"]);
            $("#selectionTwo").text("2: " + kagoinfo[current]["selSecond"]);
            $("#selectionThree").text("3: " + kagoinfo[current]["selThird"]);
        }
        $("#questionCount").text((lastQuestion +1) + "/" + numOfQuestion + "問目");
        
        if (!(answer_sel === (undefined || null))){
            answer_sel.checked = false;
        }
        btn_intr += 1;

    } else if (btn_intr === 8){
        if (tof){
            setCorrectClsByToF(kagoinfo[current]["answer"])
        } else {
            setCorrectCls(kagoinfo[current]["answer"]);
        }
        if (!(kagoinfo[current]["description"] == "null" || kagoinfo[current]["description"] == null || kagoinfo[current]["description"] == undefined)){
            $("#Des").show();
            $("#questionDescription").text(kagoinfo[current]["description"]);
            $("#questionDescription").show()
        } else {
            $("#Des").show();
            $("#questionDescription").text("この問題に解説はありません。");
            $("#questionDescription").show()
        }
        
        if (answer === kagoinfo[current]["answer"]){
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
        localStorage.setItem(`quizcache-${url_id}-suspended`, JSON.stringify(suspended));
    }
}


function displaycount(time, message){
    $("#countDownNCM").hide();
    var countDownDate = new Date(time).getTime();
    var countdown = setInterval(() => {
        var now = new Date().getTime();
        var distance = countDownDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (days === 0 && minutes === 0 && hours === 0){
            $("#countDownNCM").text(`ボス: 約 ${seconds}秒 後`);
        } else if (hours === 0 && days === 0){
            $("#countDownNCM").text(`ボス: 約 ${minutes}分 ${seconds}秒 後`);
        } else if (days === 0 && !(hours === 0) && !(minutes === 0)){
            $("#countDownNCM").text(`ボス: 約 ${hours}時間 ${minutes}分 ${seconds}秒 後`);
        } else {
            $("#countDownNCM").text(`ボス: 約 ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒 後`);
        }

        if (distance <= 120000) {
            console.log("まもなく始まります");
            $("#countDownNCM").css("color", "red");
            if (days === 0 && minutes === 0 && hours === 0){
                $("#countDownNCM").text(`ボス: 約 ${seconds}秒 後`);
            } else if (hours === 0 && days === 0){
                $("#countDownNCM").text(`ボス: 約 ${minutes}分 ${seconds}秒 後`);
            }
        }

        if (distance <= 0) {
            clearInterval(countdown);
            $("#countDownNCM").css("color", "red");
            $("#countDownNCM").text(`先ほど始まってしまいました。このサイトを再読み込みして次を確認しましょう！`);
        }
    }, 1000);
}




function randomFromArray(array){
    return array[Math.floor(Math.random() * array.length)];
}

const getMobileOS = () => {
    const ua = navigator.userAgent
    if (/android/i.test(ua)) {
      return "Android"
    }
    else if ((/iPad|iPhone|iPod/.test(ua))
       || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)){
      return "iOS"
    }
  
    return "Other"
}

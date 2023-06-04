let btn_intr = 0;
var correct = 0;
var wrong = 0;
var lastQuestion = 0;
var nickName = void(0);

//外部からのnickNameアクセスを禁止
var url_id = String(getParam("id"));
const nickName_URL_ID = "wawawa";  //毎回予測されない文字列にする & ホワイトリスト用のQRコードを随時変更
if (url_id === "nickName"){
    url_id = "badRequest";
} else if (url_id === nickName_URL_ID){
    url_id = "nickName";
} 

var itemInfo;
var clientID = localStorage.getItem("SetagaQuestClientID");


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
        $("#selectionOne").addClass("correct");
        $("#selectionOne").text(selOne.textContent + "...(正解)");
    } else if(selTwo.textContent.slice(2) === w){
        $("#selectionTwo").addClass("correct");
        $("#selectionTwo").text(selTwo.textContent + "...(正解)");
    } else {
        $("#selectionThree").addClass("correct");
        $("#selectionThree").text(selThree.textContent + "...(正解)");
    }
}


function removeCorrectCls(){
    $("#selectionOne").removeClass("correct")
    $("#selectionTwo").removeClass("correct")
    $("#selectionThree").removeClass("correct")
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
    // 開発用(そのうち消す)
    if (url_id === "reset"){
        if (clientID === null){
            $("#badRequest").show();
            $("#topTitle").text("Bad Request");
            return;
        } else {
            localStorage.removeItem("SetagaQuestClientID")
            console.log(localStorage.getItem("SetagaQuestClientID"))
            return;
        }
    }

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

    if (clientID === null){
        if (String(url_id) === "nickName"){
            $.post("/newClientID", null).done(newID => {
                localStorage.setItem("SetagaQuestClientID", newID);
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
            return;
        }
    } else {
        var postData = {
            "type": "Quiz",
            "url_id": url_id,
            "clientID": clientID
        }
        console.log("SetagaQuest.ClientID: " + clientID)
        
        var p = {
            "clientID": clientID
        }
        $.post("/getNick", p).done(res => {
            if (!(res === null)){
                $("#hello").text(res + "さん、こんにちは!")
            } else {
                $("#hello").hide()
                console.log("a")
            }
        })

        $.post("/init", postData).done(res => {
            if(res === "not customer"){
                $("#notCustomer").show();
                return;

            } else if(String(res).includes("claimed item")){
                var _alrHavingItemName = res.replace("claimed item", "")
                $("#claimed-item").show();
                $("#claimed-item-description-sub").text("既にこのアイテムを獲得しています(" + _alrHavingItemName + ")")
                $("#goToOtherURL-claimedItem").show();
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
            } else{
                itemInfo = res
                $("#whole").show();

                $("#answerButton").click(function() {
                    checkAnswer(itemInfo);
                })

                $(".showResult").hide();

                $("#registerNickname").remove();
                $("#quiz").show();
                console.log(itemInfo["ItemName"])
                $("#quizItem").text(itemInfo["ItemName"]);
                $("#quizImg").attr("src", itemInfo["ItemImgURL"]);
                $("#questionTitle").text("問: " + itemInfo["questionOne"]["title"]);
                $("#selectionOne").text("1." + itemInfo["questionOne"]["selFirst"]);
                $("#selectionTwo").text("2." + itemInfo["questionOne"]["selSecond"]);
                $("#selectionThree").text("3." + itemInfo["questionOne"]["selThird"]);
                $("#questionCount").text("1/" + (Object.keys(itemInfo).length -3) + "問目");

                $("#Des").hide();
            }
        })
    }
})


function clientNicked(){
    var _clientNickName = $("#inputNicknameZone").val();
    var caution = document.getElementById("caution");
    
    nickName = $("#inputNicknameZone").val();

    if (_clientNickName.length === 0){
        caution.textContent = "※一文字以上入力してください";
        return;
    };

    let info = {
        "x": _clientNickName,
        "clientID": clientID
    }

    $.post("/data", info);
    $("#nicked").hide();
    $("#firstFind").text("ニックネームを登録しました!!");
    $("#firstfindDes").text("セタガクエストをお楽しみください");
    $("#goToOtherURL-nick").show();
}


function checkAnswer(quizinfo){
    var answer_sel = document.querySelector("input[name='answer']:checked");
    if (answer_sel === null){
        return;
    }

    let answer = document.querySelector(`label[for='${answer_sel.id}']`);
    var ans_btn = document.getElementById("answerButton");
    answer = answer.textContent.slice(2);
    const numOfQuestion = Object.keys(quizinfo).length -3;

    if (lastQuestion === numOfQuestion){
        var status = quizinfo["ItemStatus"][String(correct)];
        var clientInfo = {
            "items": {
                "clientID": clientID,
                "itemName": String(itemInfo["ItemName"]),
                [String(itemInfo["ItemName"])]: {
                    "base_damage": status["baseDmg"],
                    "attributes": status["attributes"],
                }
            }
        }

        $.post("/data", clientInfo);

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
                $("#resultItemImg").attr("src", itemInfo["ItemImgURL"]);
                $("#resultItemImg").show();
                $("#claimedItem").text(quizinfo["ItemName"]);
            }, 2400);

            setTimeout(function(){
                var _itemStatusDict = quizinfo["ItemStatus"][String(correct)];
                let itemAttributes = "";
                
                for (const element of _itemStatusDict["attributes"]) {
                    itemAttributes += element + ', ';
                };

                var itemStatus = "基礎攻撃力: " + _itemStatusDict["baseDmg"] + ", \n属性: " + itemAttributes;
                $("#claimed-Item-Des").text(cleandoc(itemStatus));
                $("#goToOtherURL").show();
            }, 3200);
            if (void(nickName) === undefined){
                resultShown += 1;
            }
        } while (resultShown < 1)
        return;
    };


    if (btn_intr === 0){
        setCorrectCls(quizinfo["questionOne"]["answer"]);
        $("#Des").show();
        $("#questionDescription").text(quizinfo["questionOne"]["description"]);
        if (answer === quizinfo["questionOne"]["answer"]){
            $("#judge").text("正解!!");
            correct += 1;
        } else {
            $("#judge").text("不正解...");
            wrong += 1;
        };
        
        btn_intr += 1;
        lastQuestion += 1;
        if (!(lastQuestion === numOfQuestion)){
            ans_btn.textContent = "次へ";
        } else {
            ans_btn.textContent = "結果を見る";
        };

    } else if (btn_intr === 1){
        removeCorrectCls();
        $(".correctImg").hide();
        ans_btn.textContent = "回答する";
        $("#Des").hide();
        $("#judge").hide();
        $("#questionDescription").hide();
        $("#questionTitle").text("問: " + itemInfo["questionTwo"]["title"]);
        $("#selectionOne").text("1." + itemInfo["questionTwo"]["selFirst"]);
        $("#selectionTwo").text("2." + itemInfo["questionTwo"]["selSecond"]);
        $("#selectionThree").text("3." + itemInfo["questionTwo"]["selThird"]);
        $("#questionCount").text((lastQuestion +1) + "/" + numOfQuestion + "問目");
        answer_sel.checked = false;
        btn_intr += 1;

    } else if (btn_intr === 2){
        setCorrectCls(quizinfo["questionTwo"]["answer"]);
        $("#Des").show();
        $("#judge").show();
        $("#questionDescription").show();
        $("#questionDescription").text(quizinfo["questionTwo"]["description"]);
        if (answer === quizinfo["questionTwo"]["answer"]){
            $("#judge").text("正解!!");
            correct += 1
        } else {
            $("#judge").text("不正解...");
            wrong += 1
        };
        btn_intr += 1;
        lastQuestion += 1;
        if (!(lastQuestion === numOfQuestion)){
            ans_btn.textContent = "次へ";
        } else {
            ans_btn.textContent = "結果を見る";
        };

    } else if (btn_intr === 3){
        removeCorrectCls();
        $(".correctImg").hide();
        ans_btn.textContent = "回答する";
        $("#Des").hide();
        $("#judge").hide();
        $("#questionDescription").hide();
        $("#questionTitle").text("問: " + itemInfo["questionThree"]["title"]);
        $("#selectionOne").text("1." + itemInfo["questionThree"]["selFirst"]);
        $("#selectionTwo").text("2." + itemInfo["questionThree"]["selSecond"]);
        $("#selectionThree").text("3." + itemInfo["questionThree"]["selThird"]);
        $("#questionCount").text((lastQuestion +1) + "/" + numOfQuestion + "問目");
        answer_sel.checked = false;
        btn_intr += 1;

    } else if (btn_intr === 4){
        setCorrectCls(quizinfo["questionThree"]["answer"])
        $("#Des").show();
        $("#judge").show();
        $("#questionDescription").show();
        $("#questionDescription").text(quizinfo["questionThree"]["description"]);
        if (answer === quizinfo["questionThree"]["answer"]){
            $("#judge").text("正解!!");
            correct += 1;
        } else {
            $("#judge").text("不正解...");
            wrong += 1;
        };
        ans_btn.textContent = "次へ";
        btn_intr += 1;
        lastQuestion += 1;
        if (!(lastQuestion === numOfQuestion)){
            ans_btn.textContent = "次へ";
        } else {
            ans_btn.textContent = "結果を見る";
        };

    } else if (btn_intr === 5){
        removeCorrectCls();
        $(".correctImg").hide();
        ans_btn.textContent = "回答する";
        $("#Des").hide();
        $("#judge").hide();
        $("#questionDescription").hide();
        $("#questionTitle").text("問: " + itemInfo["questionFour"]["title"]);
        $("#selectionOne").text("1." + itemInfo["questionFour"]["selFirst"]);
        $("#selectionTwo").text("2." + itemInfo["questionFour"]["selSecond"]);
        $("#selectionThree").text("3." + itemInfo["questionFour"]["selThird"]);
        $("#questionCount").text((lastQuestion +1) + "/" + numOfQuestion + "問目");
        answer_sel.checked = false;
        btn_intr += 1;

    } else if (btn_intr === 6){
        setCorrectCls(quizinfo["questionFour"]["answer"]);
        $("#Des").show();
        $("#judge").show();
        $("#questionDescription").show();
        $("#questionDescription").text(quizinfo["questionFour"]["description"]);
        if (answer === quizinfo["questionFour"]["answer"]){
            $("#judge").text("正解!!");
            correct += 1;
        } else {
            $("#judge").text("不正解...");
            wrong += 1;
        };
        ans_btn.textContent = "次へ";
        btn_intr += 1;
        lastQuestion += 1;
        if (!(lastQuestion === numOfQuestion)){
            ans_btn.textContent = "次へ";
        } else {
            ans_btn.textContent = "結果を見る";
        };

    } else if (btn_intr === 6){
        removeCorrectCls();
        $(".correctImg").hide();
        ans_btn.textContent = "回答する";
        $("#Des").hide();
        $("#judge").hide();
        $("#questionDescription").hide();
        $("#questionTitle").text("問: " + itemInfo["questionFive"]["title"]);
        $("#selectionOne").text("1." + itemInfo["questionFive"]["selFirst"]);
        $("#selectionTwo").text("2." + itemInfo["questionFive"]["selSecond"]);
        $("#selectionThree").text("3." + itemInfo["questionFive"]["selThird"]);
        $("#questionCount").text((lastQuestion +1) + "/" + numOfQuestion + "問目");
        answer_sel.checked = false;
        btn_intr += 1;

    } else if (btn_intr === 7){
        setCorrectCls(quizinfo["questionFive"]["answer"]);
        $("#Des").show();
        $("#judge").show();
        $("#questionDescription").show();
        $("#questionDescription").text(quizinfo["questionFive"]["description"]);
        if (answer === quizinfo["questionFive"]["answer"]){
            $("#judge").text("正解!!");
            correct += 1;
        } else {
            $("#judge").text("不正解...");
            wrong += 1;
        };
        ans_btn.textContent = "次へ";
        btn_intr += 1;
        lastQuestion += 1;
        if (!(lastQuestion === numOfQuestion)){
            ans_btn.textContent = "次へ";
        } else {
            ans_btn.textContent = "結果を見る";
        };
    }
}

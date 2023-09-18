/*! Last huge change: 2023/07/01 22:45 by KANOKIw */
var clientwidth = window.innerWidth
var allclientdata
var clsKagolist
var clientID = localStorage.getItem("clientID");
var showncliendID
var URLinputValue = ""
var user_scrollY = localStorage.getItem("scrollY");

var on_isNicktoggle = false
var isNickPart
var ischecked_0

$(window).on('load', function(){
    var previous = localStorage.getItem("forAdmins-password")

    window.scroll({top: 0});
    if (!localStorage.getItem("forAdmins-password")){
        var e = `
            <h2 style="color: red; display: inline;">*</h2><h1 style="display: inline;">パスワードを入力してください</h1>
            <h3 id="caution" style="color: red;"></h3>
            <input id="passwordinput" style="font-size: 200%;" placeholder=""><br><br>
            <div class="boxes">
                <input type="checkbox" id="dont-show-again" class="pointer">
                <label for="dont-show-again" class="pointer">Don't show again</label>
            </div><br>
            <div id="submit">
                <button type="button" onclick="sumbitpassword()" id="submitbtn">確 定</button>
            </div>
            <br>
            `
        
        $("#password").show()
        $("#password").append(e)
        $("#main").hide()
    } else {
        sumbitpassword(previous)
    }
})

function _do_call(){
    var pd = {
        "clinetID": clientID,
        "fp": "forAdmins.hmtl",
        "log": true,
    }

    !user_scrollY ? user_scrollY = 0 : void(0)
    console.log(user_scrollY)
    window.scroll(0, Number(user_scrollY))
    window.addEventListener("scroll", get_user_scrollY)

    $("#password").hide()
    $("#main").show()
    $("#personal-settings").css("cursor", "pointer")
    $.post("/isNickPart", null).done(res => {
        // たったこれだけのためのインデント
        isNickPart = res
        for (var i of ["A", "B", "C"]){
            if (isNickPart[i]) ischecked_0 = " checked"
        }
        //

        $.post("/allClientData", pd).done(res => {
            allclientdata = res
            var main = document.getElementById("main");
            var clientidlist = Object.keys(allclientdata);
            var btnlength = 0
            var btn = `<a id="addKagobtn" onclick="addKagooverlay(0)">+ 全員に加護を追加</a>`
            var team1btn = `
                <table>
                    <tr>
                        <td>
                            <a id="addKagobtn" onclick="addKagooverlay(1, 1)">+ ランキング_A全員に加護を追加</a>
                        </td>
                        <td>
                            <a id="BANbtn" onclick="removeteamCon(1)">☓  ランキング_Aを削除</a>
                        </td>
                    </tr>
                </table>
                `
            var team2btn = `
                <table>
                    <tr>
                        <td>
                            <a id="addKagobtn" onclick="addKagooverlay(1, 2)">+ ランキング_B全員に加護を追加</a>
                        </td>
                        <td>
                            <a id="BANbtn" onclick="removeteamCon(2)">☓  ランキング_Bを削除</a>
                        </td>
                    </tr>
                </table>
                `
            var team3btn = `
                <table>
                    <tr>
                        <td>
                            <a id="addKagobtn" onclick="addKagooverlay(1, 0)">+ フリー全員に加護を追加</a>
                        </td>
                        <td>
                            <a id="BANbtn" onclick="removeteamCon(0)">☓ フリーを削除</a>
                        </td>
                    </tr>
                </table>
                `

            main.style.width = `${clientwidth}px`
            $("#personal-settings").click(function(){
                personal_settings_overlay()
            })
            $(".overlay").hide();
            $("#loading").remove();
            $(".stuffsquare").css("width", clientwidth/2-50)
            $("#showclientdata").hide()
            $("#main").append(btn);
            
            // チーム1 & チーム2: ...
            for (var type in allclientdata){
                btnlength = 0
                var clientidlist = Object.keys(allclientdata[type]);
                if (type == "1"){
                    $("#main").append(`<div class="team"><h1>ランキング_A</h1>${team1btn}</div>`)
                } else if (type == "0"){
                    btnlength = 0
                    $("#main").append(`<div class="team" style="padding-top: 50px;"><h1>フリー</h1>${team3btn}</div>`)
                } else {
                    btnlength = 0
                    $("#main").append(`<div class="team" style="padding-top: 50px;"><h1>ランキング_B</h1>${team2btn}</div>`)
                }
                for (var clientid of clientidlist){
                    var clientdata = allclientdata[type][clientid]
                    var nickname = clientdata["nickName"];
                    var button = `
                        <div class="showitembtn">
                            <a onclick="showclientdata(${clientid}, ${type})">${nickname}</a>
                        </div>`
                    
                    btnlength++
                    // 単位(px)
                    if (btnlength * 310 > clientwidth){
                        button = '<br>' + button  
                        btnlength = 1
                    }
        
                    $("#main").append(button);
                }
                $("#main").append("<br><br><br><br><br><br>")
            }

            if (clientidlist.length === 0){
                $("#main").empty();
            }
            var editendsAtoverlay = `<br><br>
                <br>
                <table>
                    <tr>
                        <td>
                            <a id="editendsAtbtn" onclick="editEventDetails()">イベント詳細設定</a>
                        </td>
                        <td>
                            <a id="editendsAtbtn" onclick="QRcodeGeneratoroverlay()">QRコード ジェネレーター</a>
                        </td>
                    </tr>
                </table>
                `
            $("#main").prepend(editendsAtoverlay).append("<br><br><br><br><br><br>")
        })

        $.post("/getEndsAt", null).done(res => {
            var ranking_A_BossFight = res["次のランキング_Aボス戦"]
            var nextRanking_A_StartsAt = res["次のランキング_A開催"]
            var ranking_B_BossFight = res["次のランキング_Bボス戦"]
            var nextRanking_B_StartsAt = res["次のランキング_B開催"]
            var freeBossFight = res["次のフリーボス戦"]
            var nextFreeStartsAt = res["次のフリー開催"]

            showtime(ranking_A_BossFight, "#ranking_A_BossFight", "ランキング_Aボス戦")
            showtime(ranking_B_BossFight, "#ranking_B_BossFight", "ランキング_Bボス戦")
            showtime(freeBossFight, "#freeBossFight", "フリーボス戦")
            showtime(nextRanking_A_StartsAt, "#nextRanking_A_StartsAt", "次のランキング_A開催")
            showtime(nextRanking_B_StartsAt, "#nextRanking_B_StartsAt", "次のランキング_B開催")
            showtime(nextFreeStartsAt, "#nextFreeStartsAt", "次のフリー開催")
        })
    })
}

function flash_mob(){
    var p
    showoverlay();
    function e(p){
        if (p){
            $(".window").css("background-color", "red")
            return void(0)
        } else {
            $(".window").css("background-color", "blue")
            return "p"
        }
    }
    setInterval(() => {
        p = e(p);
    }, 50);
}


class random{
    /**
     * @param {Array} list 
     * @returns random choice from array
     */
    static randomchoice(list){
        if (!Array.isArray(list)){
            throw new Error("list was not an array")
        }

        var index = Math.floor(Math.random() * ((list.length) - 0)) + 0;
        return list[index]
    }

    /**
     * a > b, !b -> b = 0
     */
    static randint(a, b){
        if (!b){
            b = 0
        }
    
        var num = Math.floor(Math.random() * (a + 1 - b)) + b
        return num
    }
}


class Kago{
    constructor(name_, level, imageurl, clientid, type){
        this.name_ = name_
        this.level = level
        this.imageurl = imageurl
        this.clientid = clientid
        this.type = type
    }
    
    /**
     * 
     * @param {any} arg 
     * @returns removed kago's information / false
     */
    removethis(arg){
        if (!arg){
            var kagos = allclientdata[this.type][this.clientid]["kagos"]
            var responce = false
            var pd = {
                "clinetID": clientID,
                "fp": "forAdmins.hmtl"
            }

            $.ajaxSetup({async: false}); 
            $.post("/allClientData", pd).done(res => {
                var servdata = JSON.stringify(res[this.type][this.clientid]["kagos"], null, 2)
                var prevdata = JSON.stringify(allclientdata[this.type][this.clientid]["kagos"], null, 2)

                if (prevdata !== servdata){
                    return
                }

                for (var k = 0; k < kagos.length; k++){
                    var kago = kagos[k]
                    if (kago["kagoname"] === this.name_){
                        if (kago["kagolevel"] === this.level){
                            if (kago["kagoimageurl"] === this.imageurl){
                                break
                            }
                        }
                    }
                }

                responce = allclientdata[this.type][this.clientid]["kagos"].splice(k, 1);
            })

            return responce
        }
    }

    /**
     * 
     * @param {String} name_ 
     * @param {String} level 
     * @param {String} imageurl
     * @returns edited kago information / false
     */
    editthis(name_, level, imageurl){
        var kagos = allclientdata[this.type][this.clientid]["kagos"]
        var responce = false
        var pd = {
            "clinetID": clientID,
            "fp": "forAdmins.hmtl"
        }

        $.ajaxSetup({async: false});
        $.post("/allClientData", pd).done(res => {
            var servdata = JSON.stringify(res[this.type][this.clientid]["kagos"], null, 2)
            var prevdata = JSON.stringify(allclientdata[this.type][this.clientid]["kagos"], null, 2)

            if (prevdata !== servdata){
                return
            }

            for (var k = 0; k < kagos.length; k++){
                var kago = kagos[k]
                if (kago["kagoname"] === this.name_){
                    if (kago["kagolevel"] === this.level){
                        if (kago["kagoimageurl"] === this.imageurl){
                            break
                        }
                    }
                }
            }

            var tk = allclientdata[this.type][this.clientid]["kagos"][k]

            tk["kagoname"] = name_
            tk["kagolevel"] = level
            tk["kagoimageurl"] = imageurl
            allclientdata[this.type][this.clientid]["kagos"][k] = tk
            responce = tk
        })

        return responce
    }
}


/**
 * clientidの所持品を表示する
 * @param {String} clientid 
 */
function showclientdata(clientid, type){
    var clientdata = allclientdata[type][clientid]
    var showitembtn = ".showitembtn"
    var showclientdata = document.getElementById("showclientdata")
    var kagos = clientdata["kagos"]
    var items = clientdata["items"]
    var finishedevents = clientdata["finishedevents"]
    var modifytable = `
        <table>
            <tr>
                <td>
                    <a id="BANbtn" onclick="banclientCon(${clientid}, ${type})">☓ ユーザーをBAN</a>
                </td>
                <td>
                    <a id="addKagobtn" onclick="addKagooverlay(2, ${type})">+ 加護を追加</a>
                </td>
            </tr>
        </table>
        `

    clsKagolist = []
    showncliendID = clientid
    
    window.removeEventListener("scroll", get_user_scrollY)
    window.scroll({top: 0});
    $(".team").hide()
    $("#addKagobtn").hide()
    $("#showclientdata").empty();
    $(showitembtn).hide();
    $("#showclientdata").show();
    
    if (!(kagos.length === 0)){
        for (var kago of kagos){
            name_ = kago["kagoname"]
            level = kago["kagolevel"]
            image = kago["kagoimageurl"]

            cls = new Kago(name_, level, image, clientid, type)
            clsKagolist.push(cls)
        }

        var entiretd = `<div class="backbtn"><a onclick="goback()">戻 る</a></div><h1>【${allclientdata[type][clientid]["nickName"]}のデータ】<br><br>加護</h1>${modifytable}`
        for (var i = 0; i < clsKagolist.length; i++){
            kago = clsKagolist[i]
            td = `
                <td>
                    <div class="stuffcontainer">
                    <div class="stuffsquare">
                        <img src="${kago.imageurl}" class="stuffimage">
                        <br>
                        <div class="kagonDescription">${kago.name_}<br>
                            level: ${kago.level}
                        </div>
                        <br>
                        <br>
                        <table class="stuffBtn">
                            <tr>
                                <td>
                                    <a class="editStuffBtn" onclick="editKagooverlay(${i})">編集</a>
                                </td>
                                <td>
                                    <a class="deleteStuffBtn" onclick="deleteKagoConfirm(${i})">削除</a>
                                </td>
                            </tr>
                        </table>
                    </div>
                    </div>
                </td>
                `
            
            if (i%2 === 0 || i === 0){
                td = '<br><table>' + td
                next = i +1
                if (clsKagolist[next] === undefined){
                    td = td + '</table>'
                }
            } else {
                td = td + '</table>'
            }
            entiretd += td
        }

        $("#showclientdata").append(entiretd)
        setTimeout(() => {
            $(".backbtn").css("padding-left", `${clientwidth - 250}px`);
        }, 0);
    } else {
        var url = "https://cdn.discordapp.com/attachments/1083021323967672421/1126034721462300772/logo.png"
        var table = `
            <div class="backbtn"><a onclick="goback()">戻 る</a></div><h1>【${allclientdata[type][clientid]["nickName"]}のデータ】<br><br>加護</h1>${modifytable}
            <table>
                <td>
                    <div class="stuffcontainer">
                    <div class="stuffsquare">
                        <img src="${url}" class="stuffimage" style="width: 50%">
                        <br>
                        <div class="kagonDescription"><br><br>
                            加護未収得
                        </div>
                        <br>
                        <br>
                    </div>
                    </div>
                </td>
            </table>
            `

        $("#showclientdata").append(table)
        setTimeout(() => {
            $(".backbtn").css("padding-left", `${clientwidth - 250}px`);
        }, 0);
    }
}



function goback(){
    window.location.reload()
}


function banclientCon(clientid, type){
    var nickname = allclientdata[String(type)][clientid]["nickName"]
    var overlay = `
        <h1>本当に${nickname}をBANしますか？</h1>
        <h1>
            ニックネーム: ${nickname}<br>
            ID: ${clientid}
        </h1><br>
        <table>
            <tr>
                <td>
                    <a class="editStuffBtn" onclick="hideoverlay()">キャンセル</a>
                </td>
                <td>
                    <a class="deleteStuffBtn" onclick="banclientConfirm(${clientid}, ${type})">はい</a>
                </td>
            </tr>
        </table>
        `

    hideoverlay()
    showoverlay()
    $(".window").css("height", "300px")
    $(".window").css("color", "red")
    $(".window").append(overlay)
}
function banclientConfirm(clientid, type){
    var nickname = allclientdata[String(type)][clientid]["nickName"]
    var overlay = `
        <h1>大事なことなので二回聞きます<br>本当に${nickname}をBANしますか？</h1>
        <h1>
            この操作は取り消せません<br><br>
            ニックネーム: ${nickname}<br>
            ID: ${clientid}
        </h1><br>
        <table>
            <tr>
                <td>
                    <a class="editStuffBtn" onclick="hideoverlay()">キャンセル</a>
                </td>
                <td>
                    <a class="deleteStuffBtn" onclick="banclient(${clientid}, ${type})">はい</a>
                </td>
            </tr>
        </table>
        `

    hideoverlay()
    showoverlay()
    $(".overlay").show()
    $(".window").css("height", "390px")
    $(".window").css("color", "red")
    $(".window").append(overlay)
}
function banclient(clientid, type){
    var type = String(type)
    var pd = {
        "clientid": clientid,
        "fileN": type
    }
    $.post("/removeClient", pd).done(res => {
        hideoverlay()
        showoverlay()
        
        var nickname = allclientdata[type][clientid]["nickName"]
        var overlay = `
            <h1>正常に${nickname}がBANされました<br>
                3秒後に再読み込みします
            </h1>
            `

        hideoverlay()
        showoverlay()
        $(".window").css("height", "150px")
        $(".window").css("color", "green")
        $(".window").append(overlay)
        setTimeout(() => {
            window.location.reload()
        }, 3000);
    })
}


/**
 * 
 * @param {Number} index 
 */
function deleteKagoConfirm(index){
    var kago = clsKagolist[Number.parseInt(index)]
    var overlay = `
        <h1>本当に削除しますか？</h1>
        <h2 id="editcaution""></h2>
        <img src="${kago.imageurl}" class="stuffimage"><br>
        <div class="kagonDescription">
            所有者: チーム${kago.type}, ${allclientdata[kago.type][kago.clientid]["nickName"]}<br>
            ${kago.name_}<br>
            level: ${kago.level}
        </div><br>
        <table>
            <tr>
                <td>
                    <a class="editStuffBtn" onclick="hideoverlay()">キャンセル</a>
                </td>
                <td>
                    <a id="delKagobtn" class="deleteStuffBtn" onclick="deleteKago(${index})">削除</a>
                </td>
            </tr>
        </table>
        `

    hideoverlay()
    showoverlay()
    $(".window").css("height", "680px")
    $(".window").css("color", "red")
    $(".window").append(overlay)
}
/**
 * 
 * @param {Number} index 
 */
function deleteKago(index){
    var kago = clsKagolist[index];
    var statu = kago.removethis();

    if (!statu){
        reload()
        return
    }
    
    var kagos = allclientdata[kago.type][clsKagolist[index].clientid]["kagos"]

    postUpdatekagos(kago, kagos, true)

    var btn = document.getElementById("delKagobtn")
    btn.onclick = null;
}



/**
 * 
 * @param {Number} index 
 */
function editKagooverlay(index){
    var kago = clsKagolist[Number.parseInt(index)]
    var overlay = `
        <h1>${kago.name_}を編集中</h1>
        <h2 id="editcaution""></h2>
        <img src="${kago.imageurl}" class="stuffimage"><br>
        <h1>
            所有者: ${allclientdata[kago.type][kago.clientid]["nickName"]}
        </h1>
        <h1>名前<br>
            <input type="text" placeholder="${kago.name_}" value="${kago.name_}" class="editinput" id="kagonameinput"><br><br>
            レベル<br>
            <input type="text" placeholder="${kago.level}" value="${kago.level}" class="editinput" id="kagolevelinput"><br><br>
            画像URL<br>
            <input type="text" placeholder="${kago.imageurl}" value="${kago.imageurl}" class="editinput" id="kagoimageurlinput"><br>
        </h1>
        <br>
        <table>
            <tr>
                <td>
                    <a class="editStuffBtn" onclick="hideoverlay()">キャンセル</a>
                </td>
                <td>
                    <a class="deleteStuffBtn" onclick="editKago(${index})">確定</a>
                </td>
            </tr>
        </table>
        `

    hideoverlay()
    showoverlay()

    $(".window").css("height", "1000px")
    $(".window").css("color", "black")
    $(".window").append(overlay)
}
/**
 * 
 * @param {Number} index
 */
function editKago(index){
    var kago = clsKagolist[Number.parseInt(index)]
    var kagoname = document.getElementById("kagonameinput").value
    var kagolevel = document.getElementById("kagolevelinput").value
    var imageurl = document.getElementById("kagoimageurlinput").value
    var kagolevelArray = Array.from(kagolevel)
    var numcaution = false

    $("#editcaution").css("color", "red")

    for (let i = 0; i < kagolevelArray.length; i++){
        if (String(Number.parseFloat(kagolevelArray[i])) === "NaN"){
            numcaution = true
        }
    }

    if (!kagoname || !kagolevel || !imageurl){
        $("#editcaution").text("未入力のフィールドがあります")
        $(".window").css("height", "1060px")
        return

    } else if (numcaution){
        $("#editcaution").text("levelが数値ではありません")
        $(".window").css("height", "1060px")
        return
    } else if (!isImageUrl(imageurl)){
        $("#editcaution").text("無効な画像URLです")
        $(".window").css("height", "1060px")
        return
    }

    var statu = kago.editthis(kagoname, kagolevel, imageurl)

    if (!statu){
        reload()
        return
    }

    var kagos = allclientdata[kago.type][kago.clientid]["kagos"]

    postUpdatekagos(kago, kagos)
}


function addKagooverlay(mode, type){
    var overlay = `
        <h1>加護を追加</h1>
        <h2 id="editcaution"></h2>
        <h1>名前<br>
            <input type="text" placeholder="名前" class="editinput" id="kagonameinput"><br><br>
            レベル<br>
            <input type="text" placeholder="数値" class="editinput" id="kagolevelinput"><br><br>
            画像URL<br>
            <input type="text" placeholder="URL" class="editinput" id="kagoimageurlinput"><br>
        </h1>
        <br>
        <table>
            <tr>
                <td>
                    <a class="editStuffBtn" onclick="hideoverlay()">キャンセル</a>
                </td>
                <td>
                    <a id="btn" class="deleteStuffBtn" onclick="addKago(${mode}, ${type})">確定</a>
                </td>
            </tr>
        </table>
        `

    hideoverlay()
    showoverlay()
    $(".window").css("height", "550px")
    $(".window").css("color", "black")
    $(".window").append(overlay)
}
function addKago(mode, type){
    var kagoname = document.getElementById("kagonameinput").value
    var kagolevel = document.getElementById("kagolevelinput").value
    var imageurl = document.getElementById("kagoimageurlinput").value
    var kagolevelArray = Array.from(kagolevel)
    var numcaution = false
    var type = String(type)
    var newKago = {
        "kagoname": kagoname,
        "kagolevel": kagolevel,
        "kagoimageurl": imageurl
    }
    console.log(mode, type)
    $("#editcaution").css("color", "red")

    for (let i = 0; i < kagolevelArray.length; i++){
        if (String(Number.parseFloat(kagolevelArray[i])) === "NaN"){
            numcaution = true
        }
    }

    if (!kagoname || !kagolevel || !imageurl){
        $("#editcaution").text("未入力のフィールドがあります")
        $(".window").css("height", "610px")
        return

    } else if (numcaution){
        $("#editcaution").text("levelが数値ではありません")
        $(".window").css("height", "610px")
        return
    } else if (!isImageUrl(imageurl)){
        $("#editcaution").text("無効な画像URLです")
        $(".window").css("height", "610px")
        return
    }
    
    if (mode == "0"){
        // チーム関係なく全員へ
        $.post("/addKagoToAllteam", newKago).done(res => {
            if (!res){
                var overlay = `
                    <h1>重大なバグが発生しました<br>
                    いそいで解決してください</h1>
                    `

                hideoverlay()
                showoverlay()
                
                $(".window").append(overlay)
                $(".window").css("height", "140px")
                $(".window").css("max-width", "600px")
                $(".window").css("color", "red")

                return
            }
            $("#editcaution").text("成功！")
            $("#editcaution").css("color", "green")
            $(".window").css("height", "610px")
            var btn = document.getElementById("btn")
            btn.onclick = null;
            setTimeout(() => {
                hideoverlay()
            }, 3000);
        })
    } else if (mode == "1"){
        var pd = {
            "newKago": newKago,
            "fileN": type
        }
        $.post("/addKagoToSingleteam", pd).done(res => {
            $("#editcaution").text("成功！")
            $("#editcaution").css("color", "green")
            $(".window").css("height", "610px")
            setTimeout(() => {
                hideoverlay()
            }, 3000);
        })
    } else {
        // 特定の人に付与
        var pd = {
            "clientid": null
        }
        $.ajaxSetup({async: false}); 
        $.post("/allClientData", pd).done(res => {
            var servdata = JSON.stringify(res[type][showncliendID]["kagos"], null, 2)
            var prevdata = JSON.stringify(allclientdata[type][showncliendID]["kagos"], null, 2)

            if (prevdata !== servdata){
                reload()
                return
            }
            
            var kago = new Kago(kagoname, kagolevel, imageurl, showncliendID, type)
            var kagos = allclientdata[String(type)][kago.clientid]["kagos"]

            allclientdata[type][showncliendID]["kagos"].push(newKago)

            postUpdatekagos(kago, kagos, false, true)

            var btn = document.getElementById("btn")
            btn.onclick = null;
        })
    }
}



/**
 * 全タイプのオーバーレイを表示(スクロール抑制)
 */
function showoverlay(){
    var e = `<span class="square_btn" onclick="hideoverlay()"></span>`
    document.addEventListener('touchmove', disableScroll, { passive: false });
    document.addEventListener('mousewheel', disableScroll, { passive: false });
    $(".overlay").show();
    $("#overlay").show();
    $(".window").append(e)
}



/**
 * 全タイプのオーバーレイを非表示(スクロール解除)
 */
function hideoverlay(){
    document.removeEventListener('touchmove', disableScroll, { passive: false });
    document.removeEventListener('mousewheel', disableScroll, { passive: false });
    $(".overlay").hide();
    $(".window").empty();
    $("#overlay").hide();
}


/**
 * 
 * @param {Kago} kago 
 * @param {Array} kagos 
 * @param {boolean} remove 
 * @param {boolean} add 
 */
function postUpdatekagos(kago, kagos, remove=false, add=false){
    var postdata = {
        "kagos": kagos,
        "clientid": kago.clientid,
        "clientname": allclientdata[kago.type][kago.clientid]["nickName"],
        "kagoname": kago.name_,
        "fileN": kago.type
    }

    if (remove){
        postdata["removedkago"] = true  
    } else if (add){
        postdata["addedkago"] = true 
    }

    $.post("/updatekagos", postdata).done(res => {
        showclientdata(kago.clientid, kago.type)
        $("#editcaution").text("成功！")
        $("#editcaution").css("color", "green")
        
        setTimeout(() => {
            hideoverlay()
        }, 3000);
    })
}


function removeteamCon(type){
    var overlay = `
        <h1>チーム${type}を削除しようとしています。<br>
            本当に実行しますか？
        </h1>
        <br><br>
        <table>
            <tr>
                <td>
                    <a class="editStuffBtn" onclick="hideoverlay()">キャンセル</a>
                </td>
                <td>
                    <a class="deleteStuffBtn" onclick="removeteamConfirm(${type})">はい</a>
                </td>
            </tr>
        </table>
        `

    hideoverlay()
    showoverlay()
    $(".window").append(overlay)
    $(".window").css("height", "250px")
}
function removeteamConfirm(type){
    var overlay = `
        <h1>
            ほんとに？
        </h1>
        <br><br>
        <table>
            <tr>
                <td>
                    <a class="editStuffBtn" onclick="hideoverlay()">うそ</a>
                </td>
                <td>
                    <a class="deleteStuffBtn" onclick="removeteam(${type})">ほんと</a>
                </td>
            </tr>
        </table>
        `

    hideoverlay()
    showoverlay()

    $(".window").append(overlay)
    $(".window").css("height", "170px")
}
function removeteam(type){
    var pd = {
        "fileN": String(type)
    }
    $.post("/removeteam", pd).done(res => {
        console.log(res)
        if (!res){
            var overlay = `
                <h1>重大なエラーが発生しました<br>
                いそいで解決してください</h1>
                `

            hideoverlay()
            showoverlay()
            
            $(".window").append(overlay)
            $(".window").css("height", "140px")
            $(".window").css("max-width", "600px")
            $(".window").css("color", "red")

            return
        }

        reload(1)
    })
}


function editEventDetails(){
    var overlay = `
        <h1>
            イベント詳細設定
        </h1>
        <br><br>
        <table>
            <tr>
                <td>
                    <a class="greenbtn" onclick="toggleisNickPartoverlay()">登録許可を切り替え</a>
                </td>
                <td>
                    <a class="greenbtn">実装待機中</a>
                </td>
            </tr>
        </table>
        <br>
        <table>
            <tr>
                <td>
                    <a class="greenbtn" onclick="editendsAtoverlay()">イベント時刻を編集</a>
                </td>
                <td>
                    <a class="greenbtn" onclick="editnickURLIDoverlay()">ホワリスURLのIDを変更</a>
                </td>
            </tr>
        </table>
        <br><br><br><br><br><br><br><br>
        <table>
            <tr>
                <td>
                    <a class="editStuffBtn" onclick="hideoverlay()">戻 る</a>
                </td>
            </tr>
        </table>
        `

    hideoverlay()
    showoverlay()
    $(".window").append(overlay)
}


function editendsAtoverlay(){
    $.post("/getEndsAt", null).done(res => {
        var ranking_ABossFight = res["次のランキング_Aボス戦"]
        var nextRanking_AStartsAt = res["次のランキング_A開催"]
        var ranking_BBossFight = res["次のランキング_Bボス戦"]
        var nextRanking_BStartsAt = res["次のランキング_B開催"]
        var freeBossFight = res["次のフリーボス戦"]
        var nextFreeStartsAt = res["次のフリー開催"]

        var overlay = `
            <h1>時間設定を編集中</h1>
            <h2 id="editcaution""></h2>
            <h2>次のランキング_Aボス戦(rankingBossFight)<br>
                <input type="text" class="editinput" id="ranking_A_BossFightw" value="${ranking_ABossFight}"><br><br>
                次のランキング_A開催(nextRankingStartsAt)<br>
                <input type="text" class="editinput" id="nextRanking_A_StartsAtw" value="${nextRanking_AStartsAt}"><br><br>

                次のランキング_Bボス戦(rankingBossFight)<br>
                <input type="text" class="editinput" id="ranking_B_BossFightw" value="${ranking_BBossFight}"><br><br>
                次のランキング_B開催(nextRankingStartsAt)<br>
                <input type="text" class="editinput" id="nextRanking_B_StartsAtw" value="${nextRanking_BStartsAt}"><br><br>

                次のフリーボス戦(freeBossFight)<br>
                <input type="text" class="editinput" id="freeBossFightw" value="${freeBossFight}"><br><br>
                次のフリー開催(nextFreeStartsAt)<br>
                <input type="text" class="editinput" id="nextFreeStartsAtw" value="${nextFreeStartsAt}"><br>
            </h2>
            <br>
            <table>
                <tr>
                    <td>
                        <a class="editStuffBtn" onclick="editEventDetails()">戻 る</a>
                    </td>
                    <td>
                        <a class="deleteStuffBtn" onclick="editendsAt()">確定</a>
                    </td>
                </tr>
            </table>
            `

        hideoverlay()
        showoverlay()

        $(".window").append(overlay).css("height", "720px")
    })
}
function editendsAt(){
    var ranking_ABossFight = document.getElementById("ranking_A_BossFightw").value
    var nextRanking_AStartsAt = document.getElementById("nextRanking_A_StartsAtw").value
    var ranking_BBossFight = document.getElementById("ranking_B_BossFightw").value
    var nextRanking_BStartsAt = document.getElementById("nextRanking_B_StartsAtw").value
    var freeBossFight = document.getElementById("freeBossFightw").value
    var nextFreeStartsAt = document.getElementById("nextFreeStartsAtw").value
    var i = 0
    var l = [
        ranking_ABossFight,
        nextRanking_AStartsAt,
        ranking_BBossFight,
        nextRanking_BStartsAt,
        freeBossFight,
        nextFreeStartsAt
    ]
    console.log(l)

    for (var time of l){
        i++
        if (String(new Date(time).getTime()) === "NaN"){
            $("#editcaution").text(`間違っている箇所があります(${i}つめ)`)
            $("#editcaution").css("color", "red")
            return
        }
    }

    var endsAt = {
        "次のランキング_Aボス戦": ranking_ABossFight,
        "次のランキング_A開催": nextRanking_AStartsAt,
        "次のランキング_Bボス戦": ranking_BBossFight,
        "次のランキング_B開催": nextRanking_BStartsAt,
        "次のフリーボス戦": freeBossFight,
        "次のフリー開催": nextFreeStartsAt
    }
    $.post("/modifyendsAt", endsAt).done(res => {
        if (!res){
            var overlay = `
                <h1>重大なバグが発生しました<br>
                いそいで解決してください</h1>
                `

            hideoverlay()
            showoverlay()
            
            $(".window").append(overlay)
            $(".window").css("height", "140px")
            $(".window").css("max-width", "600px")
            $(".window").css("color", "red")

            return
        }

        reload(1)
    })
}


function editnickURLIDoverlay(){
    $.post("/getnickURLID", null).done(res => {
        var freeURLID = res["free"]
        var rankingURLID_A = res["ranking_A"]
        var rankingURLID_B = res["ranking_B"]
        console.log(res)
        var overlay = `
            <h1>ホワリスURLのIDを編集中</h1>
            <h2 id="editcaution""></h2>
            <h1>現在のフリー用のID: <br>
                <h1 style="color: blue;">${freeURLID}</h1>
                
                <h1>新しいID: <br>
                <input type="text" class="editinput" id="newFreeID"><br></h1>
            </h1>
            <div class="longUnderLinew"></div>
            <h1>現在のランキング用_AのID: <br>
                <h1 style="color: blue;">${rankingURLID_A}</h1>
                
                <h1>新しいID: <br>
                <input type="text" class="editinput" id="newRankingID_A"><br></h1>
            </h1>
            <div class="longUnderLinew"></div>
            <h1>現在のランキング_B用のID: <br>
                <h1 style="color: blue;">${rankingURLID_B}</h1>
                
                <h1>新しいID: <br>
                <input type="text" class="editinput" id="newRankingID_B"><br></h1>
            </h1>
            <br>
            <table>
                <tr>
                    <td>
                        <a class="editStuffBtn" onclick="editEventDetails()">戻 る</a>
                    </td>
                    <td>
                        <a id="btn" class="deleteStuffBtn" onclick="editnickURLID()">確定</a>
                    </td>
                </tr>
            </table>
            `

        hideoverlay()
        showoverlay()
        $(".window").append(overlay).css("height", "920px")
    })
}
function editnickURLID(){
    var freenewID = document.getElementById("newFreeID").value
    var rankingnewID_A = document.getElementById("newRankingID_A").value
    var rankingnewID_B = document.getElementById("newRankingID_B").value
    var pd = {
        "free": freenewID,
        "ranking_A": rankingnewID_A,
        "ranking_B": rankingnewID_B
    }

    for (var newID of [freenewID, rankingnewID_A, rankingnewID_B])
    if (newID.length < 5){
        $("#editcaution").text("どちらも6文字以上でなければいけません").css("color", "red")
        $(".window").css("height", "930px")
        return
    }

    $.post("/modifynickURLID", pd).done(res => {
        if (!res){
            reload(2)
            return
        }

        $("#editcaution").text("成功！")
        $("#editcaution").css("color", "green")
        $(".window").css("height", "950px")
        document.getElementById("btn").onclick = null

        setTimeout(() => {
            window.location.reload()
        }, 5000);
    })
}
function QRcodeGeneratoroverlay(){
    var overlay = `
        <br>
        <h1>QRコードジェネレーター</h1><br>
        <h2 id="editcaution"></h2><br>

        <h1>http://もしくはhttps://で始まるURLを入力: <br>
        <input type="text" class="editinput" id="URLinput" value="${URLinputValue}"><br></h1>

        <br>
        <table>
            <tr>
                <td>
                    <a class="editStuffBtn" onclick="hideoverlay()">戻 る</a>
                </td>
                <td>
                    <a id="btn" class="deleteStuffBtn" onclick="QRcodeGenerator()">生成</a>
                </td>
            </tr>
        </table>
        `

    hideoverlay()
    showoverlay()
    $(".window").append(overlay)
}
function QRcodeGenerator(){
    var URL = document.getElementById("URLinput").value.replace(" ", "").replace("　", "")
    var caution = document.getElementById("caution")
    var pd = {
        "URL": URL
    }

    URLinputValue = URL

    if (!URL || !URL.includes("http://") && !URL.includes("https://")){
        $("#editcaution").text("URLはhttp://, もしくはhttps://で始まらなければいけません")
        $("#editcaution").css("color", "red")
        return
    }

    $.post("/generateQRcode", pd).done(res => {
        var src = res

        if (!src){
            reload(2)
            return
        }

        showimageoverlay(src, "QRcodeGeneratoroverlay()", `${URL}のQRコード`)
    })
}


function reload(mode){
    if (!mode){
        var overlay = `
            <h1>
                [Something went wrong]
                編集中にデータが更新されました。<br>
                事故を防ぐために5秒後にページがリロードされます<br>
                はじめからやりなおしてください
            </h1>
            `

    } else if (mode == 1){
        var overlay = `
            <h1>
                正常に処理が完了しました<br>
                5秒後にページがリロードされます<br>
                おまちください
            </h1>
            `

    } else if (mode == 2){
        var overlay = `
            <h1>
                [Something went wrong]
                [unknown error occured]
                予期せぬエラーらしいよ
            </h1>
            `
    }

    hideoverlay();
    showoverlay();
    
    setTimeout(() => {
        $(".window").append(overlay);
        $(".window").css("height", "200px");
        $(".window").css("max-width", "900px");
        if (mode == 1){
            $(".window").css("color", "green");
        } else {
            $(".window").css("color", "red");
        }
    }, 0);

    setTimeout(() => {
        window.location.reload()
    }, 5000);

    return
}


function showimageoverlay(src, gobackfunction, msg=""){
    var overlay = `
        <h1>${msg}</h1>
        <img src="${src}" alt="image" id="showimageoverlayimage">
        <table>
            <tr>
                <td>
                    <a class="editStuffBtn" onclick="${gobackfunction}">戻 る</a>
                </td>
                <td>
                    <a href="${src}" download="QRcode.png" class="GreenBoxedbtn">保 存</a>
                </td>
            </tr>
        </table>
        `

    hideoverlay();
    showoverlay();
    $(".window").append(overlay);
}



function isImageUrl(url) {
    try {
        const imageUrl = new URL(url);
        const imageExtensions = [".gif", ".jpeg", ".jpg", ".png", ".webp", ".bmp"];
        const extension = imageUrl.pathname.toLowerCase().split('.').pop();
        return imageExtensions.includes(`.${extension}`);
    } catch(e){
        return false;
    }
}

function showtime(time, element, msg){
    var countDownDate = new Date(time).getTime();
    var countdown = setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (days === 0 && minutes === 0 && hours === 0){
            $(element).text(`${msg}: ${seconds}秒 後`);
        } else if (hours === 0 && days === 0){
            $(element).text(`${msg}: ${minutes}分 ${seconds}秒 後`);
        } else if (days === 0 && !(hours === 0) && !(minutes === 0)){
            $(element).text(`${msg}: ${hours}時間 ${minutes}分 ${seconds}秒 後`);
        } else {
            $(element).text(`${msg}: ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒 後`);
        }

        if (distance <= 0) {
            clearInterval(countdown);
            $(element).css("color", "red");
            $(element).append(`<h2>${msg}: </h2>`)
            $(element).text(`すぐに設定し直してください。時間がマイナスになりました`);
        } else if (distance <= 120000) {
            $(element).css("color", "blue")
            if (days === 0 && minutes === 0 && hours === 0){
                $(element).text(`${msg}: ${seconds}秒 後`);
            } else if (hours === 0 && days === 0){
                $(element).text(`${msg}: ${minutes}分 ${seconds}秒 後`);
            }
        }
    }, 1000);
}



function sumbitpassword(previous=null){
    var password;
    var dsa = false;

    if (!previous){
        password = document.getElementById("passwordinput").value;
        var dntshwagn_bool = document.getElementById("dont-show-again").checked;
        
        if (!password){
            $("#caution").text("このフォームは必須です");
            return
        }
    } else {
        password = previous;
        dsa = true;
    }

    dntshwagn_bool ? dsa = true : void(0);
    previous ? dsa = true : void(0);

    var pd = {
        "password": password,
        "dsa": dsa
    }
    $.post("/forAdminspassword", pd).done(res => {
        if (!res){
            $("#password").hide();
            $("#forbidden").show();
            if (previous){
                var btn = `
                    <br><br>
                    <div id="submit">
                        <button type="button" onclick="resetAdminsSelf()" id="submitbtn">Continue</button>
                    </div>
                `

                $("#forbidden-reason").text("password has been changed, click the middle button to continue").append(btn);
            }
            return
        }

        if (dntshwagn_bool && !previous){
            localStorage.setItem("forAdmins-password", password);
        }

        _do_call();
    })
}
/**
 * Self Handler sys -> up to 3 buttons
 */
function personal_settings_overlay(){
    var ul_list = []
    var li = ""
    var br = ""
    var e = 12
    var bool_of_pw = localStorage.getItem("forAdmins-password")
    var disabled = ""
    var id = 'id="submit"'
    var onclick = ' onclick="resetAdminsSelf()"'

    if (bool_of_pw){
        bool_of_pw = "saved password to localStorage"
        ul_list.push(bool_of_pw)
    }

    if (ul_list.length === 0){
        li = "<li class='toLeft'>You can't initialize yourself without any limited data!!"
        disabled = ' class="disabled-button"'
        id = 'id="not-allowed-submit"'
        e = 10
        onclick = ""
        setTimeout(() => {
            $(".toLeft").css("color", "red")
            $("#submit").css("cursor", "not-allowed")
        }, 0);
    }

    for (let cell of ul_list){
        li = li + "<li class='toLeft'>" + cell
        e--
    }

    for (let r = 0; r < e; r++){
        br = br + "<br>"
    }
    
    var src = "https://cdn.discordapp.com/icons/1101399573991268374/a_c3ede8a7240af692d46e1d786b13dbb8.gif?size=1024"
    var btn = `
        <br><br>
        <div ${id}>
            <button type="button"${onclick} id="submitbtn"${disabled}>init self</button>
        </div>
        `
    var img = `<img src="${src}" id="Setaga-Quest-IMG" style="width: 4%; display: inline; padding-top: 1%">`
    var overlay = `
        <h1 style="display: inline; color: red;"><${img}>Self Handler<${img}></h1>
        <br><br>
        <h1>Current Condition(self):
            <ul id="indented">
                ${li}
            </ul>
        </h1>
        ${btn}
        ${br}
        `

    hideoverlay();
    showoverlay();
    $(".window").append(overlay);
}

function resetAdminsSelf(){
    localStorage.removeItem("forAdmins-password");
    localStorage.removeItemItem("scrollY");
    window.location.reload();
}

function sleep(waitMsec) {
    var startMsec = new Date();
    while (new Date() - startMsec < waitMsec);
}

function disableScroll(event) {
    event.preventDefault();
}

function get_user_scrollY(){
	user_scrollY = window.scrollY;
    localStorage.setItem("scrollY", user_scrollY)
}

function toggleisNickPartoverlay(){
    var overlay = `<br>
    <div id="toggleisNick_0" style="display: inline;">
        <input type="checkbox" id="toggle_isNickPart_0"${ischecked_0} style="display: none;" name="toggle_isNickPart_0">
        <label id="llball" onclick="toggleisNickPart(0)"></label>
    </div><h1 style="display: inline;">A_ニックネーム登録を許可する</h1>
    `

    hideoverlay()
    showoverlay()
    $(".window").append(overlay)
}

function toggleisNickPart(type){
    var toggleElement = document.getElementById(`toggle_isNickPart_${type}`)
    var type_matches = ["A", "B", "N"]
    type = type_matches[type]
    
    if (on_isNicktoggle){
        if (toggleElement.checked) toggleElement.checked = false
        if (!toggleElement.checked) toggleElement.checked = true
        return
    }
    on_isNicktoggle = true
    if(!toggleElement.checked) {
        var pd = {
            "isNickPart": true
        }
        $.post(`/toggle_isNickPart_${type}`, pd).done(res => {
            if (res == "error"){
                window.location.reload()
                return
            }

            isNickPart = res[type]
            toggleElement.checked = true
            on_isNicktoggle = false
            ischecked_0 = " checked"
        })
    } else {
        var pd = {
            "isNickPart": false
        }
        $.post(`/toggle_isNickPart_${type}`, pd).done(res => {
            if (res == "error"){
                window.location.reload()
                return
            }

            isNickPart = res[type]
            toggleElement.checked = false
            on_isNicktoggle = false
            ischecked_0 = ""
        })
    }
}

function iOStoggle() {
    var toggleisNick = document.getElementById("toggle_isNickPart")

    if (on_isNicktoggle){
        if (toggleisNick.checked) toggleisNick.checked = false
        if (!toggleisNick.checked) toggleisNick.checked = true
        return
    }
    on_isNicktoggle = true
    if(!toggleisNick.checked) {
        var pd = {
            "isNickPart": true
        }
        $.post("/toggle_isNickPart", pd).done(res => {
            if (res == "error"){
                window.location.reload()
                return
            }

            isNickPart = res
            toggleisNick.checked = true
            on_isNicktoggle = false
        })
    } else {
        var pd = {
            "isNickPart": false
        }
        $.post("/toggle_isNickPart", pd).done(res => {
            if (res == "error"){
                window.location.reload()
                return
            }

            isNickPart = res
            toggleisNick.checked = false
            on_isNicktoggle = false
        })
    }
};

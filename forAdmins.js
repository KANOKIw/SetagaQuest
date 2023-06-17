var clientwidth = window.innerWidth
var allclientdata
var clsKagolist
var clientID = localStorage.getItem("clientID");
var showncliendID
var URLinputValue = ""

$(window).on('load', function(){
    var e = `
        <h1>パスワードを入力してください</h1>
        <h2 id="caution" style="color: red;"></h2>
        <input id="passwordinput" style="font-size: 200%;" placeholder=""><br><br>
        <div id="submit">
            <button type="button" onclick="sumbitpassword()" id="submitbtn">確 定</button>
        </div>
        <br>
        `
    
    $("#password").show()
    $("#password").append(e)
    $("#main").hide()
})

function _do_call(){
    var pd = {
        "clinetID": clientID,
        "fp": "forAdmins.hmtl",
        "log": true
    }

    $("#password").hide()
    $("#main").show()
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
                        <a id="addKagobtn" onclick="addKagooverlay(1, 1)">+ チーム1全員に加護を追加</a>
                    </td>
                    <td>
                        <a id="BANbtn" onclick="removeteamCon(1)">☓ チーム1を削除</a>
                    </td>
                </tr>
            </table>
            `
        var team2btn = `
            <table>
                <tr>
                    <td>
                        <a id="addKagobtn" onclick="addKagooverlay(1, 2)">+ チーム2全員に加護を追加</a>
                    </td>
                    <td>
                        <a id="BANbtn" onclick="removeteamCon(2)">☓ チーム2を削除</a>
                    </td>
                </tr>
            </table>
            `
        var team3btn = `
            <table>
                <tr>
                    <td>
                        <a id="addKagobtn" onclick="addKagooverlay(1, 3)">+ チーム3全員に加護を追加</a>
                    </td>
                    <td>
                        <a id="BANbtn" onclick="removeteamCon(3)">☓ チーム3を削除</a>
                    </td>
                </tr>
            </table>
            `

        main.style.width = `${clientwidth}px`
        $(".overlay").hide();
        $("#loading").remove();
        $(".stuffsquare").css("width", clientwidth/2-50)
        $("#showclientdata").hide()
        $("#main").append(btn);
        
        // チーム1 & チーム2
        for (var team in allclientdata){
            var clientidlist = Object.keys(allclientdata[team]);
            if (team == "1"){
                $("#main").append(`<div class="team"><h1>チーム1</h1>${team1btn}</div>`)
            } else if (team == "2"){
                btnlength = 0
                $("#main").append(`<div class="team" style="padding-top: 50px;"><h1>チーム2</h1>${team2btn}</div>`)
            } else {
                btnlength = 0
                $("#main").append(`<div class="team" style="padding-top: 50px;"><h1>チーム3</h1>${team3btn}</div>`)
            }
            for (var clientid of clientidlist){
                var clientdata = allclientdata[team][clientid]
                var nickname = clientdata["nickName"];
                var button = `
                    <div class="showitembtn">
                        <a onclick="showclientdata(${clientid}, ${team})">${nickname}</a>
                    </div>`
                
                btnlength++
                // 単位(px)
                if (btnlength * 310 > clientwidth){
                    button = '<br>' + button  
                    btnlength = 1
                }
    
                $("#main").append(button);
            }
        }

        if (clientidlist.length === 0){
            $("#main").empty();
        }
        var editendsAtoverlay = `<br><br>
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
        $("#main").prepend(editendsAtoverlay)
    })
    $.post("/getEndsAt", null).done(res => {
        var team1endsAt = res["endsAt"]["1"]
        var team2endsAt = res["endsAt"]["2"]
        var team3endsAt = res["endsAt"]["3"]
        var nextStartsAt = res["nextStartsAt"]

        shotime(team1endsAt, "#team1endsAt", "チーム1集合")
        shotime(team2endsAt, "#team2endsAt", "チーム2集合")
        shotime(team3endsAt, "#team3endsAt", "チーム3集合")
        shotime(nextStartsAt, "#nextStartsAt", "次の開催")
    })
}

function p(){
    showoverlay()
    $(".window").css("background-color", "blue")
    setTimeout(() => {
        $(".window").css("background-color", "red")
        window.location.reload()
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
    constructor(name_, level, imageurl, clientid, team){
        this.name_ = name_
        this.level = level
        this.imageurl = imageurl
        this.clientid = clientid
        this.team = team
    }
    
    /**
     * 
     * @param {any} arg 
     * @returns removed kago's information / false
     */
    removethis(arg){
        if (!arg){
            var kagos = allclientdata[this.team][this.clientid]["kagos"]
            var responce = false
            var pd = {
                "clinetID": clientID,
                "fp": "forAdmins.hmtl"
            }

            $.ajaxSetup({async: false}); 
            $.post("/allClientData", pd).done(res => {
                var servdata = JSON.stringify(res[this.team][this.clientid]["kagos"], null, 2)
                var prevdata = JSON.stringify(allclientdata[this.team][this.clientid]["kagos"], null, 2)

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

                responce = allclientdata[this.team][this.clientid]["kagos"].splice(k, 1);
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
        var kagos = allclientdata[this.team][this.clientid]["kagos"]
        var responce = false
        var pd = {
            "clinetID": clientID,
            "fp": "forAdmins.hmtl"
        }

        $.ajaxSetup({async: false});
        $.post("/allClientData", pd).done(res => {
            var servdata = JSON.stringify(res[this.team][this.clientid]["kagos"], null, 2)
            var prevdata = JSON.stringify(allclientdata[this.team][this.clientid]["kagos"], null, 2)

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

            var tk = allclientdata[this.team][this.clientid]["kagos"][k]

            tk["kagoname"] = name_
            tk["kagolevel"] = level
            tk["kagoimageurl"] = imageurl
            allclientdata[this.team][this.clientid]["kagos"][k] = tk
            responce = tk
        })

        return responce
    }
}


/**
 * clientidの所持品を表示する
 * @param {String} clientid 
 */
function showclientdata(clientid, team){
    var clientdata = allclientdata[team][clientid]
    var showitembtn = ".showitembtn"
    var showclientdata = document.getElementById("showclientdata")
    var kagos = clientdata["kagos"]
    var items = clientdata["items"]
    var finishedevents = clientdata["finishedevents"]
    var modifytable = `
        <table>
            <tr>
                <td>
                    <a id="BANbtn" onclick="banclientCon(${clientid}, ${team})">☓ ユーザーをBAN</a>
                </td>
                <td>
                    <a id="addKagobtn" onclick="addKagooverlay(2, ${team})">+ 加護を追加</a>
                </td>
            </tr>
        </table>
        `

    clsKagolist = []
    showncliendID = clientid
    
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

            cls = new Kago(name_, level, image, clientid, team)
            clsKagolist.push(cls)
        }

        var entiretd = `<div class="backbtn"><a onclick="goback()">戻 る</a></div><h1>【${allclientdata[team][clientid]["nickName"]}のデータ】<br><br>加護</h1>${modifytable}`
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
        var url = "https://cdn.discordapp.com/icons/1101399573991268374/a_c3ede8a7240af692d46e1d786b13dbb8.gif?size=1024"
        var table = `
            <div class="backbtn"><a onclick="goback()">戻 る</a></div><h1>【${allclientdata[team][clientid]["nickName"]}のデータ】<br><br>加護</h1>${modifytable}
            <table>
                <td>
                    <div class="stuffcontainer">
                    <div class="stuffsquare">
                        <img src="${url}" class="stuffimage">
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


function banclientCon(clientid, team){
    var nickname = allclientdata[String(team)][clientid]["nickName"]
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
                    <a class="deleteStuffBtn" onclick="banclientConfirm(${clientid}, ${team})">はい</a>
                </td>
            </tr>
        </table>
        `

    $(".overlay").show()
    $(".window").css("height", "300px")
    $(".window").css("color", "red")
    $(".window").append(overlay)
}
function banclientConfirm(clientid, team){
    var nickname = allclientdata[String(team)][clientid]["nickName"]
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
                    <a class="deleteStuffBtn" onclick="banclient(${clientid}, ${team})">はい</a>
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
function banclient(clientid, team){
    var team = String(team)
    var pd = {
        "clientid": clientid,
        "team": team
    }
    $.post("/removeClient", pd).done(res => {
        hideoverlay()
        showoverlay()
        
        var nickname = allclientdata[team][clientid]["nickName"]
        var overlay = `
            <h1>正常に${nickname}がBANされました<br>
                3秒後に再読み込みします
            </h1>
            `

        $(".overlay").show()
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
            所有者: チーム${kago.team}, ${allclientdata[kago.team][kago.clientid]["nickName"]}<br>
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

    $(".overlay").show()
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
    
    var kagos = allclientdata[kago.team][clsKagolist[index].clientid]["kagos"]

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
            所有者: ${allclientdata[kago.team][kago.clientid]["nickName"]}
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

    var kagos = allclientdata[kago.team][kago.clientid]["kagos"]

    postUpdatekagos(kago, kagos)
}


function addKagooverlay(mode, team){
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
                    <a id="btn" class="deleteStuffBtn" onclick="addKago(${mode}, ${team})">確定</a>
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
function addKago(mode, team){
    var kagoname = document.getElementById("kagonameinput").value
    var kagolevel = document.getElementById("kagolevelinput").value
    var imageurl = document.getElementById("kagoimageurlinput").value
    var kagolevelArray = Array.from(kagolevel)
    var numcaution = false
    var team = String(team)
    var newKago = {
        "kagoname": kagoname,
        "kagolevel": kagolevel,
        "kagoimageurl": imageurl
    }
    console.log(mode, team)
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
            "team": team
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
            var servdata = JSON.stringify(res[team][showncliendID]["kagos"], null, 2)
            var prevdata = JSON.stringify(allclientdata[team][showncliendID]["kagos"], null, 2)

            if (prevdata !== servdata){
                reload()
                return
            }
            
            var kago = new Kago(kagoname, kagolevel, imageurl, showncliendID, team)
            var kagos = allclientdata[String(team)][kago.clientid]["kagos"]

            allclientdata[team][showncliendID]["kagos"].push(newKago)

            postUpdatekagos(kago, kagos, false, true)

            var btn = document.getElementById("btn")
            btn.onclick = null;
        })
    }
}



/**
 * 全タイプのオーバーレイを表示
 */
function showoverlay(){
    $(".overlay").show()
}



/**
 * 全タイプのオーバーレイを非表示
 */
function hideoverlay(){
    $(".overlay").hide()
    $(".window").empty()
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
        "clientname": allclientdata[kago.team][kago.clientid]["nickName"],
        "kagoname": kago.name_,
        "team": kago.team
    }

    if (remove){
        postdata["removedkago"] = true  
    } else if (add){
        postdata["addedkago"] = true 
    }

    $.post("/updatekagos", postdata).done(res => {
        showclientdata(kago.clientid, kago.team)
        $("#editcaution").text("成功！")
        $("#editcaution").css("color", "green")
        
        setTimeout(() => {
            hideoverlay()
        }, 3000);
    })
}


function removeteamCon(team){
    var overlay = `
        <h1>チーム${team}を削除しようとしています。<br>
            本当に実行しますか？
        </h1>
        <br><br>
        <table>
            <tr>
                <td>
                    <a class="editStuffBtn" onclick="hideoverlay()">キャンセル</a>
                </td>
                <td>
                    <a class="deleteStuffBtn" onclick="removeteamConfirm(${team})">はい</a>
                </td>
            </tr>
        </table>
        `

    showoverlay()

    $(".window").append(overlay)
    $(".window").css("height", "220px")
}
function removeteamConfirm(team){
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
                    <a class="deleteStuffBtn" onclick="removeteam(${team})">ほんと</a>
                </td>
            </tr>
        </table>
        `

    hideoverlay()
    showoverlay()

    $(".window").append(overlay)
    $(".window").css("height", "170px")
}
function removeteam(team){
    var pd = {
        "team": String(team)
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
        var team1endsAt = res["endsAt"]["1"]
        var team2endsAt = res["endsAt"]["2"]
        var team3endsAt = res["endsAt"]["3"]
        var nextStartsAt = res["nextStartsAt"]

        var overlay = `
            <h1>時間設定を編集中</h1>
            <h2 id="editcaution""></h2>
            <h1>チーム1-endsAt(アイテム集め後集合時間)<br>
                <input type="text" class="editinput" id="endsAt1"><br><br>
                チーム2-endsAt(アイテム集め後集合時間)<br>
                <input type="text" class="editinput" id="endsAt2"><br><br>
                チーム3-endsAt(アイテム集め後集合時間)<br>
                <input type="text" class="editinput" id="endsAt3"><br><br>
                次のチームが始まる時間(nextStartsAt)<br>
                <input type="text" class="editinput" id="nextStartsAtw"><br>
            </h1>
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

        $(".window").append(overlay).css("height", "670px")
        document.getElementById("endsAt1").value = team1endsAt
        document.getElementById("endsAt2").value = team2endsAt
        document.getElementById("endsAt3").value = team3endsAt
        document.getElementById("nextStartsAtw").value = nextStartsAt
    })
}
function editendsAt(){
    var team1endsAt = document.getElementById("endsAt1").value
    var team2endsAt = document.getElementById("endsAt2").value
    var team3endsAt = document.getElementById("endsAt3").value
    var nextStartsAt = document.getElementById("nextStartsAtw").value
    var i = 0
    var l = [team1endsAt, team2endsAt, team3endsAt, nextStartsAt]

    for (var time of l){
        i++
        if (String(new Date(time).getTime()) === "NaN"){
            $("#editcaution").text(`間違っている箇所があります(${i}つめ)`)
            $("#editcaution").css("color", "red")
            return
        }
    }

    var endsAt = {
        "endsAt": [
            team1endsAt,
            team2endsAt,
            team3endsAt
        ],
        "nextStartsAt": nextStartsAt
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
        var URLID = res
        console.log(res)
        var overlay = `
            <h1>ホワリスURLのIDを編集中</h1>
            <h2 id="editcaution""></h2>
            <h1>現在のID: <br>
                <h1 style="color: blue;">${URLID}</h1><br><br>
                
                <h1>新しいID: <br>
                <input type="text" class="editinput" id="newnickURLID"><br></h1>
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
        $(".window").append(overlay)
    })
}
function editnickURLID(){
    var newID = document.getElementById("newnickURLID").value
    var pd = {
        "newID": newID
    }

    if (newID.length < 5){
        $("#editcaution").text("6文字以上でお願いします").css("color", "red")
        return
    }

    $.post("/modifynickURLID", pd).done(res => {
        if (!res){
            reload(2)
            return
        }

        $("#editcaution").text("成功！")
        $("#editcaution").css("color", "green")
        document.getElementById("btn").onclick = null

        setTimeout(() => {
            window.location.reload()
        }, 2000);
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
                正常に処理が終了しました<br>
                5秒後にページがリロードされます<br>
                おまちください
            </h1>
            `

    } else if (mode == 2){
        var overlay = `
            <h1>
                [Something went wrong]
                [unknown error occured]
                予期せぬエラー
            </h1>
            `
    }

    hideoverlay()
    showoverlay()
    
    setTimeout(() => {
        $(".window").append(overlay)
        $(".window").css("height", "140px")
        $(".window").css("max-width", "900px")
        if (mode == 1){
            $(".window").css("color", "green")
        } else {
            $(".window").css("color", "red")
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

    hideoverlay()
    showoverlay()
    $(".window").append(overlay)
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

function shotime(time, element, msg){
    var countDownDate = new Date(time).getTime();
    var countdown = setInterval(function() {
        var now = new Date().getTime()
        var distance = countDownDate - now

        var days = Math.floor(distance / (1000 * 60 * 60 * 24))
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        var seconds = Math.floor((distance % (1000 * 60)) / 1000)

        if (days === 0 && minutes === 0 && hours === 0){
            $(element).text(`${msg}: ${seconds}秒 後`)
        } else if (hours === 0 && days === 0){
            $(element).text(`${msg}: ${minutes}分 ${seconds}秒 後`)
        } else if (days === 0 && !(hours === 0) && !(minutes === 0)){
            $(element).text(`${msg}: ${hours}時間 ${minutes}分 ${seconds}秒 後`)
        } else {
            $(element).text(`${msg}: ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒 後`)
        }

        if (distance <= 120000) {
            $(element).css("color", "blue")
            if (days === 0 && minutes === 0 && hours === 0){
                $(element).text(`${msg}: ${seconds}秒 後`)
            } else if (hours === 0 && days === 0){
                $(element).text(`${msg}: ${minutes}分 ${seconds}秒 後`)
            }
        }

        if (distance <= 0) {
            clearInterval(countdown);
            $("#countDownNCM").css("color", "red")
            $("#countDownNCM").text(`すぐに設定してください。時間がマイナスになりました`)
        }
    }, 1000);
}



function sumbitpassword(){
    var password = document.getElementById("passwordinput").value
    var pd = {
        "password": password
    }
    
    if (!password){
        $("#caution").text("空欄にしないでください")
        return
    }

    $.post("/forAdminspassword", pd).done(res => {
        if (!res){
            $("#password").hide()
            $("#forbidden").show()
            return
        }

        _do_call()
    })
}

function sleep(waitMsec) {
    var startMsec = new Date();
    while (new Date() - startMsec < waitMsec);
}

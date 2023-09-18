const CLIENT_ID = localStorage.getItem("clientID");  // 個人識別する番号（ニックネーム登録時に割り振られる）
const FILE_N = localStorage.getItem("fileN");        // チーム番号のようなもの

function getClientData(callback){
    $.ajaxSetup({async: false}); 
    $.post("/get_client_details", {
        "clientID": CLIENT_ID,
        "fileN": FILE_N
    }).done((res) => {
        callback(res);
    });
}

var _data;
window.onload = function(){
    getClientData(function(data){
        _data = data;
        if (data["unknown_client"]){
            $("#topTitle").text("ハロー！");
            $(".log-session").show();
            $(".message-container").html("<h1>これはセタガクエストのウェブページです！<br>二階の 205 教室に来ましょう！</h1>");
            return;
        }
        $("#topTitle").text("インベントリ");
        $("#hello").html(
            `<div style="display: flex; align-items: end; justify-content: flex-end;"><h3 style="margin: 0;">
                あなたのニックネームは
            </h3><h1 id="myNick" style="text-align: end; margin: 0;">${data.nickName}</h1><h3 style="margin: 0;">です</h3></div>`
        );
        if (data.items.length == 0){
            $("#topTitle").text("からっぽ！");
            $(".log-session").show();
            $(".message-container").html("<h1>あなたのインベントリにアイテムが見当たりません！<br>祠を探して獲得しましょう！</h1>");
            return;
        }
        //今回作ったコード(多分うまくいくはず)
        for(var item of data.items) {
            /**
             * @param key elem data(json)の一つ一つのアイテム要素の情報格納用変数
             */
            var elem = {html:null, type:item.type, stars:item.stars, rarity:item.rarity};
    
            var stars = "";
            for(var i=0; i<elem.stars; i++) {
                stars += "★"; 
            }
            //アイテム一つ一つのhtml
            elem.html = `
            <div class="item"style="">
                <img id="itemImg" src="${elem.type=="剣"?"images/sword.png": elem.type=="弓" ? "images/bow.png" : "images/stick.png"}" alt="剣の写真" width="auto" height="100%">
                <div class="spacer"> </div>
    
                <div class="discription"> 
                    <p id="stars">${stars}</p>
                    <br><br>
                    <h4>${elem.type} ${elem.rarity} (${stars.length})</h4>
                </div>
            </div>`;
            const itemArea = document.querySelector(".items");
            itemArea.insertAdjacentHTML("beforeend", elem.html);
        }
        var ind = 1;
        for(var kago of data.kagos){
            elem.html = `
            <div class="item"style="">
                <h1>加護(${ind})</h1>
                <div class="spacer"> </div>
    
                <div class="discription"> 
                    <br><br>
                    <p>獲得:</p>
                    <h4 style="margin: 0;">${kago.claimed}</h4>
                </div>
            </div>`;
            const itemArea = document.querySelector(".kagos");
            itemArea.insertAdjacentHTML("beforeend", elem.html);
            ind++;
        }
    });

    !function(){
        $("#info_").click(function(){
            $(".topcontainer").hide();
            $("#details").hide();
            $("#info_").hide();
            $(".log-session").hide();
            $("hr").hide();
            $("#wiki").show();
            $(".items").hide();
            $(".kagos").hide();
        });
    }();
}


function hideWiki(){
    $(".log-session").hide();
    $(".topcontainer").show();
    $("#details").show();
    $("#info_").show();
    $("hr").show();
    $("#wiki").hide();
    $(".items").show();
    $(".kagos").show();
    if (_data["items"].length == 0 && _data["kagos"].length == 0){
        $(".log-session").show();
    }
}


function showStory(){
    $("#showStory").hide();
    $("#hideStory").show();
    $("#story_content").show();
}

function hideStory(){
    $("#showStory").show();
    $("#hideStory").hide();
    $("#story_content").hide();
}


function showItems_(){
    $("#showItems_").hide();
    $("#hideItems_").show();
    $("#items__content").show();
}

function hideItems_(){
    $("#showItems_").show();
    $("#hideItems_").hide();
    $("#items__content").hide();
}

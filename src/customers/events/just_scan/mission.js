const URL_ID = getParam("id");
const CLIENT_ID = localStorage.getItem("clientID");
const FILE_N = localStorage.getItem("fileN");



window.onload = function(){
    $.post("/get_just_scans", {
        "url_id": URL_ID,
        "clientID": CLIENT_ID,
        "fileN": FILE_N,
        "id": URL_ID
    }).done(res => {
        var message_containner = $(".message-container");
        $("body").show();
        $(".log-session").show();
        if (res["whoru"]){
            message_containner.html(
                "<h1>これはセタガクエストのQRコードです！<br>二階 205 教室に来て参加しましょう！</h1>"
            );
            $("#topTitle").text("ハロー！");
            return;
        }
        if (res["bad"]){
            message_containner.html("<h1>400 Bad Request</h1><br>unknown permissions");
            return;
        }
        $("#www_loader").show().css("display", "flex");
        $("#myNick").text(`${res["name"]}`);
        $("#hello").html(
            `<div style="display: flex; align-items: end; justify-content: flex-end;"><h3 style="margin: 0;">
                あなたのニックネームは
            </h3><h1 id="myNick" style="text-align: end; margin: 0;">${res["nickName"]}</h1><h3 style="margin: 0;">です</h3></div>`
        );
        $(".startbtn__").show().click(function(){
            window.location.href = "/src/customers/events/inventory/";
        });
        if (res["alr"]){
            message_containner.html(
                "<h1>あなたは既にこの報酬を受け取っています！</h1><br>他のを探してください！"
            );
            $("#topTitle").text("レッツゴー");
            $(".startbtn__").show();
            return;
        }
        message_containner.html(`
            <h1>おめでとうございます！</h1>
            <h2>あなたの所持しているすべての武器に星が <span style="color: green;">5</span> こずつ増やされました！</h2>
            <h2 style="color: red;">※武器を持っていない場合は何も変化がありません。</h2>
        `);
        $("#topTitle").text("おめでとう！");
        $(".startbtn__").show();
        return;
        
    })
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

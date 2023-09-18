var connection = true
var localstorage = true

try {
    if (typeof localStorage !== "undefined") {
        try {
            localStorage.setItem("dummy", "1");
            if (localStorage.getItem("dummy") === "1") {
                localStorage.removeItem("dummy");
            } else {
                localstorage = false
            }
        } catch(e) {
            localstorage = false
        }
    } else {
        localstorage = false
    }
} catch (e){
    localstorage = false
}

$(function() {
    localStorage.clear();     
    $.ajaxSetup({async: false}); 
    try {
        $.post("/test", null).done(res => {
            connection = res
        })
    } catch(e){
        connection = false
    }

    if (connection && localstorage){
        $("#data").text("成功").css("color", "green")
        $("#connection").text("成功").css("color", "green")
        $("#result").text("参加できます").css("color", "green")
    } else {
        if (!connection){
            $("#connection").text("失敗").css("color", "red")
        } else {
            $("#connection").text("成功").css("color", "green")
        }

        if (!localstorage){
            $("#data").text("失敗").css("color", "red")
        } else {
            $("#data").text("成功").css("color", "green")
        }
        $("#result").text("参加できません").css("color", "red")
    }
})

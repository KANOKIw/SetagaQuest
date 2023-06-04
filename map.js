var clientID = localStorage.getItem("SetagaQuestClientID");
var postData = {
    "clientID": clientID
}
$(function(){
    $("#notCustomer").hide()
    $("#map_layer").hide()
    var postData = {
        "type": "Quiz",
        "clientID": clientID
    }

  

    $.post("/init", postData).done(res => {
        if (res === "not customer"){
            $("#notCustomer").show()
        } else {
            $.post("/clientData", postData).done(res => {
            var clientdata = res
            $("#helloDiv").show()
            $("#hello").text(clientdata["nickName"] + "さん、こんにちは!")
            $("#map_layer").show()
            
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
        })}
    })
})

const URL_ID = getParam("id");
const SMASH_ID = getParam("sm");
const FILE_N = localStorage.getItem("fileN");
const fromEER = localStorage.getItem(`${URL_ID}-mboss_INTERNAL_SERVER_EER`);
var clientID = localStorage.getItem("clientID");
var fileN = localStorage.getItem("fileN");
var CLIENT_ID = localStorage.getItem("clientID");
var fileN = localStorage.getItem("fileN");
const timeLimit = 180;
var clientData;
var currentTimeRemains = 180;
var MBOSS_SLAIN_COUNT = 0;
var MAX_PATTERN_LENGTH = 0;
var MIN_PATTERN_LENGTH = 1;
var CURRENT_COUNT_DOWN = 0; // Array
var SECOND_OF_A_TURN = 5;
var WEAPONS_IN_USE = {
    "sword": 0,
    "bow": 0,
    "stick": 0
};
var BOSS_MAX_HEALTH = 5_000;
var BOSS_CURRENT_HEALTH = BOSS_MAX_HEALTH;
var EVENT_ENDED = false;
var damage_schedular;
var damages = {
    "sword": 0,
    "bow": 0,
    "stick": 0
};
const REQUIRED_ID = "iiSAK12-0";
const SWORD_SMASHER = "s1w1Pe_ord";
const BOW_SMASHER = "b__oPosWwpp_";
const STICK_SMASHER = "stLi_cKk992";
const SMURL_MAP = {
    [SWORD_SMASHER]: "sword",
    [BOW_SMASHER]: "bow",
    [STICK_SMASHER]: "stick"
}
var SMASH_WEAPON = null;
var bad = false;
if (URL_ID != REQUIRED_ID)
    bad = true;
const socket = io();



/**
 * 
 */
class Random{
    /**
     * Returns a pseudorandomly chosen int value between the specified origin (inclusive) and the specified bound (inclusive).
     * @param {int} orifin the least value that can be returned
     * @param {int} bound the upper bound (inclusive) for the returned value
     *
     * @returns a pseudorandomly chosen int value between the origin (inclusive) and the bound (inclusive)
     * @throws IllegalArgumentException - if origin is greater than or equal to bound
     */
    nextInt(orifin, bound){
        if (orifin == undefined && bound == undefined){
            var num = Math.random();
            if (num > 0.5){
                return 1;
            } else {
                return 0;
            }
        }
        return Math.floor(Math.random() * (bound - orifin +1)) + orifin;
    }

    /**
     * Random choices from given ArryaList<Any>
     * @param {Array} __list 
     * @returns ArryaList<?>
     */
    randomChoice(__list){
        return __list[this.nextInt(0, __list.length -1)];
    }
}

const random = new Random();
const colorMap = {
    "cyan": "#00bfff",
    "red": "#8b0000",
    "yellow": "#ffd700",
    "green": "#008000",
    "purple": "#800080"
};
const colors = ["green", "purple", "yellow", "red", "cyan"];
const __types__ = ["sword", "bow", "stick"];
var currentArguments = [];

class KagoPattern{
    constructor(bool=true){
        if (!bool)
            return
        this.CURRENT_PATTERN = [];
        this.CURRENT_NODE = document.getElementById("CURRENT_NODE");
        this.next_1 = {};
        this.next_2 = {};
        this.next_3 = {};
        this.next1 = document.getElementById("next1");
        this.next2 = document.getElementById("next2");
        this.next3 = document.getElementById("next3");
        this.type = null;
        this.isCCW = false;
        this.ARGED_COLORS = [];
        this.CURRENT_NODE_CANVAS = null;
        this.canvasList = []
    }

    /**
     * __init__ method
     */
    moveNext(){
        if (EVENT_ENDED)
            return;
        const wps = __types__;
        for (var ca of this.canvasList)
            ca.destroy();

        for (var w of __types__){
            WEAPONS_IN_USE[w] -= 1;
            if (WEAPONS_IN_USE[w] < 0)
                WEAPONS_IN_USE[w] = 0;
        }
        if (selectedWeapon == "sword")
            WEAPONS_IN_USE[selectedWeapon] += 1;
        else if (selectedWeapon == "bow")
            WEAPONS_IN_USE[selectedWeapon] += 2;
        // globals
        selectedWeapon = null;
        selected_KAGO = null;
        
        for (var tts of wps)
            $(`#${tts}`).css("background-color", "");
        $(`#${SMASH_WEAPON}`).css("background-color", "rgba(174, 154, 0, 0.5)");
        for (var el of document.getElementsByClassName("draggable"))
            el.classList.remove("attrSelected");
        for (var method of ["mousedown", "touchstart"])
            document.getElementById("here_combine").removeEventListener(method, kagoEventViewer);
        for (var cl of ["green", "purple", "yellow", "red", "cyan"]){
            $(`#${cl}Orb`).show();
        }
        for (var wp of wps){
            if (WEAPONS_IN_USE[wp] > 0){
                $(`#${wp}_`).show();
            } else {
                $(`#${wp}_`).hide();
            }
        }
        
        $("#cw").hide();
        $("#cww").hide();
        $("#__combine__").empty();
        $("#draggable_notify").text("武器を選択してください").css("color", "black");
        $(".space_combine").css("background-color", "");
        
        this.type = null;
        this.ARGED_COLORS = [];
        this.CURRENT_NODE_CANVAS = null;
        this.canvasList = [];
        this.CURRENT_PATTERN = [];

        this.setCURRENT_NODE(this.next_1["rgbs"]);
        this.ARGED_COLORS = this.next_1["ARGED_PATTERNS"];

        var CCW = this.next_1["CCW"];
        if (CCW){
            if (this.next_1["colors"].length > 1){
                $("#C_W").text("順番: 反時計回り");
                $("#cww").show().css("display", "flex");
            }
            else 
                $("#C_W").text("一つのみ");
        } else {
            if (this.next_1["colors"].length > 1){
                $("#C_W").text("順番: 時計回り");
                $("#cw").show().css("display", "flex");
            }
            else 
                $("#C_W").text("一つのみ");
        }
        this.next_1 = this.next_2;
        this.next_2 = this.next_3;

        var colors = this.randomColor(random.nextInt(MIN_PATTERN_LENGTH, MAX_PATTERN_LENGTH));
        var rgbs = this.getColorList_rgb(colors);
        CCW = (random.nextInt() == 0) ? true : false;
        var arged = (CCW) ? colors.reverse() : colors;
        
        this.next_3 = {
            "colors": colors,
            "rgbs": rgbs,
            "ARGED_PATTERNS": arged,
            "CCW": CCW
        };
        
        CURRENT_COUNT_DOWN = setTimeLimit();
        this.setAllCanvas();
        hideWeapons();
    }

    static _showNext(){}

    checkArgument(newColor){
        this.CURRENT_PATTERN.push(newColor);
        for (var i = 0; i < this.CURRENT_PATTERN.length; i++){
            if (this.ARGED_COLORS[i] != this.CURRENT_PATTERN[i])
                return false;
        }
        return true;
    }

    /**
     * 
     * @param {Array} colorList 
     */
    setCURRENT_NODE(colorList){
        var _data = [];
        for (var i = 0; i < colorList.length; i++){
            _data.push(1); // dummy value
        }
        var newPie = new Chart(this.CURRENT_NODE, {
            type: "pie",
            data: {
                labels: [],
                datasets: [{
                    data: _data,
                    backgroundColor: colorList,
                    borderWidth: 0
                }],
            },
            options: {
                animation: false
            }
        });
        this.canvasList.push(newPie);
    }

    randomColor(length){
        var li = [];
        var _colors = colors;
        for (var i = 0; i < length; i++){
            // do-while risks to freeze
            var col = random.randomChoice(_colors);
            _colors = _colors.filter(c => {
                return c != col;
            });
            li.push(col);
        }
        return li;
    }

    /**
     * set reverse true if CCW
     * @param {Array} __list 
     * @param {boolean} reverse 
     * @returns 
     */
    getColorList_rgb(__list, reverse=false){
        var _li = [];
        if (reverse) __list.reverse();
        for (var col of __list){
            _li.push(colorMap[col]);
        }
        return _li;
    }

    setWeaponSelectable(){
        if (clientData["items"].length == 0)
            $("#magical_stick").show();
        for (var type of __types__){
            var element = document.getElementById(type);
            !function(_type){
                element.addEventListener("mousedown", function(){
                    _selectWeapon(_type);
                });
                element.addEventListener("touchstart", function(){
                    _selectWeapon(_type);
                });
            }(type);
        }
    }

    setKagoSeletable(){
        for (var col of colors){
            !function(c){
                var attr = document.getElementById(col+"Orb");
                attr.addEventListener("mousedown", function(){
                    selectAttribute(c);
                });
                attr.addEventListener("touchstart", function(){
                    selectAttribute(c);
                });
            }(col);
        }
    }

    setAllCanvas(){
        var gol = [this.next_1, this.next_2, this.next_3];
        for (var i = 0; i < gol.length; i++){
            var dict = gol[i];
            var canvas = document.getElementById(`next${i+1}`);
            var _data = [];
            for (var _ = 0; _ < dict["colors"].length; _++){
                _data.push(1);
            }
            var canv = new Chart(canvas, {
                type: "pie",
                data: {
                    labels: [],
                    datasets: [{
                        data: _data,
                        backgroundColor: dict["rgbs"],
                        borderWidth: 0
                    }],
                },
                options: {
                    animation: false
                }
            });
            this.canvasList.push(canv);
        }
    }
}


// globals
var _remov = [];
var selectedWeapon = null;

var removals = [];
var selected_KAGO = null;


var CLS = new KagoPattern(false);


function _selectWeapon(type){
    var ovly = document.getElementById(`${type}_`);
        if (ovly.style.display != "none")
            return;
    if (selectedWeapon != null){
        var es = document.getElementsByClassName("attribute__spam")[0];
        _remov.forEach(i => {clearInterval(i);});
        es.classList.remove("ramp");
        setTimeout(function(){
            es.classList.add("ramp");
        }, 0);
        _remov.push(setInterval(function(){
            es.classList.remove("ramp");
        }, 500));
        return;
    }
    for (var tts of __types__){
        $(`#${tts}`).css("background-color", "");
    }
    $(`#${SMASH_WEAPON}`).css("background-color", "rgba(174, 154, 0, 0.5)");
    $(`#${type}`).css("background-color", "green");
    if (type == SMASH_WEAPON)
        $(`#${SMASH_WEAPON}`).css("background-color", "rgb(174, 154, 0)");
    $("#draggable_notify").text("加護を選択して下さい");
    selectedWeapon = type;
}

function selectAttribute(color){
    if (selectedWeapon == null){
        var es = document.getElementsByClassName("weapons__")[0];
        removals.forEach(i => {clearInterval(i);});
        es.classList.remove("ramp");
        setTimeout(function(){
            es.classList.add("ramp");
        }, 0);
        removals.push(setInterval(function(){
            es.classList.remove("ramp");
        }, 500));
        return;
    }
    $(".space_combine").css("background-color", "rgb(11, 114, 184)");
    $("#draggable_notify").text("ここをタップして加護をおく").css("color", "rgb(255, 194, 194)");
    for (var el of document.getElementsByClassName("draggable")){
        el.classList.remove("attrSelected");
    }
    var rl = document.getElementById(color+"Orb");
    selected_KAGO = color;
    rl.classList.add("attrSelected");
    for (var method of ["mousedown", "touchstart"]){
        document.getElementById("here_combine").addEventListener(
            method,
            kagoEventViewer
        );
    }
}


function kagoEventViewer(e){
    var KAGO = document.getElementById(`${selected_KAGO}Orb`);
    var _KAGO = $(`#${selected_KAGO}Orb`);
    var result = CLS.checkArgument(selected_KAGO);

    if (selected_KAGO == null){
        var es = document.getElementsByClassName("attribute__spam")[0];
        _remov.forEach(i => {clearInterval(i);});
        es.classList.remove("ramp");
        setTimeout(function(){
            es.classList.add("ramp");
        }, 0);
        _remov.push(setInterval(function(){
            es.classList.remove("ramp");
        }, 500));
        return;
    }
    $("#__combine__").append(`
        <img src="./attributes/${selected_KAGO}.png" style="width: 25%; height: 25%">
    `);
    $(`#${selected_KAGO}Orb`).hide();
    selected_KAGO = null;
    if (result){
        if (CLS.ARGED_COLORS.length == CLS.CURRENT_PATTERN.length){
            /*
             Deal damage to the boss
            */
            var _damage = damages[selectedWeapon];
            if (damage_schedular)
                clearInterval(damage_schedular);
            clearTimeout(CURRENT_COUNT_DOWN[0]);
            clearInterval(CURRENT_COUNT_DOWN[1]);
            socket.emit("add_Damage", {"id": URL_ID, "amount": _damage, "clientID": localStorage.getItem("clientID"), "nickName": clientData["nickName"]});
            //do_Damage(_damage);
            CLS.moveNext();
        }
    } else {
        clearTimeout(CURRENT_COUNT_DOWN[0]);
        clearInterval(CURRENT_COUNT_DOWN[1]);
        $("#miss_overlay").show().css("display", "flex");
        setTimeout(function(){
            $("#miss_overlay").hide();
            CLS.moveNext();
        }, 500);
    }
}


$(function(){
    socket.on("do_Damage", (data) => {
        var amount = parseInt(data["amount"]);
        var current = parseInt(data["current"]);
        do_Damage(amount, parseInt(data["current"]));
        $("#boss_health_num").text(String(current));
    });
    $.post("/get_online_players", null).done((online_players) => {
        $(".current_player_count").html(`<span style="color: #006100; font-size: 125%;">${online_players}</span> 人が戦闘中`);
    });
    socket.on("update_online_players", (data) => {
        var online_players = data["online_players"];
        $(".current_player_count").html(`<span style="color: #006100; font-size: 125%;">${online_players}</span> 人が戦闘中`);
    });
    socket.on("GrandFinal_Boss_died", (data) => {
        var dealt = data["all"][CLIENT_ID]["dealt"];
        dealt = parseInt(dealt);
        $(".damage_dealt").show();
        $(".damage_dealt").text(`あなたは合計で ${dealt.toLocaleString()}ダメージ与えた`);
        localStorage.setItem("gf_dmg_dealt", String(dealt));
    });
    requestFullScreen(document.documentElement);
    setTimeout(function(){
        lockOrientation("portrait");
    }, 1);
    var message_containner = $(".sessionMessage");
    var clientID = localStorage.getItem("clientID");
    var fileN = localStorage.getItem("fileN");
    var postdata = {
        "clientID": clientID,
        "fileN": fileN
    }
    if (fromEER){
        $("body").show();
        showWinScreen(true);
        localStorage.removeItem(`${URL_ID}-mboss_INTERNAL_SERVER_EER`);
        return;
    }
    $.post("/get_BOSS_MAX_HEALTH", {"id": URL_ID}).done(res => {
        var max = res["max"];
        var current = res["current"];
        BOSS_MAX_HEALTH = parseInt(parseInt(max)*(4/3));
        BOSS_CURRENT_HEALTH = max;
        setBossHealth(max-current);
        $("#boss_health_num").text(String(current));
    });
    $.post("/grandfinal__init__", postdata).done((res) => {
        $.post("/get_client_details", {
            "clientID": clientID,
            "fileN": FILE_N
        }).done((data) => {
            clientData = data;
            $("body").show();
            $(".logSession").show();
            if (localStorage.getItem("Grand_Final_WON")){
                $(".damage_dealt").show();
                $(".damage_dealt").text(`あなたは合計で ${parseInt(localStorage.getItem("gf_dmg_dealt")).toLocaleString()}ダメージ与えた`);
                $("#miss_overlay").hide();
                $(".mainFight").hide();
                $(".logSession").show();
                $(".sessionMessage").html(`
                    <h1 style="margin: 0; color: red;">ラスボスをたおした</h1><br>
                    <h2 style="margin: 0;">あなたはせかいをすくった</h2>
                    <h2 style="margin: 0;">お疲れさまでした</h2>
                `);
                $(".startbtn__").hide();
                $(".Wstartbtn").text("インベントリを確認する");
                $(".Wstartbtn__").hide();
                return;
            }
            if (bad){
                message_containner.html("<h1>400 Bad Request</h1><br>Illegal access denied");
                return;
            }
            if (res["whoru"]){
                message_containner.html(
                    "<h1>これはセタガクエストのQRコードです！<br>二階 205 教室に来て参加しましょう！</h1>"
                );
                $("#topTitle").text("ハロー！");
                return;
            }
            $("#www_loader").show().css("display", "flex");
            $("#myNick").text(`${res["nickName"]}`);
            if (res["early_to_see"]){
                message_containner.html(
                    `<h1>ラスボスと対面するにはひとつ前のミニボスを倒さなければいけない。<br><span style="color: red;">引き下がれ。</span></h1>`
                );
                return;
            }
            SECOND_OF_A_TURN = 7;
            MBOSS_SLAIN_COUNT = 1;
            MAX_PATTERN_LENGTH = 5;
            $("#topTitle").text("グラファ");
            $(".startbtn").text("進む");
            $(".startbtn__").show().click(explainBossFight);
            message_containner.html(
                `<h1 style="color: red;">目のまえにはラスボスがいる<br>下のボタンをおして対面しよう
                </h1>
                <div style="display: flex;"><h2>※</h2><h2>ゲーム中に横画面にしてはいけない</h2></div>`
            );
            
            window.scroll({top: 0, behavior: "smooth"});

            for (var item of clientData["items"]){
                var type = item["type"];
                switch (type){
                    case "剣":
                        type = "sword";
                        break;
                    case "弓":
                        type = "bow";
                        break;
                    case "杖":
                        type = "stick";
                        break;
                }
                damages[type] = damage_calculator(type, item["stars"], item["rarity"]);
                $(`#${type}__`).text(`${item["rarity"]} (${item["stars"]})`);
            }
            if (clientData["items"].length == 0){
                __types__.push("magical_stick");
                damages["magical_stick"] = 350;
                WEAPONS_IN_USE["magical_stick"] = 0;
            }
            if (SMASH_ID){
                SMASH_WEAPON = SMURL_MAP[SMASH_ID];
                var have = false;
                for (var item of clientData["items"]){
                    if (item["type"] == getWeaponName(SMASH_WEAPON)){
                        have = true;
                        break;
                    }
                }
                var te = "";
                if (!have){
                    te = "*Sしかしあなたはこの武器を所持していないので使用できません";
                }
                if (SMASH_WEAPON){
                    damages[SMASH_WEAPON] *= 2;
                    $(".smash_item_intro").show();
                    $(".smash_item_intro").html(`
                        <h1 style="margin: 0;">選択した特化アイテム: </h1>
                        <h1 style="color: gold;">&nbsp;&nbsp;${getWeaponName(SMASH_WEAPON)}</h1>
                        <h2 style="margin: 0;">ダメージが 2倍になります</h2>
                        <h2 style="color: red;">${te}</h2>
                    `);
                    $(`#${SMASH_WEAPON}`).css("background-color", "rgba(174, 154, 0, 0.5)");
                }
            }
            document.documentElement.addEventListener("touchstart", function (e){
                if (e.touches.length >= 2) {e.preventDefault();}
                }, {passive: false});
                var t = 0;
                document.documentElement.addEventListener("touchend", function (e){
                    var now = new Date().getTime();
                    if ((now - t) < 350){
                        e.preventDefault();
                    }
                    t = now;
                }, false
            );

            function handle(event) {
                event.preventDefault();
            }
            
            !function(){
                document.addEventListener('touchmove', handle, { passive: false });
                document.addEventListener('mousewheel', handle, { passive: false });
                document.addEventListener("dblclick", function(e){ e.preventDefault();}, { passive: false });
            }();
        });
    })
})




function startBossFight(){
    CLS = new KagoPattern();
    $(".logSession").hide();
    $(".mainFight").show();
    $("#draggable_notify").show();
    startCountDown();
    continueFight(CLS);
}

/**
 * Call at the first time
 * Did not except to make this function, stupid
 * @param {KagoPattern} cls 
 */
function continueFight(cls){
    cls.setWeaponSelectable();
    cls.setKagoSeletable();

    // globals as init
    selectedWeapon = null;
    selected_KAGO = null;

    if (cls.CURRENT_NODE_CANVAS)
        cls.CURRENT_NODE_CANVAS.destroy();
    var colors = cls.randomColor(random.nextInt(MIN_PATTERN_LENGTH, MAX_PATTERN_LENGTH));
    var rgbs = cls.getColorList_rgb(colors);
    cls.setCURRENT_NODE(rgbs);
    var CCW = (random.nextInt() == 0) ? true : false;
    cls.isCCW = CCW;
    if (CCW){
        if (colors.length > 1){
            $("#C_W").text("順番: 反時計回り");
            $("#cww").show().css("display", "flex");
        }
        else 
            $("#C_W").text("一つのみ");
        cls.ARGED_COLORS = colors.reverse();
    } else {
        if (colors.length > 1){
            $("#C_W").text("順番: 時計回り");
            $("#cw").show().css("display", "flex");
        }
        else
            $("#C_W").text("一つのみ");
        cls.ARGED_COLORS = colors;
    }

    colors = cls.randomColor(random.nextInt(MIN_PATTERN_LENGTH, MAX_PATTERN_LENGTH));
    rgbs = cls.getColorList_rgb(colors);
    CCW = (random.nextInt() == 0) ? true : false;
    __col = (CCW) ? colors.reverse() : colors;
    cls.next_1 = {
        "colors": colors,
        "rgbs": rgbs,
        "ARGED_PATTERNS": __col,
        "CCW": CCW
    }
    colors = cls.randomColor(random.nextInt(MIN_PATTERN_LENGTH, MAX_PATTERN_LENGTH));
    rgbs = cls.getColorList_rgb(colors);
    CCW = (random.nextInt() == 0) ? true : false;
    __col = (CCW) ? colors.reverse() : colors;
    cls.next_2 = {
        "colors": colors,
        "rgbs": rgbs,
        "ARGED_PATTERNS": __col,
        "CCW": CCW
    }
    colors = cls.randomColor(random.nextInt(MIN_PATTERN_LENGTH, MAX_PATTERN_LENGTH));
    rgbs = cls.getColorList_rgb(colors);
    CCW = (random.nextInt() == 0) ? true : false;
    __col = (CCW) ? colors.reverse() : colors;
    cls.next_3 = {
        "colors": colors,
        "rgbs": rgbs,
        "ARGED_PATTERNS": __col,
        "CCW": CCW
    }
    cls.setAllCanvas();
    $("#draggable_notify").text("武器を選択してください").css("color", "black");
    CURRENT_COUNT_DOWN = setTimeLimit();
    hideWeapons();
}


/**
 * Shows client when he loset the boss(100% time limited)
 */
function showLostScreen(){
    $("#miss_overlay").show();
    $("#mm_s").attr("src", "./effexts/defeated.png");
    setTimeout(function(){
        $("#miss_overlay").hide();
        $(".mainFight").hide();
        $(".logSession").show();
        $(".sessionMessage").html(`
            <h1 style="margin: 0; color: red;">負けてしまった！</h1><br>
            <h2 style="margin: 0;">大丈夫！何回でも挑戦できます！</h2>
            <h1 style="margin: 0; color: green;">下のボタンから再挑戦してください！</h1>
        `);
        $(".startbtn__").hide();
        $(".Wstartbtn").text("やりなおす");
        $(".Wstartbtn__").show().click(function(){
            window.location.reload();
        });
    }, 2000);
}


/**
 * Shows client when he win the boss
 * @param {boolean} fromEER 
 */
function showWinScreen(fromEER=false){
    var tim = fromEER ? 1 : 2000;
    $("#miss_overlay").show();
    $("#mm_s").attr("src", "./effexts/you_win.png");
    // lets all data gone
    $.post("/__init__", {
        "clientID": localStorage.getItem("clientID"),
        "fileN": localStorage.getItem("fileN")
    }).done(() => {
        localStorage.setItem("Grand_Final_WON", true);
        $(".startbtn__").hide();
        $(".Wstartbtn__").hide();
        setTimeout(function(){
            $("#miss_overlay").hide();
            $(".mainFight").hide();
            $(".logSession").show();
            $(".sessionMessage").html(`
                <h1 style="margin: 0; color: red;">ラスボスをたおした</h1><br>
                <h2 style="margin: 0;">あなたはせかいをすくった</h2>
                <h2 style="margin: 0;">お疲れさまでした</h2>
            `);
        }, tim);
    });
}



function _setTimeLimitCountDown(){
    var k = 100;
    return setInterval(function(){
        var el = document.getElementById("limit_bar");
        el.style.height = k + "%";
        k -= 100/(SECOND_OF_A_TURN*10);
    }, 100);
}


/**
 * 
 * @returns `class` ArrayList
 */
function setTimeLimit(){
    return [setTimeout(
        function(){
            $("#miss_overlay").show().css("display", "flex");
            setTimeout(function(){
                $("#miss_overlay").hide();
                CLS.moveNext();
            }, 500);
        }, SECOND_OF_A_TURN*1000
    ), _setTimeLimitCountDown()];
}


function explainBossFight(){
    $(".smash_item_intro").hide();
    $(".sessionMessage").html(`
        <h1 style="margin: 0; color: red;">*説明</h1>
        <ul>
            <li>
                <h3 style="margin: 0;">ボスは参加者全員の共通の敵である</h3>
            <li>
                <h3 style="margin: 0;">ゲーム説明</h3>
                <ul>
                    <li><h3 style="margin: 0;">1: 敵の弱点パターンを見る</h3>
                        <h4 style="margin: 0;">画面中央に色が付いた円が出現します。</h4>
                    </li>
                    <br>
                    <li><h3 style="margin: 0;">2: 攻撃に使いたい武器をえらぶ</h3>
                        <h4 style="margin: 0;">左サイドの武器から使いたい武器をタップしましょう</h4>
                    </li>
                    <br>
                    <li><h3 style="margin: 0;">3: パターンに合わせて加護を置く</h3>
                        <h4 style="margin: 0;">右サイドの「加護」のうちのどれかをタップして、<br>パターンが出現した下の枠をタップしましょうパターンの上に書いてある順番でおいてください</h4>
                    </li>
                    <br>
                    <li><h3 style="margin: 0;">4: 十分な加護が埋まると自動的に攻撃されます</h3>
                        <h4 style="margin: 0;">順番を間違えるとその攻撃は失敗になります</h4>
                    </li>
                    <br>
                    <li><h3 style="margin: 0;">5: 攻撃の失敗</h3>
                        <h4 style="margin: 0; color: red;"><span style="color: #3fff00">${SECOND_OF_A_TURN}</span> 秒以内に 2, 3 のステップをクリアしましょう。<br>3 秒たってしまうと新しいパターンに切り替わってしまいます</h4>
                    </li>
                    <br>
                    <li><h3 style="margin: 0; color: blue">1 〜 5 を繰り返します</h3>
                    </li>
                </ul>
            </li>
        </ul>
    `);
    $(".startbtn").text("つづきをみる");
    $(".startbtn__").show().click(explainBossFight_2);
}


function explainBossFight_2(){
    $(".sessionMessage").html(`
        <h1 style="margin: 0;">*ゲーム説明</h1>
        <ul>
            <li>
                <h2>武器について</h2>
                <ul>
                    <li><h3 style="margin: 0;">杖 いがいは <span style="color: red;">1</span> 回つかうと <span style="color: red;">2</span> 回のあいだつかえなくなります。<br>
                    ※杖 はなんどでもつかえます。
                    </h3>
                    </li>
                    <br>
                    <li><h3 style="margin: 0;">ダメージはボスの上部に表示されます。
                    </h3>
                    </li>
                    <br>
                    <li><h3 style="margin: 0;">獲得していない武器は表示されません
                    </h3>
                    </li>
                </ul>
            </li>
        </ul>
        <h2 style="color: red;">ゲームはボタンを押したらすぐに始まります！</h2>
    `);
    if (clientData["items"].length == 0){
        $(".startbtn").text("おや、、、？");
        $(".startbtn__").show().click(waitWhat);
    } else {
        $(".startbtn").text("スタート");
        $(".startbtn__").show().click(startBossFight);
    }
}




function waitWhat(){
    $(".sessionMessage").html(`
        <h1 style="margin: 0;">*おっと！</h1>
        <ul>
            <li>
                <h2>どうやら武器を持っていないようですね！<br>
                特別に毎ターンつかえる杖を差し上げましょう。<br>
                こいつは強力ですぞぉ！
                </h2>
                
            </li>
        </ul>
        <h2 style="color: red;">こいつをたおせばラスボスとたたかえる。</h2>
    `);
    
    $(".startbtn").text("スタート");
    $(".startbtn__").show().click(startBossFight);
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


function requestFullScreen(elem) {
    if (elem.requestFullScreen) {
        elem.requestFullScreen();
    }
    else if (elem.webkitRequestFullScreen) {
        elem.webkitRequestFullScreen();
    }
    else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    }
    else if (elem.msRequestFullScreen) {
        elem.msRequestFullScreen();
    }
}

function lockOrientation(mode) {
    if (screen.orientation.lock) {
        screen.orientation.lock(mode);
    }
    else if (screen.lockOrientation) {
        screen.lockOrientation(mode);
    }
    else if (screen.webkitLockOrientation) {
        screen.webkitLockOrientation(mode);
    }
    else if (screen.mozLockOrientation) {
        screen.mozLockOrientation(mode);
    }
    else if (screen.msLockOrientation) {
        screen.msLockOrientation(mode);
    }
}



function startCountDown(){
    return;
    var el = document.getElementById("cntTim");
    function e(tim){
        // tim: int sec
        var s = tim%60
        s.toString().length == 1 ? s = "0"+s : null
        return Number.parseInt(tim/60)+":"+s;
    }
    el.textContent = e(currentTimeRemains);
    setInterval(()=>{
        currentTimeRemains--;
        if (currentTimeRemains < 0){
            if (!EVENT_ENDED)
                showLostScreen();
            EVENT_ENDED = true;
            return;
        }
        el.textContent = e(currentTimeRemains);
    }, 1000);
}


function setBossHealth(decreasement){
    var el = document.getElementsByClassName("h_b")[0];
    BOSS_CURRENT_HEALTH -= decreasement;
    el.style.width = `${(BOSS_CURRENT_HEALTH/BOSS_MAX_HEALTH)*100}%`;
    if (BOSS_CURRENT_HEALTH <= 0){
        el.style.width = `0%`;
        if (!EVENT_ENDED)
            showWinScreen();
        EVENT_ENDED = true;
        return;
    }
}




// public
function damage_calculator(type, stars, rarity){
    const sword_base = 200;
    const bow_base = 300;
    const stick_base = 100;
    var damage = 0;

    switch (type){
        case "sword":
            damage = sword_base;
            break;
        case "bow":
            damage = bow_base;
            break;
        case "stick":
            damage = stick_base;
    }
    switch (rarity){
        case "uncommon":
            damage *= 1.5;
            break;
        case "rare":
            damage *= 1.5**2;
            break;
        case "epic":
            damage *= 1.5**3;
            break;
        case "legendary":
            damage *= 1.5**4;
            break;
    }
    var per = parseInt(stars)*5 + 100;
    damage *= per/100;
    return Math.floor(damage);
}


function hideWeapons(){
    for (var d in damages){
        if (damages[d] == 0){
            $(`#${d}`).hide();
        }
    }
}



var _t = 0;

function do_Damage(amount){
    var child = `
        <h1 id="damage_displayer${_t}" class="undertale_damager" style="position: absolute; margin-left: 45%; margin-bottom: 30%; display: none; font-size: 250%;"></h1>
    `
    $(".bossImageContainer").append(child);
    setBossHealth(amount);
    var _damage_text = $(`#damage_displayer${_t}`);
    var posY = 30;
    var x = -8;
    var y = 0;

    _damage_text.css("margin-bottom", posY+"%");
    damage_schedular = setInterval(function(){
        if (x > 8)
            return;
        y = (-(x**2)+64)/5;
        _damage_text.css("margin-bottom", (posY+y)+"%");
        x ++;
    }, 25);
    _damage_text.text(`${amount}`).show();
    setTimeout(function(){
        _damage_text.remove();
    }, 1000);
    _t++;
}


function getWeaponName(type){
    switch (type){
        case "sword":
            type = "剣";
            break;
        case "bow":
            type = "弓";
            break;
        case "stick":
            type = "杖";
            break;
    }
    return type;
}

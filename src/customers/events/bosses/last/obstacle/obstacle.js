const URL_ID = getParam("id");
const FILE_N = localStorage.getItem("fileN");
const fromEER = localStorage.getItem(`${URL_ID}-mboss_INTERNAL_SERVER_EER`);
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
var BOSS_MAX_HEALTH = 20_000;
var BOSS_CURRENT_HEALTH = BOSS_MAX_HEALTH;
var EVENT_ENDED = false;
var damage_schedular;
var damages = {
    "sword": 0,
    "bow": 0,
    "stick": 0
};


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
        if (selectedWeapon != "stick" && selectedWeapon != null)
            WEAPONS_IN_USE[selectedWeapon] += 2;
        // globals
        selectedWeapon = null;
        selected_KAGO = null;
        
        for (var tts of wps)
            $(`#${tts}`).css("background-color", "");
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
    $(`#${type}`).css("background-color", "green");
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
            do_Damage(_damage);
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
    requestFullScreen(document.documentElement);
    setTimeout(function(){
        lockOrientation("portrait");
    }, 1);
    
    var clientID = localStorage.getItem("clientID");
    var fileN = localStorage.getItem("fileN");
    var message_containner = $(".sessionMessage");
    var postdata = {
        "clientID": clientID,
        "fileN": fileN
    };
    $.post("/__slainObstacle__", postdata).done((res) => {
        $.post("/get_client_details", {
            "clientID": clientID,
            "fileN": FILE_N
        }).done((data) => {
            clientData = data;
            $("body").show();
            $(".logSession").show();
            if (res["whoru"]){
                message_containner.html(
                    "<h1>これはセタガクエストのQRコードです！<br>あれ？どうやって読み取ったの？</h1>"
                );
                $("#topTitle").text("ハロー！");
                return;
            }
            if (res["notfound"]){
                message_containner.html("<h1>400 Bad Request</h1><br>Illegal access method detected");
                return;
            }
            $("#www_loader").show().css("display", "flex");
            $("#myNick").text(`${res["nickName"]}`);
            if (res["alr"]){
                message_containner.html(
                    `<h1>あなたはもうこいつを撃破しています！<br><span style="color: red;">ラスボスへ進んでください！</span></h1>`
                );
                return;
            }

            MIN_PATTERN_LENGTH = 2;
            MAX_PATTERN_LENGTH = 4;
            SECOND_OF_A_TURN = 6;
            BOSS_MAX_HEALTH = Math.floor(BOSS_MAX_HEALTH*(res["finishedevents"].length + 1)/3);
            BOSS_CURRENT_HEALTH = BOSS_MAX_HEALTH;
            $("#boss_health_num").text(String(BOSS_CURRENT_HEALTH));
            $("#topTitle").text("邪魔だ");
            $(".startbtn").text("はじめる");
            $(".startbtn__").show().click(explainBossFight);
            message_containner.html(
                `<h1 style="color: rgb(0, 175, 0);">ラスボスが目の前です！<br>下のボタンをおして開始してください
                </h1><br>
                <div style="display: flex;"><h2>※</h2><h2>お使いの端末やブラウザによっては正常に動作しない場合があります
                </h2></div>
                <div style="display: flex;"><h2>※</h2><h2>ゲーム中に横画面にしないでください</h2></div>`
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
    var tim = (fromEER) ? 1 : 2000;
    $("#miss_overlay").show();
    $("#mm_s").attr("src", "./effexts/you_win.png");
    $.post("/obstacle__clear__", {
        "clientID": localStorage.getItem("clientID"),
        "fileN": FILE_N
    }).done(res => {
        if (res == "500 Internal Server Error"){
            localStorage.setItem(`${URL_ID}-mboss_INTERNAL_SERVER_EER`, true);
            $("#miss_overlay").hide();
            $(".logSession").show();
            $(".mainFight").hide();
            $(".sessionMessage").html(`
                <h1>500 Internal Server Error</h1>
                <h2>お手数をおかけしますが、このページを再読み込みしてください。</h2>
            `);
            return;
        }
        setTimeout(function(){
            $("#miss_overlay").hide();
            $(".mainFight").hide();
            $(".logSession").show();
            $(".sessionMessage").html(`
                <h1 style="margin: 0; color: red;">邪魔なミニボスを倒しました。</h1><br>
                <h1 style="margin: 0; color: green;">前に進んでラスボスとたたかいにいきましょう！</h1>
            `);
            $(".startbtn__").hide();
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
    $(".sessionMessage").html(`
        <h1 style="margin: 0;">*ゲーム説明</h1>
        <ul>
            <li>
                <h3 style="margin: 0;">制限時間はは 3 分間です</h3>
                <h4 style="margin: 0; color: red;">*それまでにボスを倒せないと敗北になります</h4></li>
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
                        <h4 style="margin: 0; color: red;"><span style="color: #3eef00; font-size: 150%;">${SECOND_OF_A_TURN}</span> 秒以内に 2, 3 のステップをクリアしましょう。<br>3 秒たってしまうと新しいパターンに切り替わってしまいます</h4>
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
                    <li><h3 style="margin: 0;">剣は <span style="color: red;">1</span> 回つかうと <span style="color: red;">1</span> 回のあいだつかえなくなります。<br>
                        弓は <span style="color: red;">1</span> 回つかうと <span style="color: red;">2</span> 回のあいだつかえなくなります。<br>
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
        <h2 style="color: red;">こいつをたおせばラスボスとたたかえる。</h2>
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
    $("#boss_health_num").text(String(BOSS_CURRENT_HEALTH));
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

function do_Damage(amount, current){
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

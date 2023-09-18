var express = require('express');
const bodyParser = require('body-parser');

var app = express();
app.use(express.static('./'));
var datetime = new Date();

const fs = require("fs");
const { stringify } = require('querystring');
const { isPromise } = require('util/types');
const QR = require('qrcode');
const { resolvePtr } = require('dns');
const http = require('http').Server(app);
const io = require('socket.io')(http);


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

// urlencodedとjsonは別々に初期化する
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var isNickPart_0 = true;

var GRANDFINAL_BOSS_HEALTH_MAX = 100_000;

app.post("/change_grandfinal_health", (req, res) => {
    var val = req.body["value"];
    var result = parseInt(val) * 100_000;
    if (result == null || isNaN(result)){
        res.send(null);
        return;
    } else {
        GRANDFINAL_BOSS_HEALTH_MAX = result;
        console.log("Boss health modified: "+result.toLocaleString());
        res.send(String(result));
    }
});

app.post("/get_grandfinal_health", (req, res) => {
    res.send({"max": GRANDFINAL_BOSS_HEALTH_MAX, "map": GRANDFINAL_BOSS_HEALTH});
});

var GRANDFINAL_BOSS_HEALTH = {
    
};
var GRANDFINALA_DMG_DEALT = {

};
var GF_DID = {

};

var online_players = 0;
var ko = 1;

io.on("connection", (socket) => {
    online_players++;
    console.log(`a user connected to Grand Final (${ko}) --(${online_players} users)`);
    io.emit("update_online_players", {"online_players": online_players});
    ko++;
    socket.on("add_Damage", (data) => {
        var clientID = data["clientID"];
        if (GRANDFINALA_DMG_DEALT[data["id"]] == null){
            GRANDFINALA_DMG_DEALT[data["id"]] = {};
        }
        if (GRANDFINALA_DMG_DEALT[data["id"]][clientID] == null || GRANDFINALA_DMG_DEALT[data["id"]][clientID] == undefined){
            GRANDFINALA_DMG_DEALT[data["id"]][clientID] = {};
            GRANDFINALA_DMG_DEALT[data["id"]][clientID]["dealt"] = parseInt(data["amount"]);
            GRANDFINALA_DMG_DEALT[data["id"]][clientID]["nickName"] = data["nickName"];
        } else {
            GRANDFINALA_DMG_DEALT[data["id"]][clientID]["dealt"] += parseInt(data["amount"]);
        }
        if (GRANDFINAL_BOSS_HEALTH[data["id"]] == null){
            GRANDFINAL_BOSS_HEALTH[data["id"]] = GRANDFINAL_BOSS_HEALTH_MAX;
        }
        GRANDFINAL_BOSS_HEALTH[data["id"]] -= parseInt(data["amount"]);
        if (GRANDFINAL_BOSS_HEALTH[data["id"]] <= 0 && !GF_DID[data["id"]]){
            io.emit("GrandFinal_Boss_died", {"all": GRANDFINALA_DMG_DEALT[data["id"]]});
            fs.writeFileSync(`./GF_bosses_dead/${data["id"]}_dead.json`, JSON.stringify(GRANDFINALA_DMG_DEALT[data["id"]], null, 2), "utf-8");
            GF_DID[data["id"]] = true;
        }
        io.emit("do_Damage", {"amount": data["amount"], "current": GRANDFINAL_BOSS_HEALTH[data["id"]]});
    });
    socket.on("disconnect", (e) => {
       online_players--;
       io.emit("update_online_players", {"online_players": online_players});
    });
});




var port = 80;
http.listen(port, function(){
	console.log(datetimeNow() +" Runnig Express Server at mode:%s",port,app.settings.env);
});



var getIP = function (req){
    const remoteAddress = req.connection.remoteAddress;
    const splittedAddress = remoteAddress.split(':');
    const IP = splittedAddress[splittedAddress.length - 1];
    return IP;
}


const __quizinfo_1 = JSON.parse(fs.readFileSync("./item/quizinfo-1.json", "utf8"));
const __quizinfo_2 = JSON.parse(fs.readFileSync("./item/quizinfo-2.json", "utf8"));
const __quizinfo_3 = JSON.parse(fs.readFileSync("./item/quizinfo-3.json", "utf8"));
const __quizinfo_4 = JSON.parse(fs.readFileSync("./item/quizinfo-4.json", "utf8"));
const __quizinfo_5 = JSON.parse(fs.readFileSync("./item/quizinfo-5.json", "utf8"));
const __quizinfo_6 = JSON.parse(fs.readFileSync("./item/quizinfo-6.json", "utf8"));
const __quizinfo_7 = JSON.parse(fs.readFileSync("./item/quizinfo-7.json", "utf8"));
const __quizinfo_8 = JSON.parse(fs.readFileSync("./item/quizinfo-8.json", "utf8"));
const __quizinfo_9 = JSON.parse(fs.readFileSync("./item/quizinfo-9.json", "utf8"));
const __quizinfo_10 = JSON.parse(fs.readFileSync("./item/quizinfo-10.json", "utf8"));
const __quizinfo_11 = JSON.parse(fs.readFileSync("./item/quizinfo-11.json", "utf8"));
const __quizinfo_12 = JSON.parse(fs.readFileSync("./item/quizinfo-12.json", "utf8"));
const __quizinfo_13 = JSON.parse(fs.readFileSync("./item/quizinfo-13.json", "utf8"));
const __quizinfo_14 = JSON.parse(fs.readFileSync("./item/quizinfo-14.json", "utf8"));
const __quizinfo_15 = JSON.parse(fs.readFileSync("./item/quizinfo-15.json", "utf8"));
const __villagerHint_1 = JSON.parse(fs.readFileSync("./item/villagerHint-1.json", "utf8"));
const __villagerHint_2 = JSON.parse(fs.readFileSync("./item/villagerHint-2.json", "utf8"));


const IDmap = {
    "4353125532": __quizinfo_1, // sword
    "6215241800": __quizinfo_2, // sword
    "89854357132": __quizinfo_3, // bow
    "723832236": __quizinfo_4, // bow
    "329236320": __quizinfo_5, // stick

    "61776532": __quizinfo_6, // stick
    "99324682": __quizinfo_7, // stick
    "3126787": __quizinfo_8, // stick
    "23635467": __quizinfo_9, // stick
    "445228676": __quizinfo_10, // stick
    
    "776933235": __quizinfo_11, // stick
    "465781111": __quizinfo_12, // stick
    "223455323": __quizinfo_13, // stick
    "10923190390": __quizinfo_14, // stick
    "821837823": __quizinfo_15, // stick

    "33434245702": __villagerHint_1,
    "357091249": __villagerHint_2
}

const MBOSS_ID_LIST = [
    "1299342163",
    "374263792",
    "82708919",
    "091234420"
]

const MISSION_MAP = {
    "jsiujhkkSADA": "iu4n90a9f0",
    "iu4n90a9f0": "jsiujhkkSADA",

    "iuijh489ujkisd": "oijvAIDJO23",
    "oijvAIDJO23": "iuijh489ujkisd",

    "hji39i8389dawA": "iIJASDOu2q8sa",
    "iIJASDOu2q8sa": "hji39i8389dawA",

    "a889uAS12DS61": "ASjjdsaji1221",
    "ASjjdsaji1221": "a889uAS12DS61",

    "ooASIODJH7": "iujhuioasdAW8",
    "iujhuioasdAW8": "ooASIODJH7"
}


const MISSION_CONTENTMAP = {
    "jsiujhkkSADA": "発心館2階の1D教室横のトイレと2C教室を仕切る壁へ行き、QRコードの読み取りをせよ。",
    "iu4n90a9f0": "発心館1階の自動販売機が陳列するホールの階段へ行き、QRコードの読み取りをせよ。",

    "iuijh489ujkisd": "発心館4階の5B教室横のトイレと5F教室を仕切る壁へ行き、QRコードの読み取りをせよ。",
    "oijvAIDJO23": "発心館3階の階段を出てすぐの、絵画が飾ってある空間へ行き、QRコードの読み取りをせよ。",

    "hji39i8389dawA": "5 教室へ行け",
    "iIJASDOu2q8sa": "6 教室へ行け",

    "a889uAS12DS61": "7 教室へ行け",
    "ASjjdsaji1221": "8 教室へ行け",

    "ooASIODJH7": "9 教室へ行け",
    "iujhuioasdAW8": "10 教室へ行け"
}

const JUST_SCANS_IDs = [
    "2838793871",
    "8ewq8uyyy7768",
    "8779huwdhui",
    "29737892189y7",
    "98fd89uffds",
    "3hdaauddsdsa",
    "uq90fsfdfassa",
    "iojifjqaiu8877"
]


function datetimeNow(){
    var datetime = new Date();
    var year = datetime.getFullYear();
    var month = datetime.getMonth();
    var date = datetime.getDate();
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    var second = datetime.getSeconds();
    if (month < 10){
        month = "0" + month
    }
    if (date < 10){
        date = "0" + date
    }
    if (hour < 10){
        hour = "0" + hour
    }
    if (minute < 10){
        minute = "0" + minute
    }
    if (second < 10){
        second = "0" + second
    }
    
    return "[" + year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second + "]"
}


function datetimeForFp(){
    var datetime = new Date()
    var month = datetime.getMonth()
    var date = datetime.getDate();
    var hour = datetime.getHours();
    var minute = datetime.getMinutes();
    if (month < 10){
        month = "0" + month
    }
    if (date < 10){
        date = "0" + date
    }
    if (hour < 10){
        hour = "0" + hour
    }
    if (minute < 10){
        minute = "0" + minute
    }
    
    return month + "m-" + date + "d-" + hour + "h-" + minute + "m"
}



app.post("/getBossfight_schedule", function(req, res){
    var data = JSON.parse(fs.readFileSync(`./free/eventdata/bossfight.schedule.json`, "utf8"));
    res.send(data)
})

app.post("/data", function(req, res) {
    var clientIP = getIP(req);
    var fileN = req.body["fileN"]

    if (!(req.body["x"] === void(0))){
        try{
            var allData = JSON.parse(fs.readFileSync(`./clientData/client-data-${fileN}.json`, "utf8"));
        } catch(e){
            var allData = {}
        }

        var clientID = req.body["clientID"]
        if (clientID === "IP"){
            clientID = clientIP
        }

        allData[clientID] = {
            "nickName": req.body["x"],
            "kagos": [],
            "items": [],
            "finishedevents": [],
            "finishedmbosses": [],
            "scannedMISSIONS": [],
            "slainObstacle": false,
            "just_scans": []
        };

        allData = JSON.stringify(allData, null, 2);
        fs.writeFileSync(`./clientData/client-data-${fileN}.json`, allData);
        res.send(true)
        return
    }

    var clientData = req.body;
    var clientID = clientData["clientID"];
    var url_id = clientData["url_id"];

    try {
        var allClientData = JSON.parse(fs.readFileSync(`./clientData/client-data-${fileN}.json`, "utf8"));

        if (Object.keys(allClientData).includes(clientID)){
            if (allClientData[clientID]["kagos"] === undefined){
                var clientkagos = [];
            } else {
                var clientkagos = allClientData[clientID]["kagos"];
            }
        } else {
            var clientkagos = [];
        }
    } catch (e){
        var allClientData = {};
        var clientkagos = [];
    }


    if (Object.keys(allClientData).includes(clientID)){
        var newClientkago = clientData["kagoinfo"];
        var clientNickName = allClientData[clientID]["nickName"];
        var clientitems = allClientData[clientID]["items"];
        var finishedevents = allClientData[clientID]["finishedevents"];
        var finishedmbosses = allClientData[clientID]["finishedmbosses"];
        var scannedMISSIONS = allClientData[clientID]["scannedMISSIONS"];
        var slainObstacle = allClientData[clientID]["slainObstacle"];
        var just_scans = allClientData[clientID]["just_scans"];

        if (clientitems == (undefined || null)){
            clientitems = [];
        }
        if (finishedevents == (undefined || null)){
            finishedevents = [];
        }
        if (finishedmbosses == (undefined || null)){
            finishedmbosses = [];
        }
        if (scannedMISSIONS == (undefined || null)){
            scannedMISSIONS = [];
        }
        if (slainObstacle == (undefined || null)){
            slainObstacle = false;
        }
        if (just_scans == (undefined || null)){
            just_scans = [];
        }

        finishedevents.push(url_id)
        for (x=0;x<clientitems.length;x++){
            // 武器が重複しないように
            if (clientitems[x]["type"] == newClientkago["type"]){
                clientitems.splice(x, 1)
                break;
            }
        }
        clientitems.push(newClientkago)
        allClientData[clientID] = {
            "nickName": clientNickName,
            "kagos": clientkagos,
            "items": clientitems,
            "finishedevents": finishedevents,
            "finishedmbosses": finishedmbosses,
            "scannedMISSIONS": scannedMISSIONS,
            "slainObstacle": slainObstacle,
            "just_scans": just_scans
        }
    } else {
        allClientData[clientID] = clientData;
    }
    
    allClientData = JSON.stringify(allClientData, null, 2);
    fs.writeFileSync(`./clientData/client-data-${fileN}.json`, allClientData);
    
    res.send(true);
})


app.post("/init", function(req, res) {
    var clientIP = getIP(req);
    var postData = req.body;
    var req_url = postData["url"]
    var fileN = postData["fileN"]

    var clientID = postData["clientID"];
    if (clientID === "IP"){
        clientID = clientIP
    }

    var url_id = postData["url_id"];
    var info = IDmap[url_id];
    var visiblefilename = String(req_url).replace("http://219.102.171.100:25565/", "")
    try{
        var data = JSON.parse(fs.readFileSync(`./clientData/client-data-${fileN}.json`, "utf8"))
        var clientnickname = data[clientID]["nickName"]
    } catch(e){
        var clientnickname = clientIP
    }
    
    //console.log(datetimeNow() + " " + clientnickname + " accessed: " + visiblefilename);

    try {
        var allData = JSON.parse(fs.readFileSync(`./clientData/client-data-${fileN}.json`, "utf8"));
    } catch(e){
        var allData = {};
    }

    if (url_id === "nickName"){
        if (Object.keys(allData).includes(clientID)){
            res.send("already nicked");
        } else {
            if (isNickPart_0){
                res.send("not nicked yet");
            } else {
                res.send("not nicked yet but !isNickPart")
            }
        }
        return;
    }

    try {
        if (!(Object.keys(allData).includes(clientID))){
            res.send("not customer");
            return;
        }
    } catch(e){
        res.send("not customer");
        return;
    }

    if (!(info === void(0))){
        if (!(allData[clientID]["kagos"] === (null || undefined))){
            if (allData[clientID]["finishedevents"].includes(url_id)){
                res.send("claimed item" + info["kagoname"]);
            } else{
                res.send(info);
            }
        } else {
            res.send(info);
        }
    } else {
        res.send("incorrect ID");
    }
})


app.post("/clientData", function(req, res) {
    var clientID = req.body["clientID"]
    var _data = JSON.parse(fs.readFileSync(`./clientData/client-data-free.json`, "utf8"));
    var _resdata = _data[clientID];
    res.send(_resdata);
});


app.post("/getdata", function(req, res){
    var id = req.body["id"];
    var team = req.body["fileN"];
    var data = JSON.parse(fs.readFileSync(`./clientData/client-data-${team}.json`))[id];
    
    res.send(data);
});


app.post("/getNick", function(req, res) {
    var clientID = req.body["clientID"]
    var fileN = req.body["fileN"]

    try{
        var _data = JSON.parse(fs.readFileSync(`./clientData/client-data-${fileN}.json`, "utf8"));
        var _resdata = _data[clientID]["nickName"];
    } catch(e){
        res.send(null);
        return;
    }
    res.send(_resdata);
})


app.post("/newClientID", function(req, res) {
    var newID = Math.floor(Math.random() * (9999999 - 1000)) + 1000;
    var fileN = req.body["fileN"]

    try {
        var allClientData = JSON.parse(fs.readFileSync(`./clientData/client-data-${fileN}.json`, "utf8"));
    } catch(e){
        res.send(String(newID));
        return;
    }

    do {
        if (!(Object.keys(allClientData).includes(String(newID)))){
            break;
        }
        newID = Math.floor(Math.random() * (9999999 - 1)) + 1000;
    } while (Object.keys(allClientData).includes(String(newID)));

    res.send(String(newID));
})


app.post("/getEndsAt", function(req, res) {
    var deltarr = JSON.parse(fs.readFileSync("./eventData/shedule.json", "utf8"));
    res.send(deltarr)
})

app.post("/modifyendsAt", (req, res) => {
    var endsAt = req.body

    endsAt = JSON.stringify(endsAt, null, 2)

    fs.writeFileSync("./eventData/shedule.json", endsAt)

    res.send(true)
})

app.post("/IDmaplist", function(req, res) {
    var idlist = Object.keys(IDmap)
    res.send(idlist)
})


app.post("/allClientData", (req, res) => {
    var clientID = req.body["clinetID"]
    var tag
    var log = req.body["log"]
    var alldata = {}
    for (var i of ["0", "1", "2"]){
        try {
            alldata[i] = JSON.parse(fs.readFileSync(`./clientData/client-data-${i}.json`, "utf8"));
        } catch(e){
            ;
        }
    }

    try{
        for (let i of ["0", "1", "2"]){
            try {
                var nickname = alldata[i][clientID]["nickName"]
            } catch(e){
                clientID = void(0)
            }
        }
    } catch(e){
        clientID = void(0)
    }

    if (clientID){
        tag = nickname
    } else {
        tag = getIP(req)
    }

    res.send(alldata)
})

app.post("/updatekagos", (req, res) => {
    var data = req.body
    var kagos = data["kagos"]
    var clientid = data["clientid"]
    var clientname = data["clientname"]
    var kagoname = data["kagoname"]
    var fileN = data["fileN"]
    var clientIP = getIP(req)
    var alldata = JSON.parse(fs.readFileSync(`./clientData/client-data-${fileN}.json`, "utf8"))

    if (data["removedkago"] !== undefined){
        console.log("<system> " + datetimeNow() + " " + clientIP + ": removed " + kagoname + " from " + clientname)
    } else if (data["addedkago"] !== undefined){
        console.log("<system> " + datetimeNow() + " " + clientIP + ": added " + kagoname + " to " + clientname)
    } else {
        console.log("<system> " + datetimeNow() + " " + clientIP + ": edited " + clientname + "'s " + kagoname)
    }
    
    kagos ? alldata[clientid]["kagos"] = kagos : alldata[clientid]["kagos"] = []
    
    allclientdata = JSON.stringify(alldata, null, 2)
    fs.writeFileSync(`./clientData/client-data-${fileN}.json`, allclientdata)
    res.send(null)
})

app.post("/addKagoToAllteam", (req, res) => {
    var clientIP = getIP(req)
    var newKago = req.body
    
    for (var type of ["2", "1", "0"]){
        try{
            var alldata = JSON.parse(fs.readFileSync(`./clientData/client-data-${type}.json`, "utf8"))

            console.log(`${datetimeNow()} ${clientIP} added ${newKago["kagoname"]} to all client(Kago)`)

            for (var clientid in alldata){
                var clientdata = alldata[clientid]

                clientdata["kagos"].push(newKago)
            }

            alldata = JSON.stringify(alldata, null, 2);
            fs.writeFileSync(`./clientData/client-data-${type}.json`, alldata)
        } catch(e){
            ;
        }        
    }
    res.send(true)
})

app.post("/addKagoToSingleteam", (req, res) => {
    var data = req.body
    var newKago = data["newKago"]
    var fileN = data["fileN"]
    var alldata = JSON.parse(fs.readFileSync(`./clientData/client-data-${fileN}.json`, "utf8"))

    for (var clientid in alldata){
        var clientdata = alldata[clientid]

        clientdata["kagos"].push(newKago)
    }

    alldata = JSON.stringify(alldata, null, 2);
    fs.writeFileSync(`./clientData/client-data-${fileN}.json`, alldata)

    res.send(true)
})

app.post("/removeClient", (req, res) => {
    var data = req.body
    var clientIP = getIP(req)
    var clinetid = data["clientid"]
    var fileN = data["fileN"]
    var alldata = JSON.parse(fs.readFileSync(`./clientData/client-data-${fileN}.json`, "utf8"))
    var nickname = alldata[clinetid]["nickName"]

    delete alldata[clinetid]

    console.log(`${datetimeNow()} ${clientIP} banned ${nickname}`)

    alldata = JSON.stringify(alldata, null, 2);
    fs.writeFileSync(`./clientData/client-data-${fileN}.json`, alldata)

    res.send(true)
})

app.post("/removeteam", (req, res) => {
    var fileN = req.body["fileN"]
    var IP = getIP(req)

    var fp = `./clientData/client-data-${fileN}.json`
    try {
        var fileContent = fs.readFileSync(fp, "utf8")
        fs.writeFileSync(`./clientData-CACHE/${fileN}-${datetimeForFp()}.json`, fileContent)
        fs.unlinkSync(fp);
        console.log(`<system> ${datetimeNow()} ${IP} removed team${fileN}`)
        res.send(true)
    } catch(e){
        console.log(e)
        console.log(`<system> ${datetimeNow()} ${IP} failed removing team${fileN}`)
        res.send("couldn't find provided fp")
    }
})

app.post("/test", (req, res) => {
    res.send(true)
})

app.post("/getnickURLID", (req, res) => {
    var getkago_js = fs.readFileSync("./src/customers/events/quiz/getKago.js", "utf8");

    function ke(js, index, variable){
        return js.split("\n")[index].replace(`const ${variable} = `, "").replace(" ", "").replace('"', '').replace(`"`, ``)
    }
    var resss = {
        "free": ke(getkago_js, 21, "nickName_URL_ID_FREE"),
        "ranking_A": ke(getkago_js, 19, "nickName_URL_ID_A"),
        "ranking_B": ke(getkago_js, 20, "nickName_URL_ID_B")
    }
    
    res.send(resss)
})

app.post("/modifynickURLID", (req, res) => {
    var path = "./src/customers/events/quiz/getKago.js";
    var getkago_js = fs.readFileSync(path, "utf8");
    var freeNewID = req.body["free"];
    var rankingNewID_A = req.body["ranking_A"];
    var rankingNewID_B = req.body["ranking_B"];
    var lin = getkago_js.split("\n");
    lin[21] = `const nickName_URL_ID_FREE = "${freeNewID}"`;
    lin[19] = `const nickName_URL_ID_A = "${rankingNewID_A}"`;
    lin[20] = `const nickName_URL_ID_B = "${rankingNewID_B}"`;
    var jssrc = lin.join("\n");
    fs.writeFileSync(path, jssrc, "utf8");
    res.send(true);
})

app.post("/forAdminspassword", (req, res) => {
    var password = req.body["password"]
    var dsa = req.body["dsa"]
    var C = "itoshun"
    var statu = false
    var log = ""
    var IP = getIP(req)
    
    password === C ? statu = true : statu = false
    statu ? log = `<system> ${datetimeNow()} ${IP}: forAdmins.hmtl ${dsa}` : log = `<system> ${datetimeNow()} ${IP} missed password(${password}) ${dsa}`
    res.send(statu)
})

app.post("/generateQRcode", (req, res) => {
    var URL = req.body["URL"]

    QR.toDataURL(URL, {width: 256}, (err, QRDataURL) => {
        if (err){
            console.log(err)
            res.send(false)
            return
        }

        res.send(QRDataURL)
    })
})

app.post("/isNickPart", (req, res) => {
    var response = {
        "A": isNickPart_0
    }
    res.send(response)
})

app.post("/toggle_isNickPart_A", (req, res) => {
    var p = req.body["isNickPart"]
    var IP = getIP(req)
    var response = {
        "A": isNickPart_0
    }
    if (String(p) == "true") p = true
    if (String(p) == "false") p = false
    if (!isNickPart_0 == p) {
        isNickPart_0 = p
        console.log(`<system> ${datetimeNow()} ${IP}: isNickPart_0 toggled: ` + isNickPart_0)
        res.send(response)
        return
    } else {
        console.log(`<system> ${datetimeNow()} ${IP}: isNickPart_0 error: ` + isNickPart_0, p)
        res.send("error")
        return
    }
})


app.post("/mboss__init__", (req, res) => {
    var fileN = req.body["fileN"];
    var clientID = req.body["clientID"];
    var mbossID = req.body["mbossID"];
    var resp = {};
    try {
        var file = JSON.parse(fs.readFileSync(`./clientData/client-data-${fileN}.json`));
        resp["name"] = file[clientID]["nickName"];
        var mbossC = file[clientID]["finishedmbosses"].length;
        var quizC = file[clientID]["finishedevents"].length;
        switch (mbossC){
            case 0:
                if (quizC < 3){
                    resp["neu"] = true;
                    resp["needed"] = 3-quizC;
                }
                break;
            case 1:
                if (quizC < 5){
                    resp["neu"] = true;
                    resp["needed"] = 5-quizC;
                }
                break;
            case 2:
                if (quizC < 9){
                    resp["neu"] = true;
                    resp["needed"] = 9-quizC;
                }
                break;
            case 3:
                if (quizC < 12){
                    resp["neu"] = true;
                    resp["needed"] = 12-quizC;
                }
                break;
        }
        if (file[clientID]["finishedevents"].length )
        if (file[clientID]["finishedmbosses"].includes(mbossID)){
            resp["alr"] = true;
        }
        var itmm = ["剣", "弓", "杖"];
        for (var item of file[clientID]["items"]){
            var type = item["type"];
            itmm = itmm.filter(x => {
                return x != type;
            });
        }
        if (itmm.length != 0){
            resp["new"] = true;
            resp["missing"] = itmm;
        }
    } catch (e){
        resp["whoru"] = true;
    }
    if (!MBOSS_ID_LIST.includes(mbossID)){
        resp["notfound"] = true;
    }
    res.send(resp);
});


app.post("/get_client_details", (req, res) => {
    const body = req.body;
    const CLIENT_ID = body["clientID"];
    const FILE_N = body["fileN"];
    var response = {};
    try{
        file = JSON.parse(fs.readFileSync(`./clientData/client-data-${FILE_N}.json`));
        response = file[CLIENT_ID];
    } catch (e){
        response["unknown_client"] = true;
    }
    if (response == null){
        response = {};
        response["unknown_client"] = true;
    }
    res.status(200).send(response);
});


app.post("/mboss__clear__", (req, res) => {
    var body = req.body;
    var clientID = body["clientID"];
    var fileN = body["fileN"];
    var inscreasement = body["inscreasement"];
    var cleared = body["url_id"];
    var path = `./clientData/client-data-${fileN}.json`;
    try{
        var file = JSON.parse(fs.readFileSync(path, "utf-8"));
        me = file[clientID];
        var im = [];
        /*
        for (var item of me["items"]){
            im.push(
                {
                    "type": item["type"],
                    "stars": parseInt(item["stars"]) + parseInt(inscreasement),
                    "rarity": item["rarity"]
                }
            )
        }
        me["items"] = im;*/
        me["kagos"].push({
            "claimed": datetimeNow()
        });
        me["finishedmbosses"].push(cleared);
        file[clientID] = me;
        fs.writeFileSync(path, JSON.stringify(file, null, 2), "utf8");
        res.end();
    } catch (e){
        res.send("500 Internal Server Error");
    }
});



app.post("/get_misson_", (req, res) => {
    var body = req.body;
    var url_id = body["url_id"];
    var clientID = body["clientID"];
    var fileN = body["fileN"];
    var response = {};
    var path = `./clientData/client-data-${fileN}.json`;

    if (!Object.keys(MISSION_MAP).includes(url_id)){
        response["notfound"] = true;
        res.send(response);
        return;
    }
    try{
        var fi = JSON.parse(fs.readFileSync(path));
        var data = fi[clientID];
        response = data;
        if (response == null){
            response = {};
            response["whoru"] = true;
            throw new Error();
        }
        var scannedMISSIONS = response["scannedMISSIONS"];
        if (scannedMISSIONS.includes(url_id) && scannedMISSIONS.includes(MISSION_MAP[url_id])){
            response["alr"] = true;
            res.send(response);
            return;
        }
        if (!scannedMISSIONS.includes(url_id)){
            scannedMISSIONS.push(url_id);
            response["scannedMISSIONS"] = scannedMISSIONS;
        }
        if (scannedMISSIONS.includes(MISSION_MAP[url_id])){
            var kje = response;
            var imm = [];
            response["can_claim_rewards"] = true;
            // add 2 stars for each weapons
            for (var item of kje["items"]){
                imm.push(
                    {
                        "type": item["type"],
                        "stars": parseInt(item["stars"]) + 2,
                        "rarity": item["rarity"]
                    }
                )
            }
            kje["items"] = imm;
            fi[clientID] = kje;
            fs.writeFileSync(path, JSON.stringify(fi, null, 2), "utf-8");
            response["mission_content"] = MISSION_CONTENTMAP[url_id];
        } else {
            delete response["can_claim_rewards"];
            fi[clientID] = response;
            fs.writeFileSync(path, JSON.stringify(fi, null, 2), "utf-8");
            response["mission_content"] = MISSION_CONTENTMAP[url_id];
        }
    } catch (e){
        response["unknown_client"] = true;
    }
    res.send(response);
});



app.post("/__slainObstacle__", (req, res) => {
    var body = req.body;
    var clientID = body["clientID"];
    var fileN = body["fileN"];
    var path = `./clientData/client-data-${fileN}.json`;
    var response = {};
    // slainObstacle
    try{
        var file = JSON.parse(fs.readFileSync(path, "utf-8"));
        var my_data = file[clientID];
        if (my_data == null){
            response["whoru"] = true; // ()
            throw new Error();
        }
        response = my_data;
        if (my_data["slainObstacle"]){
            response["alr"] = true;
        }
    } catch (e){
        response["whoru"] = true;
    }
    res.send(response);
});


app.post("/obstacle__clear__", (req, res) => {
    var body = req.body;
    var clientID = body["clientID"];
    var fileN = body["fileN"];
    var path = `./clientData/client-data-${fileN}.json`;
    try{
        var file = JSON.parse(fs.readFileSync(path, "utf-8"));
        file[clientID]["slainObstacle"] = true;
        fs.writeFileSync(path, JSON.stringify(file, null, 2), "utf-8");
    } catch (e){
        res.send("500 Internal Server Error");
    }
});


app.post("/grandfinal__init__", (req, res) => {
    var body = req.body;
    var clientID = body["clientID"];
    var fileN = body["fileN"];
    var path = `./clientData/client-data-${fileN}.json`;
    var response = {};
    // slainObstacle
    try{
        var file = JSON.parse(fs.readFileSync(path, "utf-8"));
        var my_data = file[clientID];
        if (my_data == null){
            response["whoru"] = true; // ()
            throw new Error();
        }
        response = my_data;
        if (!my_data["slainObstacle"]){
            response["early_to_see"] = true;
        }
    } catch (e){
        response["whoru"] = true;
    }
    res.send(response);
});


app.post("/get_BOSS_MAX_HEALTH", (req, res) => {
    var id = req.body["id"];
    var current = GRANDFINAL_BOSS_HEALTH[id];
    if (!current)
        current = GRANDFINAL_BOSS_HEALTH_MAX
    res.send({"max": String(GRANDFINAL_BOSS_HEALTH_MAX), "current": current});
});


app.post("/__init__", (req, res) => {
    var body = req.body;
    var clientID = body["clientID"];
    var fileN = body["fileN"];
    var path = `./clientData/client-data-${fileN}.json`;
    try {
        var file = JSON.parse(fs.readFileSync(path));
        delete file[clientID];
        fs.writeFileSync(path, JSON.stringify(file, null, 2), "utf-8");
    } catch (e){}
    res.end();
});


app.post("/get_online_players", (req, res) => {
    res.send(String(online_players +1));
});

app.post("/get_just_scans", (req, res) => {
    var body = req.body;
    var clientID = body["clientID"];
    var fileN = body["fileN"];
    var id = body["id"];
    var path = `./clientData/client-data-${fileN}.json`;
    var r = {};
    var imm = [];
    
    try{
        var file = JSON.parse(fs.readFileSync(path));
        var data = file[clientID];
        if (data == null)
            throw new Error();
        r["nickName"] = data["nickName"];
        if (!JUST_SCANS_IDs.includes(id)){
            r["bad"] = true;
        }
        if (data["just_scans"].includes(id)){
            r["alr"] = true;
        } else {
            for (var item of data["items"]){
                imm.push(
                    {
                        "type": item["type"],
                        "stars": parseInt(item["stars"]) + 5,
                        "rarity": item["rarity"]
                    }
                )
            }
            data["items"] = imm;
            data["just_scans"].push(id);
            file[clientID] = data;
            fs.writeFileSync(path, JSON.stringify(file, null, 2), "utf-8");
        }
    } catch (e){
        r["whoru"] = true;
    }
    res.send(r);
});


app.use((req, res, next) => {
    res.status(404).redirect("/src/busy/");
});

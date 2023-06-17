var express = require('express');
const bodyParser = require('body-parser');

var app = express();
app.use(express.static('./'));
var datetime = new Date();

const fs = require("fs");
const { stringify } = require('querystring');
const { isPromise } = require('util/types');
const QR = require('qrcode');
const axios = require('axios');
const sharp = require('sharp');


// urlencodedとjsonは別々に初期化する
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


var port = 25565;
app.listen(port, function(){
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
const __villagerHint_1 = JSON.parse(fs.readFileSync("./item/villagerHint-1.json", "utf8"));
const __villagerHint_2 = JSON.parse(fs.readFileSync("./item/villagerHint-2.json", "utf8"));


const IDmap = {
    "4353": __quizinfo_1,
    "6800": __quizinfo_2,
    "8982": __quizinfo_3,
    "7238": __quizinfo_4,
    "33402": __villagerHint_1,
    "35749": __villagerHint_2
}

function datetimeNow(){
    var datetime = new Date()
    var year = datetime.getFullYear()
    var month = datetime.getMonth()
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

app.post("/data", function(req, res) {
    var clientIP = getIP(req);
    var team = req.body["team"]

    if (!(req.body["x"] === void(0))){
        try{
            var allData = JSON.parse(fs.readFileSync(`./clientData/client-data-team${team}.json`, "utf8"));
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
            "finishedevents": []
        };

        console.log(Object.keys(allData).length + " users ever nicked")
        allData = JSON.stringify(allData, null, 2);
        fs.writeFileSync(`./clientData/client-data-team${team}.json`, allData);
        return
    }

    var clientData = req.body;
    var clientID = clientData["clientID"];
    var url_id = clientData["url_id"];

    try {
        var allClientData = JSON.parse(fs.readFileSync(`./clientData/client-data-team${team}.json`, "utf8"));

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
        var clientitems = allClientData[clientID]["items"]
        var finishedevents = allClientData[clientID]["finishedevents"]

        if (clientitems == (undefined || null)){
            clientitems = []
        }
        if (finishedevents == (undefined || null)){
            finishedevents = []
        }

        finishedevents.push(url_id)
        clientkagos.push(newClientkago)
        allClientData[clientID] = {
            "nickName": clientNickName,
            "kagos": clientkagos,
            "items": clientitems,
            "finishedevents": finishedevents
        }
    } else {
        allClientData[clientID] = clientData;
    }
    
    allClientData = JSON.stringify(allClientData, null, 2);
    fs.writeFileSync(`./clientData/client-data-team${team}.json`, allClientData);
    
    res.end();
})


app.post("/init", function(req, res) {
    var clientIP = getIP(req);
    var postData = req.body;
    var req_url = postData["url"]
    var team = postData["team"]

    var clientID = postData["clientID"];
    if (clientID === "IP"){
        clientID = clientIP
    }

    var url_id = postData["url_id"];
    var info = IDmap[url_id];
    var visiblefilename = String(req_url).replace("http://219.102.171.100:25565/", "")
    try{
        var data = JSON.parse(fs.readFileSync(`./clientData/client-data-team${team}.json`, "utf8"))
        var clientnickname = data[clientID]["nickName"]
    } catch(e){
        var clientnickname = clientIP
    }
    
    console.log(datetimeNow() + " " + clientnickname + " accessed: " + visiblefilename);

    try {
        var allData = JSON.parse(fs.readFileSync(`./clientData/client-data-team${team}.json`, "utf8"));
    } catch(e){
        var allData = {};
    }

    if (url_id === "nickName"){
        if (Object.keys(allData).includes(clientID)){
            res.send("already nicked");
        } else {
            res.send("not nicked yet");
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
    var team = req.body["team"]
    var clientID = req.body["clientID"]
    var _data = JSON.parse(fs.readFileSync(`./clientData/client-data-team${team}.json`, "utf8"));
    var _resdata = _data[clientID];
    res.send(_resdata);
})


app.post("/getNick", function(req, res) {
    var clientID = req.body["clientID"]
    var team = req.body["team"]
    try{
        var _data = JSON.parse(fs.readFileSync(`./clientData/client-data-team${team}.json`, "utf8"));
        var _resdata = _data[clientID]["nickName"];
    } catch(e){
        res.send(null);
        return;
    }
    res.send(_resdata);
})


app.post("/newClientID", function(req, res) {
    var newID = Math.floor(Math.random() * (9999999 - 1000)) + 1000;
    var clientIP = getIP(req);
    var team = req.body["team"]
    console.log(clientIP + ": Generating New ID");

    try {
        var allClientData = JSON.parse(fs.readFileSync(`./clientData/client-data-team${team}.json`, "utf8"));
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
    var deltarr = JSON.parse(fs.readFileSync("./eventData/endsAt.json", "utf8"));
    res.send(deltarr)
})

app.post("/modifyendsAt", (req, res) => {
    var endsAt = req.body
    endsAt = {
        "endsAt": {
            "1": endsAt["endsAt"][0],
            "2": endsAt["endsAt"][1],
            "3": endsAt["endsAt"][2]
        },
        "nextStartsAt": endsAt["nextStartsAt"]
    }

    endsAt = JSON.stringify(endsAt, null, 2)

    fs.writeFileSync("./eventData/endsAt.json", endsAt)

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
    for (var i of ["1", "2", "3"]){
        try {
            alldata[i] = JSON.parse(fs.readFileSync(`./clientData/client-data-team${i}.json`, "utf8"));
        } catch(e){
            ;
        }
    }

    try{
        for (let i of ["1", "2", "3"]){
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
    var team = data["team"]
    var clientIP = getIP(req)
    var alldata = JSON.parse(fs.readFileSync(`./clientData/client-data-team${team}.json`, "utf8"))

    if (data["removedkago"] !== undefined){
        console.log("<system> " + datetimeNow() + " " + clientIP + ": removed " + kagoname + " from " + clientname)
    } else if (data["addedkago"] !== undefined){
        console.log("<system> " + datetimeNow() + " " + clientIP + ": added " + kagoname + " to " + clientname)
    } else {
        console.log("<system> " + datetimeNow() + " " + clientIP + ": edited " + clientname + "'s " + kagoname)
    }
    
    kagos ? alldata[clientid]["kagos"] = kagos : alldata[clientid]["kagos"] = []
    
    allclientdata = JSON.stringify(alldata, null, 2)
    fs.writeFileSync(`./clientData/client-data-team${team}.json`, allclientdata)
    res.send(null)
})

app.post("/addKagoToAllteam", (req, res) => {
    var clientIP = getIP(req)
    var newKago = req.body
    
    for (var team of ["1", "2"]){
        try{
            var alldata = JSON.parse(fs.readFileSync(`./clientData/client-data-team${team}.json`, "utf8"))

            console.log(`${datetimeNow()} ${clientIP} added ${newKago["kagoname"]} to all client(Kago)`)

            for (var clientid in alldata){
                var clientdata = alldata[clientid]

                clientdata["kagos"].push(newKago)
            }

            alldata = JSON.stringify(alldata, null, 2);
            fs.writeFileSync(`./clientData/client-data-team${team}.json`, alldata)
        } catch(e){
            ;
        }        
    }
    res.send(true)
})

app.post("/addKagoToSingleteam", (req, res) => {
    var data = req.body
    var newKago = data["newKago"]
    var team = data["team"]
    var alldata = JSON.parse(fs.readFileSync(`./clientData/client-data-team${team}.json`, "utf8"))

    for (var clientid in alldata){
        var clientdata = alldata[clientid]

        clientdata["kagos"].push(newKago)
    }

    alldata = JSON.stringify(alldata, null, 2);
    fs.writeFileSync(`./clientData/client-data-team${team}.json`, alldata)

    res.send(true)
})

app.post("/removeClient", (req, res) => {
    var data = req.body
    var clientIP = getIP(req)
    var clinetid = data["clientid"]
    var team = data["team"]
    var alldata = JSON.parse(fs.readFileSync(`./clientData/client-data-team${team}.json`, "utf8"))
    var nickname = alldata[clinetid]["nickName"]

    delete alldata[clinetid]

    console.log(`${datetimeNow()} ${clientIP} banned ${nickname}`)

    alldata = JSON.stringify(alldata, null, 2);
    fs.writeFileSync(`./clientData/client-data-team${team}.json`, alldata)

    res.send(true)
})

app.post("/removeteam", (req, res) => {
    var team = req.body["team"]
    var IP = getIP(req)

    var fp = `./clientData/client-data-team${team}.json`
    try {
        var fileContent = fs.readFileSync(fp, "utf8")
        fs.writeFileSync(`./clientData-CACHE/team${team}-${datetimeForFp()}.json`, fileContent)
        fs.unlinkSync(fp);
        console.log(`<system> ${datetimeNow()} ${IP} removed team${team}`)
        res.send(true)
    } catch(e){
        console.log(e)
        console.log(`<system> ${datetimeNow()} ${IP} failed removing team${team}`)
        res.send("couldn't find provided fp")
    }
})

app.post("/test", (req, res) => {
    res.send(true)
})

app.post("/getnickURLID", (req, res) => {
    var getKagoJS = fs.readFileSync("./getkago.js", 'utf8')
    var lines = getKagoJS.split("\n")
    var URLID = lines[14].replace("const nickName_URL_ID = ", "").replace(" ", "").replace('"', '').replace(`"`, ``)
    
    res.send(URLID)
})

app.post("/modifynickURLID", (req, res) => {
    var newID = req.body["newID"]
    var getKagoJS = fs.readFileSync("./getKago.js", "utf8")
    var lines = getKagoJS.split("\n")
    var IP = getIP(req)

    lines[14] = `const nickName_URL_ID = "${newID}"`

    var updated_getKagoJS = lines.join("\n")

    try {
        fs.writeFileSync("./getKago.js", updated_getKagoJS, "utf8")
    } catch(e){
        res.send(false)
        return
    } finally {
        console.log(`<system> ${datetimeNow()} ${IP} edited nickURLID(${newID})`)
    }
    
    res.send(true)
})

app.post("/forAdminspassword", (req, res) => {
    var password = req.body["password"]
    var C = "itoshun"
    var statu = false
    var log = ""
    var IP = getIP(req)
    
    password === C ? statu = true : statu = false
    statu ? log = `<system> ${datetimeNow()} ${IP}: forAdmins.hmtl` : log = `<system> ${datetimeNow()} ${IP} missed password(${password})`
    console.log(log)
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

        console.log(`saved url(${URL}) image: ${QRDataURL}`)
        res.send(QRDataURL)
    })
})

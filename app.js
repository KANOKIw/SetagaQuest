var express = require('express');
const bodyParser = require('body-parser');

var app = express();
app.use(express.static('./'));

const fs = require("fs");
const { stringify } = require('querystring');

// urlencodedとjsonは別々に初期化する
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

var port = 25565;
app.listen(port,function(){
	console.log("Express Server is online mode:%s",port,app.settings.env);
});


var getIP = function (req){
    const remoteAddress = req.connection.remoteAddress;
    const splittedAddress = remoteAddress.split(':');
    const IP = splittedAddress[splittedAddress.length - 1];
    return IP;
}


const __morohanoturugi__ = JSON.parse(fs.readFileSync("./item/morohanoturugi.json", "utf8"));
const __porizyuusu__ = JSON.parse(fs.readFileSync("./item/porizyuusu.json", "utf8"));
const __villagerHint_1 = JSON.parse(fs.readFileSync("./item/villagerHint-1.json", "utf8"));
const __villagerHint_2 = JSON.parse(fs.readFileSync("./item/villagerHint-2.json", "utf8"));

const ItemID = {
    "a": __morohanoturugi__,
    "6800": __porizyuusu__,
    "33402": __villagerHint_1,
    "35749": __villagerHint_2
};


app.post("/data", function(req, res) {
    var clientIP = getIP(req);

    if (!(req.body["x"] === void(0))){
        try{
            var allData = JSON.parse(fs.readFileSync("./config/client-data.json", "utf8"));
        } catch(e){
            var allData = {};
        };

        var clientID = req.body["clientID"]
        if (clientID === "IP"){
            clientID = clientIP
        }

        allData[clientID] = {
            "nickName": req.body["x"]
        };

        allData = JSON.stringify(allData, null, 2);
        fs.writeFileSync("./config/client-data.json", allData);
        return;
    }

    var clientData = req.body;
    var clientID = clientData["items"]["clientID"];
    var itemName = clientData["items"]["itemName"];
    delete clientData["items"]["clientID"];
    delete clientData["items"]["itemName"];

    try {
        var allClientData = JSON.parse(fs.readFileSync("./config/client-data.json", "utf8"));
        if (Object.keys(allClientData).includes(clientID)){
            if (allClientData[clientID]["items"] === undefined){
                clientItems = {};
            } else {
                var clientItems = allClientData[clientID]["items"];
            }
        } else {
            var clientItems = {};
        }
    } catch (e){
        var allClientData = {};
        var clientItems = {};
    };

    if (Object.keys(allClientData).includes(clientID)){
        var newClientItem = clientData["items"][itemName];
        clientItems[itemName] = newClientItem;
        var clientNickName = allClientData[clientID]["nickName"];
        allClientData[clientID] = {
            "nickName": clientNickName,
            "items": clientItems
        };
    } else {
        allClientData[clientID] = clientData;
    };
    
    allClientData = JSON.stringify(allClientData, null, 2);
    fs.writeFileSync("./config/client-data.json", allClientData);

    res.send("claimed item on file");
})


app.post("/init", function(req, res) {
    var clientIP = getIP(req);
    var postData = req.body;

    var clientID = postData["clientID"];
    if (clientID === "IP"){
        clientID = clientIP
    }

    var url_id = postData["url_id"];
    var itemInfo = ItemID[url_id];
    
    console.log(clientIP + ": accessed");

    try {
        var allData = JSON.parse(fs.readFileSync("./config/client-data.json", "utf8"));
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

    //nick登録したお客様か判別(und)
    try {
        if (!(Object.keys(allData).includes(clientID))){
            res.send("not customer");
            return;
        }
    } catch(e){
        res.send("not customer");
        return;
    }

    if (!(itemInfo === void(0))){
        if (!(allData[clientID]["items"] === (null || undefined))){
            if (Object.keys(allData[clientID]["items"]).includes(itemInfo["ItemName"])){
                res.send("claimed item" + itemInfo["ItemName"]);
            } else{
                res.send(itemInfo);
            }
        } else {
            res.send(itemInfo);
        }
    } else {
        res.send("incorrect ID");
    }
})


app.post("/clientData", function(req, res) {
    var clientIP = getIP(req);
    var _data = JSON.parse(fs.readFileSync("./config/client-data.json", "utf8"));
    var _resdata = _data[clientIP];
    res.send(_resdata);
})


app.post("/newClientID", function(req, res) {
    var newID = Math.floor(Math.random() * (99999 - 1000)) + 1000;
    console.log("Generating New ID");

    try {
        var allClientData = JSON.parse(fs.readFileSync("./config/client-data.json", "utf8"));
    } catch(e){
        res.send(String(newID));
        return;
    }

    do {
        if (!(Object.keys(allClientData).includes(String(newID)))){
            break;
        }
        newID = Math.floor(Math.random() * (99999 - 1)) + 1000;
    } while (Object.keys(allClientData).includes(String(newID)));

    res.send(String(newID));
})

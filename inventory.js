class Item {
    constructor(name, img){
        this.name = name;
        this.img = img;
    }
}

//画像ソース集
const swordSrc = "https://cdn.discordapp.com/attachments/1083021323967672421/1113744672435736576/latest.png";
const drugSrc = "https://cdn.discordapp.com/attachments/1080464875869970463/1113063668737917084/P9CR5709-1.png"

//すべてのアイテム一覧
var items = [new Item("剣", swordSrc), new Item("盾"), new Item("回復薬", drugSrc)];
//playerアイテム保存用（未使用）
var playerItems = [];

var gameDisplay = document.querySelector(".gameDisplay");
var inventoryDisplay = document.querySelector(".inventoryDisplay");
var inventoryBtn = document.querySelector("#inventoryBtn");
var inventory = document.querySelector(".inventory");
var largeImg = document.querySelector(".largeImg");
var imgSrc = document.querySelector("#imgSrc");
var _itemName = document.querySelector("#itemName");
var useBtn = document.querySelector("#useItemBtn");
var notUseBtn = document.querySelector("#notUseItemBtn");
var hideInventoryBtn = document.querySelector("#backToGameBtn");

//選択されたアイテムが代入される
var target = null;

function showInventory() {
    gameDisplay.style.display = "none";
    inventoryDisplay.style.display = "block";
}

function hideInventory() {
    gameDisplay.style.display = "block";
    inventoryDisplay.style.display = "none";
}

function hideDetail() {
    largeImg.style.display = "none";
    hideInventoryBtn.addEventListener('click', hideInventory);
}

//アイテムを拡大(くどい)
function showDetail(e) {
    largeImg.style.display = "block";
    target = e.target.tagName=='IMG' || e.target.tagName=='P' ? e.target.parentNode : e.target;
    _itemName.innerHTML = Array.from(target.childNodes).filter(x => x.tagName=='P')[0].textContent; //valueだと動作しない
    imgSrc.src = Array.from(target.childNodes).filter(x => x.tagName=='IMG')[0].getAttribute('src');
    
    //クリック制限
    for(var i of document.querySelectorAll('#item')){
        i.removeEventListener('click', showDetail);
    }
    hideInventoryBtn.removeEventListener('click', hideInventory);
}

//アイテムを使う => アイテムリストから消す
if(useBtn){ 
    useBtn.addEventListener('click', () => {
        hideDetail();
        if(target) {
            removeItem(target);
        }
        //クリック制限の解除
        for(var i of document.querySelectorAll('#item')){
            i.addEventListener('click', showDetail)
        }
    });
}

//アイテムを使わない 
if(notUseBtn){
    notUseBtn.addEventListener('click', () => {
        hideDetail();
        target.addEventListener('click', showDetail);
        //クリック制限の解除
        for(var i of document.querySelectorAll('#item')){
            i.addEventListener('click', showDetail)
        }
    })
}

//hideInventory
if(hideInventoryBtn) hideInventoryBtn.addEventListener('click', hideInventory);


/**
 * 
 * @param {Item} newItem 
 */
//アイテムの追加
function appendItem(newItem) {
    var item = document.createElement('li');
    item.id = "item";
    item.addEventListener('click', showDetail);
    inventory.appendChild(item);
    
    var itemName = document.createElement('p');
    itemName.innerText = newItem.name;
    var itemImg = document.createElement('img');
    itemImg.src = newItem.img;
    
    item.appendChild(itemName);
    item.appendChild(itemImg);    
}
/**
 * 
 * @param {Node} trushItem 
 */
//アイテムの除去（使用後）
function removeItem(trushItem) {
    // inventory.removeChild(trushItem);
    trushItem.remove();
}

window.onload = () => {
    inventoryDisplay.style.display = "none";
    largeImg.style.display = "none";
}


//例
appendItem(items[0]);
appendItem(items[2]);
appendItem(items[2]);
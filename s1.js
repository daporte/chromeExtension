var options = {
    type: "image",
    title: "THE POPUP",
    message:"zdaar",
    iconUrl: "icon.png",
    imageUrl: "icon.png"
}

chrome.notifications.create(options, callback);

function callback(){
    console.log("POPUP DONE")
}

chrome.notifications.onClicked.addListener(replyClick);

function replyClick(){
    alert("aba")
}
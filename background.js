var refreshIntervalId = 0;
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse){
    if(response.command == "start") {
        refreshIntervalId = setInterval(function () {
            engine(response.data, response.action)
        },2000);
    } else if(response.command == "stop") {
        clearInterval(refreshIntervalId);
    }
})

chrome.notifications.onClicked.addListener(function(notid){

    chrome.storage.sync.get("currentNotifPageUrl", function (obj) {
        console.log(obj);
        chrome.tabs.create({url: obj.currentNotifPageUrl}, function (tab) {

        });
    });


})

var contextList = ["selection", "link", "image", "page"];
for(i=0;i<contextList.length;i++) {
    var context = contextList[i];
    var title = "social toolkit";


    chrome.contextMenus.create({
        title: "Twitter social toolkit",
        contexts: [context],
        onclick: myFunction,
        id:context

    });


}
function myFunction(data) {
    switch (data.menuItemId) {
        case "image":
            console.log("got image")
            var options = {
                type: "image",
                title: "THE POPUP",
                message: "zdaar",
                iconUrl: "icon.png",
                imageUrl: data.srcUrl
            }
            console.log(data.srcUrl);
            chrome.notifications.create(options, callback);
            var theUrl = data.srcUrl;

            chrome.storage.sync.set({imageUrl: theUrl});
            chrome.storage.sync.set({pageUrl: data.pageUrl});
            chrome.storage.sync.set({currentNotifPageUrl: data.pageUrl});
            chrome.tabs.create({url: "panel.html"}, function (tab) {
                chrome.tabs.sendMessage(tab.id, {"action": "setBackground", "setUrl": theUrl});
                //chrome.tabs.executeScript(tab.id, {code:"document.body.style.background = blue;"})
                console.log("tabid " + tab.id)
            });


        /*
         chrome.windows.create({url:"panel.html",type:"panel"}, function (newWindow) {
         console.log(newWindow);

         //newWindow.document.getElementById("url").value = "zdaaaar";
         chrome.windows.sendMessage(tab.id, {"action" : "setBackground"});

         chrome.tabs.executeScript(newWindow.tabs[0].id, {
         code: 'document.getElementById("url").value = "zdaaaar";'
         });


         })
         */

        case "selection":
            console.log(data);
            var youtubeUrl = data.selectionText;
            var imageUrl = youtubeUrl.split("/");
            var halfImageUrl = imageUrl[imageUrl.length-1].split("?t=")[0];
            var finalImageUrl = "http://img.youtube.com/vi/" + halfImageUrl + "/0.jpg";

            console.log(imageUrl);
            console.log(finalImageUrl);

            var options = {
                type: "image",
                title: "THE POPUP",
                message: "zdaar",
                iconUrl: "icon.png",
                imageUrl: finalImageUrl

            }
            chrome.storage.sync.set({currentNotifPageUrl: youtubeUrl});
            chrome.notifications.create(options, callback);

            manageNotif(finalImageUrl, youtubeUrl);
    }
}


function callback() {
    console.log("callin back")
}

function callback2(){
    document.getElementById("url").value = "zdaaaar"
}

function manageNotif(imageUrl, youtubeUrl){
    chrome.storage.sync.set({imageUrl: imageUrl});
    chrome.storage.sync.set({pageUrl: youtubeUrl});
    chrome.tabs.create({url: "panel2.html"}, function (tab) {
        //chrome.tabs.executeScript(tab.id, {code:"document.body.style.background = blue;"})
        console.log("tabid " + tab.id)
    });
}

function engine(data, action){

    $.ajax({
        type: "POST",
        url: action,
        data: data, // serializes the form's elements.
        dataType : "json",
        
        success: function(dataz)
        {
            console.log(dataz); // show response from the php script.

            var options = {
                type: "image",
                title: "THE POPUP",
                message: "zdaar",
                iconUrl: "icon.png",
                imageUrl: dataz[0]
            }
            console.log(dataz[0]);
            console.log("mmm");
            console.log(dataz[1]);
            var timeArray = dataz[2];
            console.log("TIME ARRAY");
            console.log(timeArray);

            //Math.floor(Math.random()*timeArray.length)
            var videoTime = timeArray[Object.keys(timeArray)[Math.floor(Math.random()*Object.keys(timeArray).length)]];
            var parsedVideoTime = videoTime/3600+"h"+videoTime/3600/60+"m"+videoTime/3600%60+"s";

            chrome.storage.sync.set({currentNotifPageUrl: dataz[1] + "?t="+videoTime});
            chrome.notifications.create(options, null);
            $.ajax({
                type: "POST",
                url: "http://localhost/db1/setWatched.php",
                data: {imageUrl : dataz[0]},
                success : function(ech){
                    console.log("aa");
                    console.log(ech);

                }
            });

        }


    });
}
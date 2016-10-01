console.log("helloworld")

categoryMap = {};
tree = {"SubCategories" : {}};
nodeKeys = {};
notifMap = {};
notifContentMap = {};
var removedItems = {};

notifId = -1;



$.get("http://localhost/db1/backup2.php", function (data) {

    $submit = $("<br><input type='submit' value='Submit'><br>")
    console.log($.parseJSON(data));
    var topIndex = 0;



    $.get("http://localhost/db1/getNotifs.php", function (notifs) {
        //console.log(data)

        $.each($.parseJSON(notifs), function (index, value) {
            console.log("anchorzz")
            console.log(value);
            var categoryIds = value["CategoryIds"];
/*
            if(typeof categoryIds == "string"){
                categoryIds = [categoryIds];
            }
            */

            notifContentMap[value["NotifId"]] = value;

            if(categoryIds){
                categoryIds = categoryIds.split(",");
                for(var i=0; i<categoryIds.length;i++) {

                    var categoryId = categoryIds[i];

                    if(!notifMap[categoryId]){
                        notifMap[categoryId] = {};
                    }
                    notifMap[categoryId][value["NotifId"]] = value;
                    /*
                    if (notifMap[categoryId]) {
                        notifMap[categoryId].push(value);

                    } else {
                        notifMap[categoryId] = [value];
                    }
                    */

                }
            }

        })
        //console.log(notifMap);

    })


    $.each($.parseJSON(data), function (index, value) {

        var id = value["Id"];
        if(!categoryMap[id]){
            categoryMap[id] = [value];
        } else {
            categoryMap[id].push(value);
        }

    })

    console.log("categoryMap");
    console.log(categoryMap);
    console.log($.parseJSON(data));

    $.each($.parseJSON(data), function (x, node) {

        //console.log("adding to tree");
        console.log(node);
        //if(node["Id"]<8) {
        var index  = node["Id"];
        console.log(index);
        console.log(nodeKeys);
        console.log(nodeKeys[index]);

            if (!node["SuperCategoryId"] && !nodeKeys[index]) {
                node["SubCategories"] = {};
                //console.log("this got through");

                addBaseNode(node);
                console.log("wtf");
                //
            } else {
                addIntoTree(node);
            }

        //}
    })

    $.each(tree["SubCategories"], function(index, node){
        createCheckbox("", node);
    })

    setCategoryListSortable("root");



    $submit = $("<br><input type='submit' value='Submit'><br>")
    $("#catForm").append($submit);

        //console.log(categoryMap)
})



chrome.storage.sync.get("imageUrl", function (obj) {
    console.log(obj);
    var urlEle = document.getElementById("imageUrl")
    urlEle.value = obj.imageUrl;

    chrome.storage.sync.get("pageUrl", function (obj2) {
        console.log(obj2);
        var pageEle = document.getElementById("pageUrl");
        pageEle.value = obj2.pageUrl;


        $.ajax({
            type: "POST",
            url: "http://localhost/db1/createNotif.php",
            data: {ImageUrl: obj.imageUrl,
                PageUrl : obj2.pageUrl},


            success: function (insertId) {
                notifId = insertId;
                console.log("notifId-----------------------------");
                console.log(notifId);

                notifContentMap[insertId] = {ImageUrl : obj.imageUrl,
                                             PageUrl : obj2.pageUrl,
                                             NotifId : insertId};

                $notifsList = "<ul class='notifs"+"' id='ul_base_notif' class='notifList'></ul>"

                $("#fixed-div").append($notifsList)


                $notifSpan = "<li style='height : 100%' id='li_base_notif' notifId='"+insertId+"'><img src='"+obj.imageUrl+"' id='base_image' alt='alternative text' style='width: 100px; height: 90px'></li>"
                $("#ul_base_notif").append($notifSpan);

                $("#ul_base_notif").sortable({
                    connectWith: ".notifs",
                    placeholder: "ui-state-highlight",
                    dropOnEmpty: true,
                    forcePlaceholderSize: true,
                    tolerance: "pointer",
                    remove: function (event, currentNotif) {

                        currentNotif.item.clone().appendTo("#ul_base_notif");
                    }
                });

                $trashList = "<ul class='notifs"+"' id='ul_trash' class='notifList' ><li>aaaaaa</li></ul>"
                $("#ul_base_notif").after($trashList)



                $("#ul_trash").sortable({
                    connectWith: ".notifs",
                    placeholder: "ui-state-highlight",
                    dropOnEmpty: true,
                    forcePlaceholderSize: true,
                    tolerance: "pointer",
                    receive: function (event, currentNotif) {

                        currentNotif.item.remove();
                    }
                });

                var count = 0;

                $categoryList = "<ul class='ul_categoryBase"+"' id='ul_categoryBase' ><li>aaaaaa</li></ul>"
                $("#ul_base_notif").after($categoryList)


                $("#ul_categoryBase").sortable({
                    connectWith: ".categories",
                    placeholder: "ui-category-placeholder",
                    dropOnEmpty: true,
                    forcePlaceholderSize: true,
                    tolerance: "pointer",
                    receive: function (event, currentNotif) {

                        currentNotif.item.remove();
                    }
                });

                $customCat =  $("<li><input type='textarea'  id=textArea_custom"+">");
                $("#ul_categoryBase").append($customCat)

                $createButton = $("<input type='button' value='go' id='createButton_custom"+"'>");
                $("#textArea_custom").after($createButton)

                $customTextBr = "<br id='br_custom"+"'></li>";
                $("#createButton_custom").after($customTextBr);

                
                $("#createButton_custom").click(function() {
                    createCategory_Main(count)
                    count++;
                })

            }
        })


        /*
        $connectCheckbox = $("<input type='checkbox' value='go' id='connChk_"+index+"z"+notifIndex+"' style='margin-left :10px'>");
        $("#li_base_notif").after($connectCheckbox);

        $connectBr = "<br id='br_"+index+"z"+notifIndex+"'></li>";
        $("#connChk_"+index+"z"+notifIndex).after($connectBr);
        */
    });




});

var player;
var videoId = 0;
chrome.storage.sync.get("pageUrl", function (obj) {
    console.log(obj);
    videoId = obj.pageUrl.split("/").slice(-1)[0].split("?")[0];
    console.log("ASYNC YO")
    var playerEle = document.getElementById("embedPlayer");
    playerEle.src = "http://www.youtube.com/embed/"+obj.pageUrl.split("/").slice(-1)[0].split("?")[0];


});

function onYouTubeIframeAPIReady() {
    console.log("ITS READY YIO")





    console.log("THE ID IS");
    console.log(videoId);

    player = new YT.Player('fixed-div', {
        width: 600,
        height: 400,
        videoId: videoId,
        playerVars: {
            color: 'white',

        },
        //events: {
        //  onReady: initialize
        //}
    });
}



console.log("Tree");
console.log(tree);

function addIntoTree(node){

    var superId = node["SuperCategoryId"];
    var index = node["Id"];
    node["SubCategories"] = {}

    if(superId){
        var parentKeys = nodeKeys[superId];

            if(!parentKeys){
                //console.log(node);
                var parents = categoryMap[superId];
                //console.log("the node")
                //console.log(node);

                for(var i=0;i<parents.length;i++){
                    var parent = parents[i];
                    //console.log(parent);
                    var parentKeys = addIntoTree(parent);

                    for(var k=0;k<Object.keys(parentKeys).length;k++){
                        parent["SubCategories"][index] = node;
                        if(!nodeKeys[index]){
                            nodeKeys[index] = {};
                            //nodeKeys[index][index] = "";
                        }
                        //console.log("pushing");
                        //console.log(nodeKeys[index])
                        //console.log(parentKeys[k] + ";" + index);
                        //console.log(nodeKeys[index][Object.keys(parentKeys)[k]]);
                        if(parentKeys[Object.keys(parentKeys)[k]]!="") {
                            nodeKeys[index][Object.keys(parentKeys)[k] + ";" + parentKeys[Object.keys(parentKeys)[k]]] = index;
                        } else {
                            nodeKeys[index][Object.keys(parentKeys)[k]] = index;
                        }
                        //console.log(nodeKeys[index]);
                    }

                }


                //console.log(parent);
                //console.log(parentKey);



                return nodeKeys[index];

            } else {
                console.log(parentKeys);
                //console.log(nodeKeys)
                console.log(index);
                var parentArray = getNodeArray(parentKeys);
                console.log(parentArray);
                for(var i=0; i<parentArray.length;i++){
                    var parent = parentArray[i];
                    console.log(parent);
                    var parentKey = nodeKeys[parent["Id"]];
                    //console.log(index);
                    console.log(parentKey);
                    //console.log(parentIndex + ";" + index);
                    /*
                    if(index == 124){
                        console.log("CATCHE");
                        console.log(nodeKeys[index]);
                        console.log(parentKey);
                        parent["SubCategories"][index] = node;
                    }
                    */
                    for(var z=0;z<Object.keys(parentKey).length;z++) {


                        if (!nodeKeys[index] || (typeof(nodeKeys[index][Object.keys(parentKey)[z]])) == "undefined") {
                            console.log("GOT IN");

                            try {
                                if (typeof(nodeKeys[index][Object.keys(parentKey)[z]]) == "undefined") {

                                    console.log("LOOK");
                                    console.log(nodeKeys[index])
                                }
                            } catch (e) {

                            }


                            parent["SubCategories"][index] = node;
                            if (!nodeKeys[index]) {
                                nodeKeys[index] = {};

                            }
                            //console.log("parentKey");
                            //console.log(nodeKeys[index][i]);
                            //console.log(parentKey);
                            var leftSide = Object.keys(parentKey)[z];/////////////////////////////////////////////////// ALERT ALERT
                            if (parentKey[leftSide] != "") {
                                nodeKeys[index][leftSide + ";" + parentKey[leftSide]] = index;
                            } else {
                                nodeKeys[index][leftSide] = index;
                            }

                        }
                    }

                }
                return nodeKeys[index];
            }



        //console.log(node);
        //console.log(parent);

    } else {

        if(!nodeKeys[index]){
            //console.log(index);
            //console.log("writing node");
            //console.log(node);
            //console.log("--")
            addBaseNode(node);
            if(!nodeKeys[index][index]){
                nodeKeys[index][index] = {}
            }
            nodeKeys[index][index] = "";
        }

        return nodeKeys[index];

    }







}

function addBaseNode(node){
    var index = node["Id"];
    console.log("add base")
    //console.log(node);
    console.log(index);
    tree["SubCategories"][index] = node;
    if(!nodeKeys[index]){
        nodeKeys[index] = {}
        nodeKeys[index][index] = "";
    }
    /*
    else {
        //console.log(nodeKeys[index]);
        nodeKeys[index].push(index);
    }
    */
}

function getNode(key, value){

    var path = key.split(";");
    var currentNode = tree;
    //console.log(path);
    for (var i=0; i < Object.keys(path).length; i++) {

        if(path[i]!=""){
            //console.log(currentNode);
            //console.log(path[i])
            currentNode = currentNode["SubCategories"][path[i]];
            //console.log(currentNode);
        }

    }
    if(value != ""){
        //console.log(value);
        currentNode = currentNode["SubCategories"][value];
    }
    console.log(currentNode);
    return currentNode;
}

function getNodeArray(parentKeys){
    var nodeArray = []
    //console.log(parentKeys);
    for(var i=0; i<Object.keys(parentKeys).length;i++){
        //console.log(Object.keys(parentKeys)[i]);
        var leftSide = Object.keys(parentKeys)[i];
        nodeArray.push(getNode(leftSide, parentKeys[leftSide]));
    }
    return nodeArray;
}



function createCheckbox(superIndex, value){
    var index = superIndex + "x" + value["Id"]
    console.log("INDEX");
    console.log(index);
    $newdiv1 = "<li value='"+value["Id"]+"' id='li_"+index+"'><ul class='categories' id='ul_"+index+"'></ul>"
    $checkbox = "<input type='checkbox' name='dynfields["+value["CategoryName"]+"]' id='chk_"+index+"' value='"+value["CategoryName"]+"'>";

    $span = "<span id='span_"+index+"'>"+value["CategoryName"]+"</span>";
    $br = "<br id='br_"+index+"'></li>";



    if(!$("#ul_"+superIndex).length) {
        console.log("isnt supre")
        $("#ul_root").append($newdiv1);
        $("#li_"+index).prepend($checkbox);
    } else {
        console.log("issupper")
        $("#ul_"+superIndex).append($newdiv1);
        $("#li_"+index).prepend($checkbox);
    }


    setCategoryListSortable(index);


    $("#chk_"+index).after($span);
    $("#span_"+index).after($br);



    $("#chk_"+index).change(function () {



        if(this.checked){


            $.each(value["SubCategories"], function(zz, node){
                createCheckbox(index, node);
            })


            var superCategoryIds = index.split("x");
            console.log("SUPER CATEGORIES");
            console.log(superCategoryIds);


            if(notifMap[superCategoryIds[1]]){
                var superCategoryNotifs = Object.keys(notifMap[superCategoryIds[1]]);
            } else {
                superCategoryNotifs = []
            }


            $.each(superCategoryIds, function(xx, categoryId){

                if(categoryId !=""){
                    if(superCategoryNotifs && notifMap[categoryId]){
                        console.log(value)
                        console.log(superCategoryNotifs)
                        console.log(Object.keys(notifMap[categoryId]));
                        superCategoryNotifs = intersectObjectKeys(superCategoryNotifs, Object.keys(notifMap[categoryId]));
                        console.log(superCategoryNotifs)
                    } else {
                        superCategoryNotifs = [];
                    }

                }
            })

            var finalNotifList = [];

            for(var i=0;i<superCategoryNotifs.length;i++){
                console.log(superCategoryNotifs[i])
                console.log(notifContentMap[superCategoryNotifs[i]])
                finalNotifList.push(notifContentMap[superCategoryNotifs[i]]);
            }


            $notifsList = "<ul class='notifs"+"' id='ul_"+index+"_notifs"+"' class='notifList'></ul>";
            $("#li_"+index).append($notifsList);
            //$("#ul_"+index+"_notifs").append("<li>aaaaa</li>");

            var categoryIds = index.split("x");
            categoryIds.splice(0, 1);

            setNotifListSortable(index, categoryIds);

            console.log(finalNotifList)

            removedItems[index] = []

            $.each(finalNotifList, function(notifIndex, notif){

                removedItems[index].push($("#ul_"+superIndex+"_notifs").children("[notifId='" + notif["NotifId"] + "']"));

                $("#ul_"+superIndex+"_notifs").children("[notifId='" + notif["NotifId"] + "']").remove();

                $notifSpan = "<li style='height : 100%' id='li_"+index+"z"+notifIndex+"' notifId='"+notif["NotifId"]+"' ><img src="+notif["ImageUrl"]+" id='span_"+index+"z"+notifIndex+"' alt='alternative text' style='width: 100px; height: 90px'>"
                $("#ul_"+index+"_notifs").append($notifSpan);

                $connectCheckbox = $("<input type='checkbox' value='go' id='connChk_"+index+"z"+notifIndex+"' style='margin-left :10px'>");
                $("#span_"+index+"z"+notifIndex).after($connectCheckbox);

                $connectBr = "<br id='br_"+index+"z"+notifIndex+"'></li>";
                $("#connChk_"+index+"z"+notifIndex).after($connectBr);




                $("#connChk_"+index+"z"+notifIndex).change(function(){
                    if(this.checked){


                        $catDiv = "<div class='res_"+index+"z"+notifIndex+"_categories"+"' id='div_"+index+"z"+notifIndex+"_categories"+"'></div>"
                        $("#connChk_"+index+"z"+notifIndex).after($catDiv);

                        $customCat =  $("<input type='textarea'  id=textArea_"+index+"z"+notifIndex+"c"+"-custom"+">");
                        $("#div_"+index+"z"+notifIndex+"_categories").append($customCat)

                        $createButton = $("<input type='button' value='go' id='createButton_"+index+"z"+notifIndex+"c"+"-custom"+"'>");
                        $("#textArea_"+index+"z"+notifIndex+"c"+"-custom").after($createButton)

                        $customTextBr = "<br id='br_"+index+"z"+notifIndex+"c"+"-custom"+"'>";
                        $("#createButton_"+index+"z"+notifIndex+"c"+"-custom").after($customTextBr);

                        var customCatCount = 0;
                        $("#createButton_"+index+"z"+notifIndex+"c"+"-custom").click(function() {
                            createCategory_Tree(index, notifIndex, customCatCount, notif);
                        })

                        $.ajax({
                            type: "POST",
                            url: "http://localhost/db1/getCategories.php",
                            data: {categoryIds: notif["CategoryIds"]}, // serializes the form's elements.
                            dataType: "json",

                            success: function (categories) {
                                console.log(categories)



                                $.each(categories, function(catIndex, category){
                                    console.log(category);
                                    $catSpan = "<span id='span_"+index+"z"+notifIndex+"c"+catIndex+"'>"+category["CategoryName"]+"</span>";

                                    $("#div_"+index+"z"+notifIndex+"_categories").append($catSpan)

                                    $connCatCheckbox = $("<input type='checkbox' value='go' id='connCatChk_"+index+"z"+notifIndex+"c"+catIndex+"' style='margin-left :10px'>");

                                    $("#span_"+index+"z"+notifIndex+"c"+catIndex).after($connCatCheckbox);

                                    $catBr = "<br id='br_"+index+"z"+notifIndex+"c"+catIndex+"'>";
                                    $("#connCatChk_"+index+"z"+notifIndex+"c"+catIndex).after($catBr);

                                    $("#connCatChk_"+index+"z"+notifIndex+"c"+catIndex).change(function(){
                                        setCategoryCheckbox(this, category["CategoryId"])
                                    });

                                });

                            }
                        })
                    } else {
                        $("#div_"+index+"z"+notifIndex+"_categories").remove()
                    }

                });

            })
        } else {
            $("#li_"+index).children().each(function(i, elem){
                if($(elem).hasClass("notifs")){
                    $(elem).remove()

                } else if ($(elem).hasClass("categories")) {
                    $(elem).children().each(function(i, child){
                        child.remove();
                    })
                }
                    /*
                    for(var i=0;i<elem.childNodes.length;i++){
                        console.log(elem.childNodes[i])
                        var child = elem.childNodes[i];
                        child.remove();
                    }

                }
                */

            })
            console.log(removedItems[index]);
            console.log(superIndex);
            console.log(index);
            $.each(removedItems[index], function(index, item){

                $("#ul_"+superIndex+"_notifs").append(item);
            });
        }





    })
}

/*
$(document).on("DOMNodeInserted", ".categories", function(event){

    $(this).sortable({
        connectWith: ".categories",
        placeholder: "ui-state-highlight",
        dropOnEmpty: true,
        forcePlaceholderSize: true,
        tolerance: "pointer",
        remove: function (event, currentNotif) {

            currentNotif.item.clone().appendTo("#ul_base_notif");
        }

    })
});

/*
$(document).on("DOMNodeInserted", ".notifs", function(event){
    console.log("aaaaaqqa")
    console.log($(this))


});
*/

function setNotifListSortable(index, categoryIds){
    $("#ul_"+index+"_notifs").sortable({
        connectWith: ".notifs",
        placeholder : "ui-state-highlight",
        dropOnEmpty : true,
        forcePlaceholderSize : true,
        tolerance:"pointer",
        receive: function (aaa, currentNotif) {
            setTimeout(function(){

                console.log("THE CATEGORIES ARE");
                console.log(categoryIds);
                console.log(notifContentMap);

                var notifId = currentNotif["item"][0]["attributes"]["notifId"]["value"];

                for(var i=0;i<categoryIds.length;i++){



                    //notifMap[categoryIds[i]].push(notifContentMap[notifId]);
                    if(!notifMap[categoryIds[i]]){
                        notifMap[categoryIds[i]] = {};
                    }
                    console.log("ADDING TO NOTIFMAP")
                    console.log(currentNotif);
                    console.log(notifContentMap[notifId])
                    console.log(notifId)
                    notifMap[categoryIds[i]][notifId] = notifContentMap[notifId];
                }


                var currentNotifId = currentNotif["item"][0]["attributes"]["notifId"]["value"];

                $.ajax({
                    type: "POST",
                    url: "http://localhost/db1/linkNotif.php",
                    data: {notifId : currentNotifId,
                        categoryIds : categoryIds},
                    //dataType: "json",

                    success: function (data) {
                        console.log("ajax done")
                        console.log(data)
                    }
                });
            }, 200);

        },

        remove: function (event, currentNotif) {
            console.log("EVENT");
            console.log(event);

            for(var i=0;i<categoryIds.length;i++){

                var notifId = currentNotif["item"][0]["attributes"]["notifId"]["value"];

                //notifMap[categoryIds[i]].push(notifContentMap[notifId]);
                delete notifMap[categoryIds[i]][notifId];
            }

            var currentNotifId = currentNotif["item"][0]["attributes"]["notifId"]["value"];

            if(event.shiftKey){
                currentNotif.item.clone().appendTo("#ul_"+index+"_notifs");
            } else {
                $.ajax({
                    type: "POST",
                    url: "http://localhost/db1/unlinkNotif.php",
                    data: {notifId : currentNotifId,
                        categoryIds : categoryIds},
                    //dataType: "json",

                    success: function (data) {
                        console.log("ajax done")
                        console.log(data)
                    }
                });


            }



        }
    }).disableSelection();
}


function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}


function setCategoryListSortable(index){
    $("#ul_"+index).sortable({
        connectWith: ".categories",
        placeholder: "ui-category-placeholder",
        dropOnEmpty: true,
        forcePlaceholderSize: true,
        tolerance: "pointer",
        remove: function (event, currentCategory){

            var theId = currentCategory["item"][0]["value"]
            var superCategoryIdArray = index.split("x")
            var superCategoryId = superCategoryIdArray[superCategoryIdArray.length-1];

            if(event.shiftKey){
                currentCategory.item.clone().appendTo("#ul_"+index);
            } else {
                $.ajax({
                    type: "POST",
                    url: "http://localhost/db1/unlinkTreeCategory.php",
                    data: {categoryId : theId,
                        superCategoryId : superCategoryId},

                    //dataType: "json",

                    success: function (data) {
                        console.log("ajax done")
                        console.log(data)
                    }
                });
            }

        },
        receive: function(event, currentCategory){


            var theId = currentCategory["item"][0]["value"]
            var superCategoryIdArray = index.split("x")
            var superCategoryId = superCategoryIdArray[superCategoryIdArray.length-1];
            console.log(superCategoryIdArray)
            console.log(superCategoryId)
            console.log(theId)
            console.log(currentCategory)
            currentCategory["item"][0]["id"] = "li"+index+"x"+theId;

            for(var i=0; i<currentCategory["item"][0]["childNodes"].length;i++){
                var item = currentCategory["item"][0]["childNodes"][i];
                var prefix = ""
                if(item["tagName"] == "INPUT"){
                    prefix = "chk_";
                } else if (item["tagName"] == "SPAN"){
                    prefix = "span_";
                } else if(item["tagName"] == "BR"){
                    prefix = "br_";
                }
                item["id"] = prefix + index + "x" + theId;
            }

            $newList = "<ul class='categories' id='ul_"+index+"x"+theId+"'></ul>";
            $("#li"+index+"x"+theId).append($newList)
            setCategoryListSortable(index+"x"+theId)
            $newNotifList = "<ul class='notifs' id='ul_"+index+"x"+theId+"_notifs"+"'></ul>";
            $("#li"+index+"x"+theId).append($newNotifList);

            var categoryIds = index.split("x");
            categoryIds.splice(0, 1);
            categoryIds.push(theId);
            setNotifListSortable(index+"x"+theId, categoryIds);



            $.ajax({
                type: "POST",
                url: "http://localhost/db1/linkTreeCategory.php",
                data: {categoryId : theId,
                    superCategoryId : superCategoryId},

                //dataType: "json",

                success: function (data) {
                    console.log("ajax done")
                    console.log(data)
                }
            });


        }


    })
}


function createCategory_Tree(index, notifIndex, count, notif){

    var name = $("#textArea_"+index+"z"+notifIndex+"c"+"-custom").val();

    $.ajax({
        type: "POST",
        url: "http://localhost/db1/categoryCreateScript.php",
        data: {name: name}, // serializes the form's elements.
        //dataType: "json",

        success: function (categoryId) {

            createCategoryButton_Tree(index, notifIndex, name, count, categoryId, notif);

            count++;
        }
    });




}

function createCategory_Main(count){

    var name = $("#textArea_custom").val();
    console.log(name);
    console.log("count");
    console.log(count);
    $.ajax({
        type: "POST",
        url: "http://localhost/db1/categoryCreateScript.php",
        data: {name: name}, // serializes the form's elements.
            //dataType: "json",

        success: function (categoryId) {

            createCategoryButton_Main(name, count, categoryId);


        }
    });





}

function createCategoryButton_Main(name, count, categoryId){
    console.log(categoryId)
    console.log("SUCCESSSSSSS")
    /*
    var lastCount = "";
    if(count > 0){
        lastCount = "-"+(count-1);
    }
    console.log("#br_custom"+lastCount)

    */

    $connCatCheckbox = $("<li value='"+categoryId+"'><input type='checkbox' value='go' id='connCatChk_custom-"+count+"' style='margin-left :10px'>");
    $("#ul_categoryBase").append($connCatCheckbox);

    $catSpan = "<span id='span_custom-"+count+"'>"+name+"</span>";
    $("#connCatChk_custom-"+count).after($catSpan);



    $customCatBr = "<br id='br_custom-"+count+"'></li>";
    $("#span_custom-"+count).after($customCatBr);

    $("#textArea_custom").val("");





    /*
    $("#connCatChk_"+index+"z"+notifIndex+"c"+"-custom-"+count).change(function(){
        console.log(notif);
        setCategoryCheckbox(this, categoryId, notif["NotifId"])

    });
    */
}

console.log($("#connCatChk_"+index+"z"+notifIndex+"c"+"-custom-"+count))


function createCategoryButton_Tree(index, notifIndex, name, count, categoryId, notif){
    console.log(categoryId)
    console.log("SUCCESSSSSSS")

    $catSpan = "<span id='span_"+index+"z"+notifIndex+"c"+"-custom-"+count+"'>"+name+"</span>";
    $("#br_"+index+"z"+notifIndex+"c"+"-custom").after($catSpan);

    $connCatCheckbox = $("<input type='checkbox' value='go' id='connCatChk_"+index+"z"+notifIndex+"c"+"-custom-"+count+"' style='margin-left :10px'>");
    $("#span_"+index+"z"+notifIndex+"c"+"-custom-"+count).after($connCatCheckbox);

    $customCatBr = "<br id='br_"+index+"z"+notifIndex+"c"+"-custom-"+count+"'>";
    $("#connCatChk_"+index+"z"+notifIndex+"c"+"-custom-"+count).after($customCatBr);

    $("#textArea_"+index+"z"+notifIndex+"c"+"-custom").val("");




    $("#connCatChk_"+index+"z"+notifIndex+"c"+"-custom-"+count).change(function(){
        console.log(notif);
        setCategoryCheckbox(this, categoryId, notif["NotifId"])

    });


    console.log($("#connCatChk_"+index+"z"+notifIndex+"c"+"-custom-"+count))
}

function intersect(a, b) {
    var t;
    if(!a || !b){
        return [];
    }

    if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
        return a.filter(function (e) {
            if (b.indexOf(e) !== -1) return true;
        })
        .filter(function (e, i, c) { // extra step to remove duplicates
            return c.indexOf(e) === i;
    });
}

function intersectObjectKeys(keys1, keys2) {
    return keys1.concat(keys2).sort().reduce(function (r, a, i, aa) {
        if (i && aa[i - 1] === a) {
            r.push(a);
        }
        return r;
    }, []);
}

function setCategoryCheckbox(checkbox, categoryId, additionalNotifid) {
    console.log("IT WORKS")

    if (checkbox.checked) {
        console.log("checked")
        $.ajax({
            type: "POST",
            url: "http://localhost/db1/linkCategory.php",
            data: {
                categoryId: categoryId,
                notifId: notifId,
                additionalNotifId : additionalNotifid
            }, // serializes the form's elements.
            //dataType: "json",

            success: function (data) {
                console.log(data);
            }
        })
    } else {
        console.log("unchecked")
        $.ajax({
            type: "POST",
            url: "http://localhost/db1/unlinkCategory.php",
            data: {
                categoryId: categoryId,
                notifId: notifId
            }, // serializes the form's elements.
            //dataType: "json",

            success: function (data) {

            }
        })
    }

}
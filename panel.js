document.body.style.background = "green"
var globalIndex = 0;
$.get("http://localhost/db1/backup2.php", function (data) {
    //$newdiv1 = $("<div class='results'></div>")
    //$newdiv2 = $("<input type='checkbox' name='category'><br>");
    $submit = $("<br><input type='submit' value='Submit'><br>")
    console.log($.parseJSON(data));
    var topIndex = 0;
    
    
    
    $.each($.parseJSON(data), function (index, value) {
        $newdiv1 = "<div class='res_"+index+"' id='div_"+index+"'></div>"
        $newdiv2 = "<input type='checkbox' name='dynfields["+value[0]+"]' id='chk_"+index+"' value='"+value[0]+"'>";
        $span = "<span id='span_"+index+"'>"+value[0]+"," + value[1]+"</span>";
        $br = "<br id='br_"+index+"'>";
        $("#catForm").append($newdiv1);
        $("#div_"+index).append($newdiv2);
        $("#chk_"+index).after($span);
        $("#span_"+index).after($br);
        topIndex++;


    })//)

    $textInput = $("<input type='text' name='newCategory' id='txt_base'>");
    $submitButton = $("<input type='button' value='go' id='btn_base'>");

    $("#catForm").append("<br>");
    $("#catForm").append("<br id='br_last'>");
    $("#catForm").append($textInput);
    $("#catForm").append($submitButton);

    document.getElementById("btn_base").onclick = function() {
        var categoryName = $("#txt_base").val();
        //$.get("http://localhost/db1/addSubCategory.php", function (categoryName) {
        $.ajax({
            type: "POST",
            url: "http://localhost/db1/categoryCreateScript.php",
            data: {name: categoryName}
        })
        $newdiv1 = "<div class='res_"+topIndex+"' id='div_"+topIndex+"'></div>"
        $newdiv2 = "<input type='checkbox' name='dynfields["+categoryName+"]' checked='true' id='chk_"+topIndex+"' value='"+categoryName+"'>";
        $span = "<span id='span_"+topIndex+"'>"+categoryName+"</span>";
        $br = "<br id='br_"+topIndex+"'>";
        $("#br_last").before($newdiv1);
        $("#div_"+topIndex).append($newdiv2);
        $("#chk_"+topIndex).after($span);
        $("#span_"+topIndex).after($br);


        topIndex++;
    }



    $("#catForm").append("<br>");
    $("#catForm").append($submit);
});

var assocIndexes = {};

$(document).ready(function() { // start here, if DOM is loaded

    // request data from php script ...
    // we expect the userCheck.php script to actually 'return' something,
    // some data ...
    console.log("init");
    $('#chk_0').change(function () {
        console.log("zdar")
    })
    console.log($('#chk_0'));
    var checkboxes = $('input:checkbox');
    $('input:checkbox').change(function () {

        onChange($(this)[0], []);
    })

    //$('input:checkbox').each(function () {
        //console.log($(this));
      //  $(this).change(onChange2($(this)[0]));
        //$(this).change(function () {
          //  console.log("ffff");
     //   });
   // })
    //$('input:checkbox').change(onChange());

});

var player;
var videoId = 0;
chrome.storage.sync.get("pageUrl", function (obj) {
    console.log(obj);
    videoId = obj.pageUrl.split("/").slice(-1)[0].split("?")[0];
    console.log("ASYNC YO")
    //var playerEle = document.getElementById("embedPlayer");
    //playerEle.src = "http://www.youtube.com/embed/"+obj.pageUrl.split("/").slice(-1)[0].split("?")[0];


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

var divCounts = {

};

var chkCounts = {

};

var skippedIndex = {

}

var skipped = [];


function onChange(thisChk, checkedSoFar, parentIndex) {

    //console.log("IM HERE");

    if(!(parentIndex)){
        var index = thisChk.id.split("_")[1];
        var chkCount = index;

    } else {
        //var index = parentIndex + "-" + divCounts[parentIndex];
        var index = parentIndex;
        var chkCount = thisChk.id.split("z")[1];
    }
    var divId = "#div_"+index;

    var catName = thisChk.name.split("[")[1].split("]")[0];

    var checkedPrivate = checkedSoFar.slice(0);

    console.log(index);


    console.log("CHKCOUNT");
    console.log(chkCount);
    if(thisChk.checked) {


        $timeButton = $("<input type='button' value='go' id='timeBtn_"+thisChk.id.split("_")[1]+"' style='margin-left :10px'>");
        $("#span_" +thisChk.id.split("_")[1]).after($timeButton);


        document.getElementById("timeBtn_"+thisChk.id.split("_")[1]).onclick = function() {
            var playerEle = $("#embedPlayer");
            var videoTime = Math.floor(player.getCurrentTime());
            var parsedTime = "";
            if(Math.floor(videoTime/3600) > 0){
                parsedTime += Math.floor(videoTime/3600) + ":";
            }
            parsedTime += Math.floor((videoTime%3600)/60) + ":" + Math.floor(((videoTime%3600)%60));
            $timeArea = $("<input type='textarea' name='timefields["+catName+"]' value='"+parsedTime+"'  id='time_"+thisChk.id.split("_")[1]+"' style='margin-left :10px'>");
            $(this).after($timeArea);
        }


        //$("#time_"+thisChk.id.split("_")[1]).val(parsedTime);

        //console.log($(".ytp-progress-bar"));
        //console.log($(".ytp-progress-bar").attr("aria-valuenow"));

        //console.log(skippedIndex);
        //console.log(skippedIndex[index]);

        //assocIndexes[index] = [];
        //console.log("CHECKED")

        $("[value='"+thisChk.value+"']").each(function() {
            //console.log("LOOK");
            //console.log($(this)[0].id);
            //console.log(thisChk.id);
          if($(this)[0].id!=thisChk.id){

              removeCheckbox($(this));
          }
        })

        for(var i=0;i<chkCount;i++){
            var dynfieldsName;
            if(!(parentIndex)){
                dynfieldsName = $("#"+thisChk.id.split("_")[0]+"_"+i).attr("name")

                //console.log("SKIPPED");
                //console.log(thisChk.id.split("_")[0]+"_"+i);
                //console.log(skipped);

            } else {

                dynfieldsName = $("#"+thisChk.id.split("z")[0]+"z"+i).attr("name");


                //console.log("SKIPPED");
                //console.log(thisChk.id.split("z")[0]+"z"+i);
                //console.log(skipped);
            }


            var trimmedName = dynfieldsName.split("[")[1].split("]")[0];

            $("[value='"+trimmedName+"']").each(function(){

                if($(this)[0].parentNode != thisChk.parentNode && parentIndex){
                    removeCheckbox($(this));

                }

            })



            skipped.push(trimmedName);
        }


        checkedPrivate.push(catName);
        console.log("CHECKEDSOFAR")
        console.log(checkedPrivate)
        $.ajax({
            type: "POST",
            url: "http://localhost/db1/expandCheckbox2.php",
            data: {checkedSoFar : checkedPrivate}, // serializes the form's elements.
            dataType: "json",

            success: function (dataz) {

                var divCount = 0;
                if(parentIndex) {
                    if(divCounts.hasOwnProperty(parentIndex)) {
                        divCount = divCounts[parentIndex];


                        //console.log(divCounts);
                        //console.log("THE PARENT " + parentIndex);
                        divCount = divCounts[parentIndex];
                        //
                        //console.log("THE DIVCOUNT " + divCount);
                        //console.log(Object.keys(divCounts).length);
                        //console.log(Object.keys(divCounts).length);

                        /*
                         for(var propName in divCounts) {

                         console.log(divCounts);
                         console.log(propName);
                         }
                         */
                        divCounts[parentIndex]++;
                    }else {
                        divCounts[index] = 1;
                    }
                } else {
                    divCounts[index] = 1;
                }

                skippedIndex[index] = chkCount;


                console.log("APPENDING TO " + "#div_"+index)

                $resDiv = "<div class='res_"+index+"x"+divCount+"' id='div_"+index+"x"+divCount+"'></div>"
                $("#"+"br_"+thisChk.id.split("_")[1]).after($resDiv);
                //$("#div_"+index).append($resDiv);

                var sorted = sortProperties(dataz);

                //console.log("SORTED");
                //console.log(sorted);


                /*
                if(!parentIndex){
                    index = index + "x0";
                }
                */

                //console.log("APPEND DIV " + "#div_"+index);

                //console.log("CHECK COUNTS");
                //console.log(chkCounts);


                var chkId = 0;
                $.each(sorted, function(indexNNN, value){

                    var categoryName = value[0];
                    var count = value[1];

                        //globalIndex ++;
                    //console.log(globalIndex);
                    //assocIndexes[index].push(globalIndex);
                    //console.log(assocIndexes);
                    //console.log(categoryName);
                    if(skipped.indexOf(categoryName) == -1 && checkedPrivate.indexOf(categoryName) == -1){

                        $newCheckbox = "<input type='checkbox' name='dynfields[" + categoryName + "]' id='chk_" + index + "x" + divCount + "z" + chkId + "' value='"+categoryName+"'>";
                        $span = "<span id='span_" + index + "x" + divCount + "z" + chkId + "'>" + value + "</span>";
                        $br = "<br id='br_" + index + "x" + divCount + "z" + chkId + "'>";
                        $("#div_" + index + "x" + divCount).append($newCheckbox);
                        $("#chk_" + index + "x" + divCount + "z" + chkId).after($span);
                        $("#span_" + index + "x" + divCount + "z" + chkId).after($br);
                        //console.log("adding checked so far");
                        //console.log(checkedPrivate);
                        $("#chk_" + index + "x" + divCount + "z" + chkId).change(function () {
                            onChange($(this)[0], checkedPrivate, index + "x" + divCount)
                        });


                        chkId++;
                    }


                })
                //////------------------------------------------------------------TAG
                chkCounts[index] = chkId;



                chkId--;
                //console.log("adding button to ");
                //console.log("#br_"+index+"x"+divCount+"z"+chkId);
                $textInput = $("<input type='text' name='newCategory' id='txt_"+index+"x"+divCount+"'>");
                $submitButton = $("<input type='button' value='go' id='btn_"+index+"x"+divCount+"'>");

                $("#br_"+index+"x"+divCount+"z"+chkId).after($textInput);
                $("#txt_"+index+"x"+divCount).after($submitButton);
                $("#btn_"+index+"x"+divCount).after("<br id='lastBr'>");

                $doneButton = $("<input type='button' value='DONE' id='doneBtn_"+index+"x"+divCount+"'>");
                $("#txt_"+index+"x"+divCount).before($doneButton);
                $("#doneBtn_"+index+"x"+divCount).after("<br>");

                document.getElementById("doneBtn_"+index+"x"+divCount).onclick = function() {

                    var currentSkipped = skippedIndex[index+"x"+divCount];
                    if(!(currentSkipped)){
                        currentSkipped = 0;
                    }

                    for(var i=currentSkipped;i<chkCounts[index];i++){

                        var value = $("#chk_"+index+"x"+divCount+"z"+i).attr("value");
                        console.log(value);
                        console.log($("[value='"+value+"']"));
                        $("[value='"+value+"']").each(function(){
                            console.log($(this)[0].parentNode);
                            console.log($("#doneBtn_"+index+"x"+divCount));
                            console.log($("#doneBtn_"+index+"x"+divCount).parentNode);
                            if($(this)[0].parentNode != $("#doneBtn_"+index+"x"+divCount)[0].parentNode){
                                removeCheckbox($(this));

                            }

                        })
                    }
                }
                chkId++;

                document.getElementById("btn_"+index+"x"+divCount).onclick = function() {
                    var categoryName = $("#txt_" + index + "x" + divCount).val();
                    //$.get("http://localhost/db1/addSubCategory.php", function (categoryName) {
                    $.ajax({
                        type: "POST",
                        url: "http://localhost/db1/categoryCreateScript.php",
                        data: {name: categoryName}
                    })// serializes the form's elements.
                    $newCheckbox = "<input type='checkbox' checked='true' name='dynfields[" + categoryName + "]' id='chk_"+index+"x"+divCount+"z"+chkId+"' value='"+categoryName+"'>";
                    $span = "<span id='span_"+index+"x"+divCount+"z"+chkId+"'>"+categoryName+"</span>";
                    $br = "<br id='br_"+index+"x"+divCount+"z"+chkId+"'>";

                    $("#br_"+index+"x"+divCount+"z"+(chkId-1)).after($newCheckbox);
                    $("#chk_"+index+"x"+divCount+"z"+chkId).after($span);
                    $("#span_"+index+"x"+divCount+"z"+chkId).after($br);
                    addTimeButton($("#chk_"+index+"x"+divCount+"z"+chkId)[0], categoryName);
                    $("#txt_" + index + "x" + divCount).val("");

                    //$("#chk_"+index+"x"+divCount+"z"+chkId).change(function () {
                      //  console.log("azdrarar")
                        //console.log("#txt_" + index + "x" + divCount);

                    //z});
                    /// })
                    chkId++;
                }



            }
        })




    } else {
        $("#txt_"+index).remove();
        $("#btn_"+index).remove();
        //console.log(assocIndexes);
        //console.log("current" + index);
        //console.log($(divId).contents())
/*
        for(var i=0;i<chkCounts[index];i++){
            //console.log("REMOVING " + "#chk_"+index+"z"+i);
            //console.log($("#chk_"+index+"*"+i));
            $("#chk_"+index+"z"+i).remove();
        }
*/
        for(var i=0;i<=divCounts[index];i++){
            console.log("REMOVING " + "#div_"+index+"x"+i);
            //console.log($("#div_"+index));

            $("#div_"+index+"x"+i).remove();


        }
/*
        $(divId).contents().filter(function() {
            //console.log($(this))
            return( $(this)[0].nodeType===3 && $(this)[0].nodeValue != catName)|| $(this)[0].tagName==="BR";
        }).remove();

*/
        /*
        $.each(assocIndexes[index], function(indexNNN, value) {
            console.log("#chk_"+value);
            $("#chk_"+value).remove();
        })
        */
        //$(divId).prepend("<br>");

    }
};

function addTimeButton(thisChk, catName){
    $timeButton = $("<input type='button' value='go' id='timeBtn_"+thisChk.id.split("_")[1]+"' style='margin-left :10px'>");
    $("#span_" +thisChk.id.split("_")[1]).after($timeButton);


    document.getElementById("timeBtn_"+thisChk.id.split("_")[1]).onclick = function() {
        var playerEle = $("#embedPlayer");
        var videoTime = Math.floor(player.getCurrentTime());
        var parsedTime = "";
        if(Math.floor(videoTime/3600) > 0){
            parsedTime += Math.floor(videoTime/3600) + ":";
        }
        parsedTime += Math.floor((videoTime%3600)/60) + ":" + Math.floor(((videoTime%3600)%60));
        $timeArea = $("<input type='textarea' name='timefields["+catName+"]' value='"+parsedTime+"'  id='time_"+thisChk.id.split("_")[1]+"' style='margin-left :10px'>");
        $(this).after($timeArea);
    }
}

function removeCheckbox(checkbox){
    checkbox.next().next().remove();
    checkbox.next().remove();
    checkbox.remove();
}

function sortProperties(obj)
{
    // convert object into array
    var sortable=[];
    for(var key in obj)
        if(obj.hasOwnProperty(key))
            sortable.push([key, obj[key]]); // each item is an array in format [key, value]

    // sort items by value
    sortable.sort(function(a, b)
    {
        return b[1]-a[1]; // compare numbers
    });
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

chrome.storage.sync.get("imageUrl", function (obj) {
    console.log(obj);
    var urlEle = document.getElementById("imageUrl")
    urlEle.value = obj.imageUrl;

});

chrome.storage.sync.get("pageUrl", function (obj) {
    console.log(obj);
    var pageEle = document.getElementById("pageUrl");
    pageEle.value = obj.pageUrl;
    //var playerEle = document.getElementById("embedPlayer");
    //playerEle.src = "http://www.youtube.com/embed/"+obj.pageUrl.split("/").slice(-1)[0].split("?")[0];


});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("HERE")
        //if(request.action == "setBackground"){ document.body.style.background = "red";}
        document.body.style.background = "red"

        //var urlEle = document.getElementById("url")
        //urlEle.value = request.setUrl;
        if(request.setUrl){
            //document.getElementById("url").value == request.setUrl;
        }

    });
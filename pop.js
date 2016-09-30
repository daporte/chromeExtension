$.get("http://localhost/db1/backup.php", function (data) {
    $newdiv1 = $("<div class='results'></div>")
    $newdiv2 = $("<input type='checkbox' name='category'><br>");
    $submit = $("<br><input type='submit' value='Submit'><br>")
    $.each($.parseJSON(data), function (index, value) {
        $newdiv1 = "<div class='results' id='div_"+index+"'></div>"
        $newdiv2 = "<br><input type='checkbox' name='dynfields["+value+"]' id='chk_"+index+"'>";
        $("#playlistForm").append($newdiv1);
        $("#div_"+index).append($newdiv2, value);
    })//)
    $("#playlistForm").append($submit);
});

$(document).ready(function() { // start here, if DOM is loaded


    document.getElementById("stopButton").onclick = function () {
        $('input:checkbox').prop('checked',false);
        chrome.runtime.sendMessage({command : "stop"});


    };

    // request data from php script ...
    // we expect the userCheck.php script to actually 'return' something,
    // some data ...
    console.log("init");



    $('#playlistForm').on('submit', function(e) { //use on if jQuery 1.7+
        e.preventDefault();  //prevent form from submitting
        var data = $("#playlistForm :input").serializeArray();
        console.log($(this).serializeArray());
        var action = $(this).attr('action');
        /*
        $.post($(this).attr('action'), $(this).serializeArray(), function(json) {
            console.log("AAA");
            console.log(json);
            alert(json);
        }, 'json');
        */
        //setInterval(function(){engine(data, action)}, 10000);
        chrome.runtime.sendMessage({data : data, action : action, command : "start"});

        return false;

    });

    $('input:checkbox').change(function() {
        console.log("IM HERE")
        var index = this.id.split("_")[1];
        var divId = "#div_"+index;
        if(this.checked) {
            console.log("CHECKED")
            $newdiv3 = $("<input type='text' name='newCategory' id='txt_"+index+"'>");
            $(divId).append($newdiv3);
        } else {
            $("#txt_"+index).remove();
        }
    });


});


messages = []

$(function(){
    $.get("https://twitter.com/i/notifications", function(data){
        var htmlData = data;
        $data = ($(htmlData).find("#stream-items-id").eq(0))
        //$("body").append($data)
        $("body").append($data.find("li.stream-item").eq(0).find(".tweet-text"))

        console.log($data.find("li.stream-item").eq(0).find(".tweet-text").text())
        for(i=0;i<$data.find("li.stream-item").length;i++){
            console.log(i)
            messages[i] = $data.find("li.stream-item").eq(0).find(".tweet-text").text()
            console.log(messages)
        }
    })
})
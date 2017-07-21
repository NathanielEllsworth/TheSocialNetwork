$.getJSON("/stocks", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#stocks").append("<a href='http://www.ycharts.com" + data[i].link + "'><p data-id='" + data[i]._id + "'>" + data[i].title + "</p></a> <button data-id='" + data[i]._id + "'type='button'>Make Note</button>");
    }
});

$(document).on("click", "button", function () {
    $("#comments").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/stocks/" + thisId
    })
        .done(function (data) {
            console.log(data);
            $("#comments").append("<h2>" + data.title + "</h2>");
            $("#comments").append("<input id='titleinput' name='title' >");
            $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

            if (data.comment) {
                $("#titleinput").val(data.comment.title);
                $("#bodyinput").val(data.comment.body);
            }
        });
});

$(document).on("click", "#savecomment", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/stocks/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .done(function (data) {
            console.log(data);
            $("#comments").empty();
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});


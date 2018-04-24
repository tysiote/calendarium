function getAllEvents() {
    return $.ajax({url: "res/connect.php", success: function() {return true;}});
}

function sendEvent(data) {
    return fetch(
        "res/connect.php", {
            method: "POST",
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: data
        }).then(function(res) {return res.json();})
}

function getAllEvents2() {
    return $.ajax({url: "res/core.php", success: function() {return true;}});
}

function checkConnect() {
    return $.post({
        url: "res/core.php",
        data: {"check_connect": true},
        dataType: "json",
        type: "POST",
        success: function(msg) {
            let res = {};
            $.each(msg, function(i, v) {
                res[i] = v;
            });
            return res;
        }
    });
}
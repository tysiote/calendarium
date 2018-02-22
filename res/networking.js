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
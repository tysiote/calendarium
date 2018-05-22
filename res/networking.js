function sendPostRequest(data) {
    return $.post({
        url: "backend/session.php",
        data: data,
        success: function(msg) {
            return JSON.parse(msg);
        },
        error: function(jqXHR) {
            if (jqXHR.status === 502) {
                loading_try++;
                if (loading_try === 15) {
                    let bar = $("#loading-page");
                    bar.html("Porucha na strane servera, skúste znova načítať stránku alebo počkajte prosím");
                }
                return sendPostRequest(data).then(function(res) {
                    successfulStart(res);
                });
            }
        }});
}
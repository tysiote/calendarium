function loginStart() {
    resizeWindow();
    let spinner = $("#login-wait");
    let main = $("#login-other");
    main.hide();
    $(window).resize(function() {
        resizeWindow();
    });
    $(document).keypress(function(e) {
        if(e.which === 13) {
            loginButton();
        }
    });
    $("#nickname").change(function() {
        resetInfoLogin();
    });
    $("#password").change(function() {
        resetInfoLogin();
    });
    disconnect().then(function(res) {
        res = JSON.parse(res);
        console.log(res);
        spinner.hide();
        main.show();
    });
}

function resizeWindow() {
    $("body").height(window.innerHeight);
}

function resetInfoLogin() {
    let info = $("#login-info-msg");
    info.html("");
    info.removeClass("login-info-msg-danger");
}

function loginButton() {
    let nickname = $("#nickname").val().toLowerCase();
    let password = $("#password").val();
    let info = $("#login-info-msg");
    let btn = $("#login-btn");
    let error = false;
    if (!nickname || !nickname.length) {
        info.html("Neplatný používateľ");
        error = true;
    }
    if (error) {
        info.addClass("login-info-msg-danger");
        return;
    }
    if (!password || !password.length) {
        info.html("Zadajte heslo");
        error = true;
    }
    if (error) {
        info.addClass("login-info-msg-danger");
        return;
    }
    btn.prop("disabled", true);
    btn.html("Prihlasujem<i class='fa fa-refresh fa-spin' style='font-size:24px'></i>");
    connect({nickname: nickname, password: CryptoJS.MD5(password).words[0]}).then(function(res) {
        res = JSON.parse(res);
        console.log(res);
        if (res.status.code === 10) {
            proceed(res.data.level);
        } else {
            info.html("Chybné prihlásenie");
            if (res.status.code === 21) info.html("Chybné meno");
            if (res.status.code === 22) info.html("Chybné heslo");
            btn.prop("disabled", false);
            btn.html("Prihlásiť");
            info.addClass("login-info-msg-danger");
        }
    });
}

function connect(data) {
    return $.post("backend/session.php", {action: "login", nickname: data.nickname, password: data.password}, function(msg) {
        return JSON.parse(msg);
    });
}

function disconnect() {
    return $.post("backend/session.php", {action: "logout"}, function(msg) {
        return JSON.parse(msg);
    });
}

function proceed(level) {
    let url = window.location.href.toString();
    if (url.indexOf("#admin") !== -1) window.location.href = "admin.html";
    else window.location.href = "index.html#" + level.toString();
}
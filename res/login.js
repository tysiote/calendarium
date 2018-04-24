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
    checkConnect().then(function(res) {
        if (res.status === "success" && !res.error) proceed();
        else {
            spinner.hide();
            main.show();
        }
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
        console.log(res);
        if (res.status === "success") {
            document.cookie = "usertype=" + res.usertype;
            document.cookie = "name=" + res.name;
            document.cookie = "nickname=" + res.nickname;
            document.cookie = "password=" + res.password;
            proceed();
        } else {
            btn.prop("disabled", false);
            btn.html("Prihlásiť");
            info.html("Chybné prihlásenie");
            info.addClass("login-info-msg-danger");
        }
    });
}

function connect(data) {
    return $.post({
        url: "res/core.php",
        data: data,
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

function proceed() {
    let url = window.location.href.toString();
    if (url.indexOf("#admin") !== -1) window.location.href = "admin.html";
    else window.location.href = "index.html";
}
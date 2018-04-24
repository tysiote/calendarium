let users = [];
let resetting = '';
let removing = '';
let changing = '';

function adminStart() {
    resizeWindow();
    $("#admin-other").hide();
    $(window).resize(function() {
        resizeWindow();
    });
    checkConnect().then(function(res) {
        if (res.status === "success" && !res.error) {
            if (res.usertype === 2 || res.usertype === "2") {
                fetchUsers().then(function(res) {
                    if (!res.error) adminStartMain(res.data);
                    else window.location.href = "login.html";
                });
            } else {
                window.location.href = "login.html";
            }
        } else {
            window.location.href = "login.html#admin";
        }
    });
}

function adminStartMain(data) {
    users = data;
    $("#admin-users").html(fillUsers());
    $("#admin-pre-loading").hide();
    $("#admin-other").show();
}

function fillUsers() {
    let result = '<table class="table table-striped"><thead><tr><th>Používateľ</th><th>Meno</th><th>Práva</th><th>Operácie</th></tr></thead><tbody>';
    users.forEach(function(u) {result += fillOneUser(u);});
    result += '</tbody></table>';
    return result;
}

function fillOneUser(u) {
    let result = '';
    result += '' +
        '<tr>' +
            '<td>' + u.nickname + '</td>' +
            '<td>' + u.name + '</td>' +
            '<td>' + translateUsertype(u.usertype) + '</td>' +
            '<td>' +
                '<button type="button" class="btn btn-default btn-manage" onclick="resetPressed(\'' + u.nickname + '\');">Reset hesla</button>' +
                '<button type="button" class="btn btn-info btn-manage" onclick="userTypePressed(\'' + u.nickname + '\');">Zmena práv</button>' +
                '<button type="button" class="btn btn-danger btn-manage" onclick="removePressed(\'' + u.nickname + '\');">Zmazanie účtu</button>' +
            '</td>' +
        '</tr>';
    return result;
}

function translateUsertype(i) {
    if (i === 2 || i === "2") return "Administrátor";
    if (i === 1 || i === "1") return "Správca";
    if (i === 0 || i === "0") return "Používateľ";
    return "Nerozpoznané";
}

function resizeWindow() {
    $("body").height(window.innerHeight);
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

function fetchUsers() {
    return $.post({
        url: "res/core.php",
        data: {"all_users": true},
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

function searchForUser(id) {
    for (let i = 0; i < users.length; i++) if (users[i].nickname === id) return users[i];
    return null;
}

function generatePassword() {
    let length = 8;
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let new_password = '';
    for (let i = 0, n = charset.length; i < length; ++i) new_password += charset.charAt(Math.floor(Math.random() * n));
    let new_password_hash = CryptoJS.MD5(new_password).words[0];
    return [new_password, new_password_hash];
}

function resetPressed(id) {
    let result = 'Naozaj chcete resetovať heslo pre ';
    let u = searchForUser(id);
    result += u.name + '?';
    resetting = u.nickname;
    $("#btn-modal-reset").show();
    $("#admin-reset-password-body").html(result);
    $("#admin-reset-password").modal("show");
}

function removePressed(id) {
    let result = 'Naozaj chcete zmazať učet používateľa ';
    let u = searchForUser(id);
    result += u.name + '?';
    removing = u.nickname;
    $("#btn-modal-remove").show();
    $("#admin-remove-user-body").html(result);
    $("#admin-remove-user").modal("show");
}

function userTypePressed(id) {
    let result = 'Zmena práv pre používateľa ';
    let u = searchForUser(id);
    let select = $("#admin-change-user-select");
    result += u.name;
    changing = u.nickname;
    select.val(u.usertype);
    select.show();
    $("#btn-modal-change").show();
    $("#admin-change-user-body").html(result);
    $("#admin-change-user").modal("show");
}

function addNewUserPressed() {
    $("#admin-add-user-name").val("");
    $("#admin-add-user-nickname").val("");
    $("#admin-add-user-select").val("0");
    $("#btn-modal-add").show();
    $("#admin-add-user-body").html("");
    $("#admin-add-user").modal("show");
}

function addUser() {
    let nickname = $("#admin-add-user-nickname").val();
    let name = $("#admin-add-user-name").val();
    let usertype = parseInt($("#admin-add-user-select").val());
    let password = generatePassword();
    let data = {new_user: true, nickname: nickname.toLowerCase(), name: name, usertype: usertype, password: password[1]};
    let result = '';
    let msg = $("#admin-add-user-body");
    let btn = $("#btn-modal-add");
    btn.prop("disabled", true);
    btn.html("Pracujem");
    sendPostRequest(data).then(function(res) {
        console.log(res);
        if (res.error) result = "Používateľa sa nepodarilo pridať";
        else {
            result = 'Používateľ bol pridaný.<br>Nové heslo je <br><span class="new-password">' + password[0] + '</span>';
            addToUsers(data);
        }
        msg.html(result);
        btn.prop("disabled", false);
        btn.html("Potvrdiť");
        btn.hide();
    });
}

function resetPassword() {
    let pswd = generatePassword();
    let new_password = pswd[0];
    let new_password_hash = pswd[1];
    let msg = $("#admin-reset-password-body");
    let result = '';
    let btn = $("#btn-modal-reset");
    btn.prop("disabled", true);
    btn.html("Pracujem");
    sendPostRequest({new_password: new_password_hash, nickname: resetting}).then(function(res) {
        if (res.error) result = "Na serveri nastala chyba";
        else result = 'Heslo bolo úspešne zmenené.<br>Nové heslo je <br><span class="new-password">' + new_password + '</span>';
        msg.html(result);
        btn.prop("disabled", false);
        btn.html("Resetovať");
        btn.hide();
    });
}

function removeUser() {
    let btn = $("#btn-modal-remove");
    btn.prop("disabled", true);
    btn.html("Pracujem");
    let msg = $("#admin-remove-user-body");
    let result = '';
    sendPostRequest({remove_user: removing}).then(function(res) {
        if (res.error) result = 'Na serveri nastala chyba';
        else {
            result = 'Používateľ bol zmazaný';
            removeFromUsers(removing);
        }
        msg.html(result);
        btn.prop("disabled", false);
        btn.html("Zmazať");
        btn.hide();
    });
}

function changeUser() {
    let btn = $("#btn-modal-change");
    let val = $("#admin-change-user-select").val();
    btn.prop("disabled", true);
    btn.html("Pracujem");
    let msg = $("#admin-change-user-body");
    let result = '';
    sendPostRequest({change_user: changing, new_value: parseInt(val)}).then(function(res) {
        if (res.error) result = 'Na serveri nastala chyba';
        else {
            result = 'Práva používateľa boli zmenené';
            changeUserRefresh(changing, val);
        }
        msg.html(result);
        btn.prop("disabled", false);
        btn.html("Zmazať");
        btn.hide();
        $("#admin-change-user-select").hide();
    });
}

function removeFromUsers(user_id) {
    let temp = [];
    for (let i = 0; i < users.length; i++) if (users[i].nickname !== user_id) temp.push(users[i]);
    adminStartMain(temp);
}

function addToUsers(data) {
    adminStart();
}

function changeUserRefresh(user_id, usertype) {
    console.log(user_id, usertype);
    let temp = [];
    for (let i = 0; i < users.length; i++) {
        if (users[i].nickname !== user_id) temp.push(users[i]);
        else {
            let u = users[i];
            u.usertype = usertype;
            temp.push(u);
        }
    }
    adminStartMain(temp);
}

function sendPostRequest(data) {
    console.log(data);
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
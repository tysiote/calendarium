let users = [];
let filtered_users = [];
let resetting = '';
let removing = '';
let changing = '';
let sorting = 'nickname-0';
let expiring = null;

function prepareUsers(data) {
    data.forEach(function(u) {
        u["svk_nickname"] = svkToEng(u.nickname);
        u["svk_name"] = svkToEng(u.name);
    });
    users = data;
    filtered_users = data;
}

function adminStart() {
    resizeWindow();
    $("#admin-other").hide();
    $(window).resize(function() {
        resizeWindow();
    });
    checkConnect().then(function(res) {
        res = JSON.parse(res);
        if (res.status.code === 11) {
            if (res.level === 4) {
                fetchUsers().then(function(res) {
                    res = JSON.parse(res);
                    adminStartMain(res.data);
                });
            } else {
                window.location.href = "index.html";
            }
        } else {
            window.location.href = "login.html#admin";
        }
    });
}

function adminStartMain(data) {
    prepareUsers(data);
    calculateExpiry();
    $("#search-input").on("change paste keyup",function() {refreshFilter();});
    $("#admin-users").html(fillUsers());
    pre_check_sort();
    $("#admin-pre-loading").hide();
    $("#admin-other").show();
}

function sortButton(el) {
    let recent = $(el).prop("id").split("-")[1];
    let $el = $("#sort-" + recent + "-fa");
    let last = sorting.split("-")[1];
    ["nickname", "name", "rights", "expiry"].forEach(function(id) {
        let $temp_el = $("#sort-" + id + "-fa");
        $temp_el.removeClass();
        $temp_el.addClass("fa");
        $temp_el.addClass("fa-sort-down");
    });
    $el.addClass("sort-active");
    if (sorting.split("-")[0] === recent) {
        if (last === "0") {
            sorting = recent + "-1";
            $el.removeClass("fa-sort-down");
            $el.addClass("fa-sort-up");
        } else {
            sorting = recent + "-0";
            $el.removeClass("fa-sort-up");
            $el.addClass("fa-sort-down");
        }
    } else {
        sorting = recent + "-0";
    }
    sort();
}

function sort() {
    let key = sorting.split("-")[0];
    let dir = sorting.split("-")[1];
    if (key === "rights") key = "usertype";
    if (key === "nickname") key = "svk_nickname";
    if (key === "name") key = "svk_name";
    if (key === "expiry") key = "expiry_processed";
    let sortable = [];
    filtered_users.forEach(function(u) {
        if (key === "expiry_processed") {
            let k = u[key].split(" ")[0];
            if (!parseInt(k)) {
                if (u[key].indexOf("darkred") !== -1) k = "-1";
                else k = "9999999999";
            }
            sortable.push([u, parseInt(k)]);
        } else sortable.push([u, u[key]]);
    });
    if (key === "usertype" || key === "expiry_processed") {
        sortable.sort(function(a, b) {
            if (dir === "1") return a[1] - b[1];
            else return b[1] - a[1];
        });
    } else {
        sortable.sort(function(a, b) {
            if (dir === "1") return (a[1] < b[1]) ? -1 : (a[1] > b[1]) ? 1 : 0;
            else return (b[1] < a[1]) ? -1 : (b[1] > a[1]) ? 1 : 0;
        });
    }
    filtered_users = [];
    sortable.forEach(function(u) {filtered_users.push(u[0]);});
    $("#admin-users").html(fillUsers());
    pre_check_sort();
}

function refreshFilter() {
    let $el = $("#search-input");
    let search = svkToEng($el.val());
    filtered_users = [];
    calculateExpiry();
    if (search.length) {
        users.forEach(function(u) {
            if (u.svk_name.indexOf(search) !== -1) filtered_users.push(u);
            if (u.svk_nickname.indexOf(search) !== -1 && filtered_users.indexOf(u) === -1) filtered_users.push(u);
        });
    } else {
        filtered_users = users;
    }
    $("#admin-users").html(fillUsers());
    pre_check_sort();
}

function customReplace(s1, s2, s3) {
    while (s1.indexOf(s2) !== -1) {
        s1 = s1.replace(s2, s3);
    }
    return s1;
}

function calculateExpiry() {
    users.forEach(function(u) {
        u.expiry_processed = parseExpiry(u.expiry, 2);
    });
}

function svkToEng(input) {
    let letters = [
        ["á", "a"],
        ["ä", "a"],
        ["č", "c"],
        ["ď", "d"],
        ["é", "e"],
        ["ě", "e"],
        ["í", "i"],
        ["ľ", "l"],
        ["ĺ", "l"],
        ["ň", "n"],
        ["ó", "o"],
        ["ô", "o"],
        ["ö", "o"],
        ["ř", "r"],
        ["ŕ", "r"],
        ["š", "s"],
        ["ť", "t"],
        ["ú", "u"],
        ["ü", "u"],
        ["ý", "y"],
        ["ž", "z"]
    ];
    letters.forEach(function(v) {
        input = customReplace(input, v[0], v[1]);
        input = customReplace(input, v[0].toUpperCase(), v[1]);
    });
    input = input.toLowerCase();
    return input;
}

function fillUsers() {
    let result = '' +
        '<table class="table table-striped">' +
            '<thead>' +
                '<tr>' +
                    '<th>Používateľ<button class="sort-btn" id="sort-nickname" onclick="sortButton(this);"><span id="sort-nickname-fa" class="fa fa-sort-down"></span></button></th>' +
                    '<th>Meno<button class="sort-btn" id="sort-name" onclick="sortButton(this);"><span id="sort-name-fa" class="fa fa-sort-down"></span></button></th>' +
                    '<th>Práva<button class="sort-btn" id="sort-rights" onclick="sortButton(this);"><span id="sort-rights-fa" class="fa fa-sort-down"></span></button></th>' +
                    '<th>Expirácia<button class="sort-btn" id="sort-expiry" onclick="sortButton(this);"><span id="sort-expiry-fa" class="fa fa-sort-down"></span></button></th>' +
                    '<th>Operácie</th>' +
                '</tr>' +
            '</thead>' +
        '<tbody>';
    filtered_users.forEach(function(u) {result += fillOneUser(u);});
    result += '</tbody></table>';
    return result;
}

function pre_check_sort() {
    ["nickname", "name", "rights", "expiry"].forEach(function(id) {
        let $temp_el = $("#sort-" + id + "-fa");
        $temp_el.removeClass();
        $temp_el.addClass("fa");
        $temp_el.addClass("fa-sort-down");
    });
    let $el = $("#sort-" + sorting.split("-")[0] + "-fa");
    $el.addClass("sort-active");
    if (sorting.split("-")[1] === "1") {
        $el.removeClass("fa-sort-down");
        $el.addClass("fa-sort-up");
    }
}

function fillOneUser(u) {
    let result = '';
    result += '' +
        '<tr>' +
            '<td>' + u.nickname + '</td>' +
            '<td>' + u.name + '</td>' +
            '<td>' + translateUsertype(u.usertype) + '</td>' +
            '<td>' + createExpiry(u) + '</td>' +
            '<td>' +
                '<button type="button" class="btn btn-default btn-manage" onclick="resetPressed(\'' + u.nickname + '\');">Zmena hesla</button>' +
                '<button type="button" class="btn btn-info btn-manage" onclick="userTypePressed(\'' + u.nickname + '\');">Zmena práv</button>' +
                '<button type="button" class="btn btn-danger btn-manage" onclick="removePressed(\'' + u.nickname + '\');">Zmazanie účtu</button>' +
            '</td>' +
        '</tr>';
    return result;
}

function createExpiry(u) {
    let result = '';
    result += '<button type="button" class="btn btn-expiry" onclick="expiryClicked(\'' + u.nickname + '\');">' + u.expiry_processed + '</button>';
    return result;
}

function findUser(nickname) {
    for (let i = 0; i < users.length; i++) if (users[i].nickname === nickname) return users[i];
    return null;
}

function parseMonth(input) {
    let months = ["január", "február", "marec", "apríl", "máj", "jún", "júl", "august", "september", "október", "november", "december"];
    if (typeof input === "string") {
        if (months.indexOf(input.toLowerCase()) !== -1) return months.indexOf(input.toLowerCase()) + 1;
    }
    if (typeof input === "number" && input >= 0 && input < 12) return months[input].substr(0, 1).toUpperCase() + months[input].substr(1, months[input].length).toLowerCase();
    return null;
}

function checkDate(input) {
    let day = null;
    let month = null;
    let year = null;
    if (input && input.length) {
        let parts = input.split(" ");
        if (parts.length === 3) {
            if (parts[0].indexOf(".") !== -1) {
                if (parts[0].length === 2 && parseInt(parts[0].substring(0, 1))) day = parseInt(parts[0].substring(0, 1));
                if (parts[0].length === 3 && parseInt(parts[0].substring(0, 2))) day = parseInt(parts[0].substring(0, 2));
            }
            month = parseMonth(parts[1]);
            year = parseInt(parts[2]);
        }
    }
    if (day && month && year) return {day: day, month: month, year: year};
    return false;
}

function dateChanged() {
    let result = 'Chybný dátum';
    let date = checkDate($("#input-date").val());
    if (date) result = parseExpiry(date, 1);
    $("#checked-date").html(result);
}

function parseExpiry(exp, mode) {
    if (mode === 1) { // object
        return exp.day + ". " + parseMonth(exp.month - 1) + " " + exp.year;
    }
    if (mode === 2) { // date_string
        if (exp && exp.length) {
            let d = new Date(exp);
            let e = new Date();
            let compare = (d - e) /1000/60/60/24; // RETURNS DAYS
            if (compare < 0) return '<span style="color: darkred">Účet expiroval</span>';
            else compare = parseInt(compare.toString()) + " dní, ";
            return compare + d.getDate() + ". " + parseMonth(d.getMonth()) + " " + d.getFullYear();
        } else return '<span style="color: darkblue">Neobmedzené</span>';
    }
    return exp;
}

function expiryClicked(nickname) {
    expiring = findUser(nickname);
    let result = 'Zmena expirácie pre ' + expiring.name;
    $("#admin-change-expiry-title").html(result);
    result = '<p>Pôvodné nastavenie: <br><b>' + expiring.expiry_processed + "</b><br><br>";
    result += 'Nové nastavenie: <br><b><span id="checked-date"></span></b></p>';
    $("#admin-change-expiry-body").html(result);
    dateChanged();
    $("#admin-change-expiry").modal("show");
}

function expiryChange() {
    let temp = checkDate($("#input-date").val());
    if (temp.day < 10) temp.day = "0" + temp.day;
    if (temp.month < 10) temp.month = "0" + temp.month;
    let expiry = temp.year + "-" + temp.month + "-" + temp.day;
    let data = {action: "edit_user", data: {expiry: expiry, nickname: expiring.nickname}};
    let btn = $("#btn-modal-expiry");
    btn.prop("disabled", true);
    btn.html("Pracujem");
    sendPostRequest(data).then(function(res) {
        res = JSON.parse(res);
        if (res.status.code === 11) {
            btn.prop("disabled", false);
            btn.html("Upraviť");
            expiring.expiry = expiry;
            calculateExpiry();
            refreshFilter();
            expiring = null;
        }
        $("#admin-change-expiry").modal("hide");
    });
}

function translateUsertype(i) {
    if (i === 4 || i === "4") return "Administrátor";
    if (i === 3 || i === "3") return "Správca";
    if (i === 2 || i === "2") return "TASR Používateľ";
    if (i === 1 || i === "1") return "Používateľ";
    return "Nerozpoznané";
}

function resizeWindow() {
    $("body").height(window.innerHeight);
}

function checkConnect() {
    return $.get("backend/session.php", {}, function(msg) {
        return JSON.parse(msg);
    });
}

function fetchUsers() {
    return $.post("backend/session.php", {action: "get_users"}, function(msg) {
        return JSON.parse(msg);
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
    let u = searchForUser(id);
    resetting = u.nickname;
    let result = '<legend>Naozaj chcete zmeniť heslo pre používateľa ' + u.name + '?</legend>' +
    '<fieldset class="form-group">' +
        '<label>Heslo</label>' +
        '<div class="form-check">' +
            '<label class="form-check-label">' +
                '<input type="radio" class="form-check-input" name="password-radios" id="password-edit-radios-1" value="option1" onclick="manualPasswordChanged(\'edit\');">' +
                'Vygenerovať heslo' +
            '</label>' +
        '</div>' +
        '<div class="form-check">' +
            '<label class="form-check-label">' +
                '<input type="radio" class="form-check-input" name="password-radios" id="password-edit-radios-2" value="option2" onclick="manualPasswordChanged(\'edit\');" checked>' +
                'Zadať heslo manuálne' +
            '</label>' +
        '</div>' +
        '<input type="text" class="form-control" id="admin-edit-user-password" placeholder="Heslo">' +
    '</fieldset>';
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
    let nickname = svkToEng($("#admin-add-user-nickname").val());
    let name = $("#admin-add-user-name").val();
    let usertype = parseInt($("#admin-add-user-select").val());
    let password = $("#admin-add-user-password").val();
    if ($("#password-radios-1").prop("checked")) password = generatePassword();
    else password = [password, CryptoJS.MD5(password).words[0]];
    let data = {action: "add_user", data: {nickname: nickname, name: name, usertype: usertype, password: password[1]}};
    let result = '';
    let msg = $("#admin-add-user-body");
    let btn = $("#btn-modal-add");
    btn.prop("disabled", true);
    btn.html("Pracujem");
    sendPostRequest(data).then(function(res) {
        res = JSON.parse(res);
        if (res.status.code !== 11) result = "Používateľa sa nepodarilo pridať";
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
    let password = $("#admin-edit-user-password").val();
    if ($("#password-edit-radios-1").prop("checked")) password = generatePassword();
    else password = [password, CryptoJS.MD5(password).words[0]];
    let data = {action: "edit_user", data: {password: password[1], nickname: resetting}};
    let msg = $("#admin-reset-password-body");
    let result = '';
    let btn = $("#btn-modal-reset");
    btn.prop("disabled", true);
    btn.html("Pracujem");
    sendPostRequest(data).then(function(res) {
        res = JSON.parse(res);
        if (res.status.code !== 11) result = "Na serveri nastala chyba";
        else result = 'Heslo bolo úspešne zmenené.<br>Nové heslo je <br><span class="new-password">' + password[0] + '</span>';
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
    sendPostRequest({action: "delete_user", data: {nickname: removing}}).then(function(res) {
        res = JSON.parse(res);
        if (res.status.code !== 11) result = 'Na serveri nastala chyba';
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
    sendPostRequest({action: "edit_user", data: {usertype: parseInt(val), nickname: changing}}).then(function(res) {
        res = JSON.parse(res);
        if (res.status.code !== 11) result = 'Na serveri nastala chyba';
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

function addToUsers() {
    adminStart();
}

function changeUserRefresh(user_id, usertype) {
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
    return $.post("backend/session.php", data, function(msg) {
        return JSON.parse(msg);
    });
}

function manualPasswordChanged(action) {
    if ($("#password-" + action + "-radios-1").prop("checked")) $("#admin-" + action + "-user-password").attr("disabled", true);
    else $("#admin-" + action + "-user-password").attr("disabled", false);
}
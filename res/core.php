<?php

function connectDatabase() {
    $host = "46.229.230.119";
    $user = "rs017100";
    $password = "mvabived";
    $database = "rs017101db";
    $con = mysqli_connect($host, $user, $password, $database);
    return $con;
}

function addUser($json_result) {
    $nickname = $_COOKIE["nickname"];
    $con = connectDatabase();
    $sql = "SELECT * FROM calendarium_users WHERE nickname='$nickname'";
    $result = $con->query($sql);
    while ($row = $result->fetch_assoc()) {
        if ($row['usertype'] == 2) {
            if (array_key_exists("nickname", $_POST) && array_key_exists("name", $_POST) && array_key_exists("usertype", $_POST) && array_key_exists("password", $_POST)) {
                $nickname = $_POST["nickname"];
                $name = $_POST["name"];
                $usertype = $_POST["usertype"];
                $password = $_POST["password"];
                $sql = "SELECT * FROM calendarium_users WHERE nickname='$nickname'";
                $result2 = $con->query($sql);
                if ($result2->num_rows > 0) $json_result['error'] = true;
                else {
                    $sql = "INSERT INTO calendarium_users VALUES ('$nickname', '$name', '$password', $usertype)";
                    $con->query($sql);
                    $json_result["msg"] = "user_added";
                }
            } else $json_result['error'] = true;
        } else $json_result['error'] = true;
    }
    return $json_result;
}

function getUsers($json_result) {
    $nickname = $_COOKIE["nickname"];
    $con = connectDatabase();
    $sql = "SELECT * FROM calendarium_users WHERE nickname='$nickname'";
    $result = $con->query($sql);
    while ($row = $result->fetch_assoc()) {
        if ($row['usertype'] == 2) {
            $sql = "SELECT name, nickname, usertype FROM calendarium_users";
            $result = $con->query($sql);
            $json_result["data"] = array();
            while ($row = $result->fetch_assoc()) {array_push($json_result["data"], $row);}
        } else {
            $json_result['error'] = true;
        }
    }

    return $json_result;
}

function getData($json_result) {
    $con = connectDatabase();
    $sql = "SELECT * FROM calendarium";
    $result = $con->query($sql);
    $json_result["data"] = array();
    while ($row = $result->fetch_assoc()) {array_push($json_result["data"], $row);}
    return $json_result;
}

function changePassword($json_result, $new_password, $nickname) {
    $con = connectDatabase();
    $nick2 = $_COOKIE["nickname"];
    $sql = "SELECT * FROM calendarium_users WHERE nickname='$nick2'";
    $result = $con->query($sql);
    while ($row = $result->fetch_assoc()) {
        if ($row['usertype'] == 2) {
            $sql = "UPDATE calendarium_users SET password='$new_password' WHERE nickname='$nickname'";
            $con->query($sql);
            $json_result["msg"] = 'password_changed';
        } else $json_result['error'] = true;
    }
    return $json_result;
}

function changeUserType($json_result, $nickname, $new_value) {
    $con = connectDatabase();
    $nick2 = $_COOKIE["nickname"];
    $sql = "SELECT * FROM calendarium_users WHERE nickname='$nick2'";
    $result = $con->query($sql);
    while ($row = $result->fetch_assoc()) {
        if ($row['usertype'] == 2) {
            $sql = "UPDATE calendarium_users SET usertype=$new_value WHERE nickname='$nickname'";
            $con->query($sql);
            $json_result["msg"] = 'usertype_changed';
        } else $json_result['error'] = true;
    }
    return $json_result;
}

function removeUser($json_result, $nickname) {
    $con = connectDatabase();
    $nick2 = $_COOKIE["nickname"];
    $sql = "SELECT * FROM calendarium_users WHERE nickname='$nick2'";
    $result = $con->query($sql);
    while ($row = $result->fetch_assoc()) {
        if ($row['usertype'] == 2) {
            $sql = "DELETE FROM calendarium_users WHERE nickname='$nickname'";
            $con->query($sql);
            $json_result["msg"] = 'user_deleted';
        } else $json_result['error'] = true;
    }
    return $json_result;
}

function checkUserAuthentication($nick, $pass) {
    $con = connectDatabase();
    $sql = "SELECT * FROM calendarium_users WHERE nickname='$nick' AND password='$pass'";
    $result = $con->query($sql);
    if ($result->num_rows > 0) return true;
    return false;
}

function getUserInfo($nickname, $json_result) {
    $con = connectDatabase();
    $sql = "SELECT * FROM calendarium_users WHERE nickname='$nickname'";
    $result = $con->query($sql);
    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $json_result["usertype"] = $row["usertype"];
        $json_result["name"] = $row["name"];
        $json_result["password"] = $row["password"];
        $json_result["nickname"] = $nickname;
    } else {
        $json_result["error"] = true;
    }
    return $json_result;
}

session_start();
$json_result = array();
$err = false;
global $json_result;
if (!array_key_exists("logged", $_SESSION)) {
    if ($_POST && array_key_exists("nickname", $_POST) && array_key_exists("password", $_POST)) {
        $nick = $_POST["nickname"];
        $pass = $_POST["password"];
        $con = connectDatabase();
        $sql = "SELECT * FROM calendarium_users WHERE nickname='$nick' AND password='$pass'";
        $result = $con->query($sql);
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $_SESSION["logged"] = true;
            $json_result["status"] = "success";
            $json_result["usertype"] = $row["usertype"];
            $json_result["name"] = $row["name"];
            $json_result["password"] = $row["password"];
            $json_result["nickname"] = $row["nickname"];
        } else {
            $err = true;
            $json_result["status"] = "failed_login";
        }
    } else {
        $err = true;
        $json_result["status"] = "bad_request";
    }
} else {
    $json_result["status"] = "success";
    if (array_key_exists("nickname", $_COOKIE) && array_key_exists("password", $_COOKIE)) $json_result = getUserInfo($_COOKIE["nickname"], $json_result);
}
if (array_key_exists("password", $_COOKIE) && array_key_exists("nickname", $_COOKIE)) {
    if (!checkUserAuthentication($_COOKIE['nickname'], $_COOKIE['password'])) {
        $err = true;
        $json_result["error"] = true;
    }
} else {
    $err = true;
    $json_result["error"] = true;
}
if (!$err) {
    if ($_SERVER['REQUEST_METHOD'] == "GET") {
        $json_result = getData($json_result);
    }
    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        if (array_key_exists("get_user_info", $_POST)) $json_result = getUserInfo($_POST["username"], $json_result);
        if (array_key_exists("all_users", $_POST)) $json_result = getUsers($json_result);
        if (array_key_exists("remove_user", $_POST)) $json_result = removeUser($json_result, $_POST["remove_user"]);
        if (array_key_exists("change_user", $_POST) && array_key_exists("new_value", $_POST)) $json_result = changeUserType($json_result, $_POST["change_user"], $_POST["new_value"]);
        if (array_key_exists("new_password", $_POST) && array_key_exists("nickname", $_POST)) $json_result = changePassword($json_result, $_POST["new_password"], $_POST["nickname"]);
        if (array_key_exists("new_user", $_POST)) $json_result = addUser($json_result);
    }
}
//$json_result["cookies"] = $_COOKIE;
echo json_encode($json_result);

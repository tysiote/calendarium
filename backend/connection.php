<?php
error_reporting(1);
function connectDatabase() {
    $file = fopen("config.txt", "r") or die("Unable to open file!");
    $text = fread($file,filesize("config.txt"));
    fclose($file);
    $data = explode("[", $text);
    $host = '';
    $user = '';
    $password = '';
    $db = '';
    for ($i = 1; $i < sizeof($data); $i++) {
        $temp = explode("]", $data[$i]);
        $temp[1] = str_replace(chr(13), "", $temp[1]);
        $temp[1] = str_replace(chr(10), "", $temp[1]);
        if ($temp[0] == "HOST") $host = $temp[1];
        if ($temp[0] == "USER") $user = $temp[1];
        if ($temp[0] == "PASSWORD") $password = $temp[1];
        if ($temp[0] == "DB") $db = $temp[1];
    }
    $con = mysqli_connect($host, $user, $password, $db);
    return $con;
}

function authenticate($data) {
    if (!array_key_exists("nickname", $data) || !array_key_exists("password", $data)) {
        return array("status" => array("code" => 0, "msg" => translateCode(0)));
    }
    $user = $data["nickname"];
    $password = $data["password"];
    $con = connectDatabase();
    $sql = "SELECT * FROM calendarium_users WHERE nickname='$user'";
    $res = $con->query($sql);
    $ret = array("status" => array("code" => 0));
    if ($res->num_rows > 0) {
        $user = $res->fetch_assoc();
        if ($user['password'] == $password) {
            $ret['status']['code'] = 10;
            $ret['data'] = array("level" => (int) $user['usertype']);
        } else {
            $ret['status']['code'] = 22;
        }
    } else {
        $ret['status']['code'] = 21;
    }
    $ret['status']['msg'] = translateCode($ret['status']['code']);
    return $ret;
}

function translateCode($code) {
    if ($code == 0) return "bad_request";

    if ($code == 10) return "successfully_logged_in";
    if ($code == 11) return "ok";
    if ($code == 12) return "successfully_logged_out";

    if ($code == 20) return "not_logged";
    if ($code == 21) return "invalid_username";
    if ($code == 22) return "invalid_password";
    if ($code == 23) return "insufficient_privileges";
    return "unknown_code";
}
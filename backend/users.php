<?php
error_reporting(1);

function getUsers() {
    if ($_SESSION["level"] != 4) return array("status" => array("code" => 23, "msg" => 23));
    $con = connectDatabase();
    $sql = "SELECT * FROM calendarium_users";
    $result = $con->query($sql);
    $res = array("data" => array());
    while ($row = $result->fetch_assoc()) {array_push($res['data'], $row);}
    return $res;
}

function addUser($data) {
    if ($_SESSION["level"] != 4) return array("status" => array("code" => 23, "msg" => 23));
    $con = connectDatabase();
    $nickname = $data['nickname'];
    $name = $data['name'];
    $password = $data['password'];
    $usertype = $data['usertype'];
    $expiry = 'null';
    if (array_key_exists("expiry", $data)) $expiry = "'".$data['expiry']."'";
    $sql = "INSERT INTO calendarium_users (nickname, name, password, usertype, expiry) VALUES ('$nickname', '$name', '$password', $usertype, $expiry)";
    $con->query($sql);
    return array();
}

function editUser($data) {
    if ($_SESSION["level"] != 4) return array("status" => array("code" => 23, "msg" => 23));
    $con = connectDatabase();
    $sql = "UPDATE calendarium_users";
    $sql .= " SET ";
    foreach($data as $key=>$value) {
        if ($key != "usertype") $sql .= $key . " = '". $value . "', ";
        else $sql .= $key . " = " . $value . ", ";
    }
    $sql = substr($sql, 0, -2) ." WHERE nickname = '" . $data['nickname'] . "'";
//    echo $sql;
    $con->query($sql);
    return array();
}

function deleteUser($data) {
    if ($_SESSION["level"] != 4) return array("status" => array("code" => 23, "msg" => 23));
    $con = connectDatabase();
    $nickname = $data['nickname'];
    $sql = "DELETE FROM calendarium_users WHERE nickname='$nickname'";
    $con->query($sql);
    return array();
}

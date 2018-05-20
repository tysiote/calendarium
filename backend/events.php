<?php
error_reporting(1);

function getEvents() {
    $con = connectDatabase();
    $sql = "SELECT * FROM calendarium";
    $result = $con->query($sql);
    $res = array("data" => array(), "level" => $_SESSION['level']);
    while ($row = $result->fetch_assoc()) {array_push($res['data'], $row);}
    return $res;
}

function addEvent($data) {
//    print_r($data);
//    echo "<br><br>";
    $con = connectDatabase();
    $title = $data['title'];
    $content = "";
    if (array_key_exists('content', $data)) $content = $data['content'];
    $start_time = $data['start_time']."-00";
    $tags1 = $data['tags1'];
    $tags2 = $data['tags2'];
    $tags3 = $data['tags3'];
    $tags4 = $data['tags4'];
    $tags5 = $data['tags5'];
    $sport_type = $data['sport_type'];
    $sql = "INSERT INTO calendarium (title, content, start_time, tags1, tags2, tags3, tags4, tags5, sport_type, added) VALUES ('$title', '$content', '$start_time', '$tags1', '$tags2', '$tags3', '$tags4', '$tags5', '$sport_type', now())";
    $con->query($sql);
    $sql = "SELECT * FROM calendarium WHERE id=$con->insert_id";
    $res = $con->query($sql);
    $result = array("data" => $res->fetch_assoc());
    return $result;
}

function addEventBulk($data) {
    $result = array("data" => array());
    foreach ($data as $i=>$d) {
        array_push($result["data"], addEvent($d["data"]));
    }
    return $result;
}

function editEvent($data) {
    $con = connectDatabase();
    $sql = "UPDATE calendarium";
    $sql .= " SET ";
    foreach($data as $key=>$value) {
        if ($key != "id") $sql .= $key . " = '". $value . "', ";
    }
    $sql .= "edited=now() WHERE id = " . $data['id'];
    $con->query($sql);
    $id = $data['id'];
    $result = array("data" => array("edited" => ""));
    $sql = "SELECT * FROM calendarium WHERE id=$id";
    $row = $con->query($sql)->fetch_assoc();
    $result["data"]["edited"] = $row['edited'];
    $result["data"]["start_time"] = $row['start_time'];
    return $result;
}

function deleteDataSoft($id) {
    $con = connectDatabase();
    $sql = "UPDATE calendarium SET deleted=now() WHERE id=$id";
    $con->query($sql);
    $sql = "SELECT * FROM calendarium WHERE id=$id";
    return array("data" => array("deleted" => $con->query($sql)->fetch_assoc()["deleted"]));
}

function deleteDataHard($id) {
    $con = connectDatabase();
    $sql = "DELETE FROM calendarium WHERE id=$id";
    $con->query($sql);
    return array();
}
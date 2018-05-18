<?php
error_reporting(1);

function getEvents() {
    $con = connectDatabase();
    $sql = "SELECT * FROM calendarium";
    $result = $con->query($sql);
    $res = array("data" => array());
    while ($row = $result->fetch_assoc()) {array_push($res['data'], $row);}
    return $res;
}

function addEvent($data) {
    $con = connectDatabase();
    $title = $data['title'];
    $content = "";
    if ($data['content']) $content = $data['content'];
    $start_time = $data['start_time']."-00";
    $tags1 = $data['tags1'];
    $tags2 = $data['tags2'];
    $tags3 = $data['tags3'];
    $tags4 = $data['tags4'];
    $sql = "INSERT INTO calendarium (title, content, start_time, tags1, tags2, tags3, tags4, added) VALUES ('$title', '$content', '$start_time', '$tags1', '$tags2', '$tags3', '$tags4', now())";
    $con->query($sql);
    $result = array("id" => $con->insert_id, "added" => date('Y-m-d H:i:s'));
    return $result;
}

function addEventBulk($data) {
    $result = array("data" => array());
    $data['title'] = substr($data['events'], 6, strlen($data['events']));
    for ($i = 1; $i < intval($data['count']) + 1; $i++) {
        $data['start_time'] = $data['start_time' . strval($i)];
        array_push($result['data'], addEvent($data));
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
    $result = array("data" => array("edited" => date('Y-m-d H:i:s')));
    return $result;
}

function deleteDataSoft($id) {
    $con = connectDatabase();
    $sql = "UPDATE calendarium SET deleted=now() WHERE id=$id";
    $con->query($sql);
    return array("data" => array("deleted" => date('Y-m-d H:i:s')));
}

function deleteDataHard($id) {
    $con = connectDatabase();
    $sql = "DELETE FROM calendarium WHERE id=$id";
    $con->query($sql);
    return array();
}
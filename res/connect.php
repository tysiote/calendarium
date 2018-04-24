<?php
error_reporting(-1);
//ini_set('display_errors', 'On');

function connectDatabase() {
    $host = "46.229.230.119";
    $user = "rs017100";
    $password = "mvabived";
    $database = "rs017101db";
    $con = mysqli_connect($host, $user, $password, $database);
    return $con;
}

function getData() {
    $con = connectDatabase();
    $sql = "SELECT * FROM calendarium";
    $result = $con->query($sql);
    $res = array();
    while ($row = $result->fetch_assoc()) {array_push($res, $row);}
    echo json_encode($res);
}

function setData($data, $bulk) {
    if (array_key_exists("bulk", $data) && $data["bulk"] == "true") bulkData($data);
    else {
        $con = connectDatabase();
        $title = $data['title'];
        $content = "";
        if ($data['content']) $content = $data['content'];
        $start_time = $data['start_time']."-00";
        $tags1 = $data['tags1'];
        $tags2 = $data['tags2'];
        $tags3 = $data['tags3'];
        $tags4 = $data['tags4'];
        $public = $data['public'];
        $sql = "INSERT INTO calendarium (title, content, start_time, tags1, tags2, tags3, tags4, added, public) VALUES ('$title', '$content', '$start_time', '$tags1', '$tags2', '$tags3', '$tags4', now(), $public)";
        $result = array("status" => $con->query($sql), "id" => $con->insert_id, "added" => date('Y-m-d H:i:s'));
        if ($bulk) return json_encode($result);
        else echo json_encode($result);
    }
}

function bulkData($data) {
    $result = '[';
    $data['bulk'] = "";
    $data['title'] = substr($data['events'], 6, strlen($data['events']));
    for ($i = 1; $i < intval($data['count']) + 1; $i++) {
        $data['start_time'] = $data['start_time' . strval($i)];
        $result .= setData($data, true);
        if ($i != intval($data['count'])) $result .= ",";
    }
    echo $result . "]";
}

function updateData($data) {
    if (array_key_exists("remove", $data)) deleteData($data['id']);
    else {
        $con = connectDatabase();
        $sql = "UPDATE calendarium";
        $sql .= " SET ";
        foreach($data as $key=>$value) {
            if ($key != "id") $sql .= $key . " = '". $value . "', ";
        }
//        $sql = substr($sql, 0, -2) . " WHERE id = " . $data['id'];
        $sql .= "edited=now() WHERE id = " . $data['id'];
        $result = array("status" => $con->query($sql), "edited" => date('Y-m-d H:i:s'));
        echo json_encode($result);
    }
}

function deleteData($id) {
    $con = connectDatabase();
    $sql = "UPDATE calendarium SET deleted=now() WHERE id=$id";
    $con->query($sql);
    echo json_encode( array("status" => $con->query($sql), "deleted" => date('Y-m-d H:i:s')));
}

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    if (isset($_POST['id'])) updateData($_POST);
    else setData($_POST, false);
//    setData(file_get_contents('php://input'));
}
else getData();

//if (isset($_POST['id']) || isset($_POST['title'])) {
//    if (isset($_POST['id'])) updateData($_POST);
//    else setData($_POST);
//} else getData();

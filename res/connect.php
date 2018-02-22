<?php
error_reporting(-1);
//ini_set('display_errors', 'On');

function connectDatabase() {
    $host = "46.229.230.119";
    $user = "rs017100";
    $password = "mvabived";
    $database = "rs017101db";
    $con = mysqli_connect($host, $user, $password, $database);
    if (!$con) {
        $host = "135.76.168.165";
        $user = "mm321a";
        $password = "vPVcmHHwpXa8Asdf";
        $database = "mm321a";
//        echo "Failed to connect to MySQL: " . mysqli_connect_error();
        $con = mysqli_connect($host, $user, $password, $database);
    }
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

function setData($data) {
    $con = connectDatabase();
    $title = $data['title'];
    $content = "";
    if ($data['content']) $content = $data['content'];
    $start_time = $data['start_time']."-00";
    $tags1 = $data['tags1'];
    $tags2 = $data['tags2'];
    $sql = "INSERT INTO calendarium (title, content, start_time, tags1, tags2) VALUES ('$title', '$content', '$start_time', '$tags1', '$tags2')";
    $result = array("status" => $con->query($sql));
    echo json_encode(200);
}

function updateData($data) {
    $con = connectDatabase();
    $sql = "UPDATE calendarium";
    $sql .= " SET ";
    foreach($data as $key=>$value) {
        if ($key != "id") $sql .= $key . " = '". $value . "', ";
    }
    $sql = substr($sql, 0, -2) . " WHERE id = " . $data['id'];
    $result = array("status" => $con->query($sql));
    echo json_encode(200);
}

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    if (isset($_POST['id'])) updateData($_POST);
    else setData($_POST);
//    setData(file_get_contents('php://input'));
}
else getData();

//if (isset($_POST['id']) || isset($_POST['title'])) {
//    if (isset($_POST['id'])) updateData($_POST);
//    else setData($_POST);
//} else getData();

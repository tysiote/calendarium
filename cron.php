<?php

function connectDatabase() {
    $host = "46.229.230.119";
    $user = "rs017100";
    $password = "mvabived";
    $database = "rs017101db";
    $con = mysqli_connect($host, $user, $password, $database);
    return $con;
}

$con = connectDatabase();
$sql = "SELECT * FROM calendarium WHERE deleted < CURRENT_TIMESTAMP() AND deleted > ADDDATE(CURDATE(), -10000)";
$result = $con->query($sql);
$res = array();
while ($row = $result->fetch_assoc()) {array_push($res, $row);}
echo $sql."<br>";
print_r($res);
echo "<br>".$result->num_rows;
$sql = "DELETE FROM calendarium WHERE deleted < CURRENT_TIMESTAMP() AND deleted > ADDDATE(CURDATE(), -10000)";
$result = $con->query($sql);

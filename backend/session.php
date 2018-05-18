<?php
include("connection.php");
include("events.php");
include("users.php");

function checkAction($action) {
    $ret = false;
    $actions = [
        ["get_events", "logout"],
        ["add_event", "add_event_bulk", "edit_event", "delete_event_soft", "delete_event_hard"],
        ["add_user", "edit_user", "delete_user", "get_users"]
    ];
    for ($i = 0; $i < $_SESSION["level"]; $i++) {
        if (in_array($action, $actions[$i])) $ret = true;
    }
    return $ret;
}

function logout() {
    session_destroy();
    $_SESSION = array();
    return array("status" => array("code" => 12, "msg" => translateCode(12)));
}

session_start();
if ($_SESSION && array_key_exists("logged", $_SESSION) && array_key_exists("level", $_SESSION)) {
    $result = array("status" => array("code" => 0, "msg" => translateCode(0)));
    if ($_SERVER['REQUEST_METHOD'] == "GET") {
        $result = array("status" => array("code" => 11, "msg" => translateCode(11)), "level" => $_SESSION["level"]);
    }
    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        if (array_key_exists("action", $_POST) && checkAction($_POST["action"])) {
            if (array_key_exists("data", $_POST)) {
                // EVENTS
                if ($_POST["action"] == "add_event") $result = addEvent($_POST["data"]);
                if ($_POST["action"] == "add_event_bulk") $result = addEventBulk($_POST["data"]);
                if ($_POST["action"] == "edit_event") $result = editEvent($_POST["data"]);
                if ($_POST["action"] == "delete_event_soft") $result = deleteDataSoft($_POST["data"]);
                if ($_POST["action"] == "delete_event_hard") $result = deleteDataHard($_POST["data"]);

                // USERS
                if ($_POST["action"] == "add_user") $result = addUser($_POST["data"]);
                if ($_POST["action"] == "edit_user") $result = editUser($_POST["data"]);
                if ($_POST["action"] == "delete_user") $result = deleteUser($_POST["data"]);
            } else {
                if ($_POST["action"] == "logout") $result = logout();

                // EVENTS
                if ($_POST["action"] == "get_events") $result = getEvents();

                // USERS
                if ($_POST["action"] == "get_users") $result = getUsers();
            }
            if ($result["status"]["code"] != 12 && $result["status"]["code"] != 23){
                $result["status"] = array("code" => 11, "msg" => translateCode(11));
            }
        }
    }
} else {
    $result = array("status" => array("code" => 20, "msg" => translateCode(20)));
    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        if (array_key_exists("action", $_POST)) {
            if ($_POST["action"] == "login") $result = authenticate($_POST);
            if ($result["status"]["code"] == 10) {
                $_SESSION["logged"] = true;
                $_SESSION["level"] = (int) $result["data"]["level"];
            }
        }
    }
}
echo json_encode($result);
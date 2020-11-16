<?php
    require './lib/helpers.php';

    $db = connectToDB();
    $simId = $_POST["simulationId"];
    $token = $_POST["token"];

    if (!isTokenValid($simId, $token, $db)) {
        $db->close();
        exit;
    }

    $image = $_POST['image'];
    $taskId = $_POST['taskId'];
    $db->query("UPDATE task SET STATE=1, DATA='" . addslashes($image) . "' WHERE ID = $taskId;");
?>
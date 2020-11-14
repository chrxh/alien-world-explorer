<?php
    require '../lib/helpers.php';

    $db = connectToDB();
    $simId = $_POST["simulationId"];
    $token = $_POST["token"];

    if (!isTokenValid($simId, $token, $db)) {
        $db->close();
        exit;
    }

    $image = $_POST['image'];
    $taskId = $_POST['taskId'];
    $db->query("UPDATE task SET STATE=1, DATA='" . addslashes($image) . "' WHERE task.ID = " . $taskId. ";");

/*    $taskId = $_POST["taskId"];
    $file = $_FILES["image"];//["tmp_name"];
    if (isset($file)) {
        echo "JA";
    }
    else {
        echo "NEIN";
    }
    */
//    $image = file_get_contents($file);
//    $db->query("UPDATE task SET STATE=1, DATA=$image WHERE task.ID = " . $taskId);

?>
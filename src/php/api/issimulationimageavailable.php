<?php
    require './lib/helpers.php';

    $db = connectToDB();
    $taskId = $_GET["taskId"];

    $responses = $db->query("SELECT * FROM task WHERE STATE=1 AND ID=$taskId");
    $imageAvailable = ($responses->num_rows > 0);

    echo json_encode(['data'=>$imageAvailable]);

    $db->close();
?>
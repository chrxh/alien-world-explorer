<?php
    require './lib/helpers.php';

    $db = connectToDB();
    $simId = $_GET["simulationId"];

    //too many requests made?
    $request = $db->query("SELECT * FROM task WHERE STATE=0 AND SIMULATION_ID=$simId");

    if ($request->num_rows > 10) {
        $db->close();
        exit();
    }

    //make request
    $posX = $_GET["posX"];
    $posY = $_GET["posY"];
    $sizeX = $_GET["sizeX"];
    $sizeY = $_GET["sizeY"];

    $db->query("INSERT INTO task (ID, SIMULATION_ID, SESSION_ID, STATE, POS_X, POS_Y, SIZE_X, SIZE_Y, DATA) VALUES (NULL, $simId, '', 0, $posX, $posY, $sizeX, $sizeY, NULL)");
    echo json_encode(['data'=>$db->insert_id]);

    $db->close();
?>
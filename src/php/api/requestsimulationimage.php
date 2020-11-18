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
    $posX = max($_GET["posX"], 0);
    $posY = max($_GET["posY"], 0);
    $sizeX = max(min($_GET["sizeX"], 2000), 1);
    $sizeY = max(min($_GET["sizeY"], 2000), 1);

    $db->query("INSERT INTO task (ID, SIMULATION_ID, STATE, POS_X, POS_Y, SIZE_X, SIZE_Y, DATA, LAST_UPDATE) VALUES (NULL, $simId, 0, $posX, $posY, $sizeX, $sizeY, NULL, NULL)");
    $insertedId = $db->insert_id;
    echo json_encode(['data'=>$insertedId]);

    if (intval($insertedId) % 100 == 0) {
        deleteOutdatedTasks($db);
    }

    $db->close();
?>
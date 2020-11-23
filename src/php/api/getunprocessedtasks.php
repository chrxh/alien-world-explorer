<?php
    require './lib/helpers.php';

    $db = connectToDB();
    $db->begin_transaction();

    $simId = $_POST["simulationId"];
    $token = $_POST["token"];

    if (!isTokenValid($simId, $token, $db)) {
        $db->close();
        exit;
    }

    $unprocessedTasks = $db->query("SELECT t.ID as id, t.POS_X as posX, t.POS_Y as posY, t.SIZE_X as sizeX, t.SIZE_Y as sizeY FROM task t WHERE STATE=0 AND SIMULATION_ID=$simId");

    $result = array();
    while($obj = $unprocessedTasks->fetch_object()){
        $result[] = [
            "id" => (int)$obj->id, 
            "pos" => [(int)$obj->posX, (int)$obj->posY],
            "size" => [(int)$obj->sizeX, (int)$obj->sizeY],
        ];
    }

    updateToken($simId, $db);

    echo json_encode(['data'=>$result]);

    $db->commit();
    $db->close();
?>
<?php
    require './lib/helpers.php';

    $db = connectToDB();

    if ($response= $db->query(
        "SELECT 
            sim.ID as id, 
            sim.TOKEN as token, 
            sim.NAME as simulationName, 
            u.NAME as userName,
            sim.TIMESTEP as timestep, 
            sim.SIZE_X as sizeX, 
            sim.SIZE_Y as sizeY, 
            sim.LAST_UPDATE as lastUpdate,
            sim.DESCRIPTION as descr,
            sim.NUM_BLOCKS as numBlocks,
            sim.NUM_THREADS_PER_BLOCK as numThreadsPerBlock
        FROM simulation sim, user u
        WHERE sim.USER_ID=u.ID")) {

        $result = array();
        while($obj = $response->fetch_object()){
            $isActive = isSimulationActiveAndInactivateIfTokenExpired($obj->id, $db);

            $result[] = [
                "id" => (int)$obj->id, 
                "isActive" => $isActive, 
                "simulationName" => $obj->simulationName, 
                "userName" => $obj->userName, 
                "timestep" => (int)$obj->timestep, 
                "worldSize" => [(int)$obj->sizeX, (int)$obj->sizeY],
                "description" => htmlspecialchars($obj->descr),
                "numBlocks" => (int)$obj->numBlocks,
                "numThreadsPerBlock" => (int)$obj->numThreadsPerBlock,
                "lastUpdate" => $obj->lastUpdate
            ];
        }

        echo json_encode(['data'=>$result]);
    }
    $response->close();
?>

<?php
    require './lib/helpers.php';

    $db = connectToDB();
    
    if ($response= $db->query(
        "SELECT sim.ID as id, sim.TOKEN as token, sim.NAME as simulationName, u.NAME as userName, sim.TIMESTEP as timestep, sim.SIZE_X as sizeX, sim.SIZE_Y as sizeY, sim.LAST_UPDATE as lastUpdate
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
                "worldSize" => [(int)$obj->sizeX, (int)$obj->sizeY]
            ];
        }

        echo json_encode(['data'=>$result]);
    }
    $response->close();
?>

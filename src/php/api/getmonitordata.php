<?php
    require './lib/helpers.php';

    $simulationId = $_GET["simulationId"];
    $timestepFrom = $_GET["timestepFrom"];
    $timestepTo = $_GET["timestepTo"];

    $db = connectToDB();

    if ($response = $db->query(
        "SELECT
            TIMESTEP as timestep,
            NUM_CELLS as numCells,
            NUM_PARTICLES as numParticles,
            NUM_CLUSTERS as numClusters,
            NUM_ACTIVE_CLUSTERS as numActiveClusters,
            NUM_TOKENS as numTokens
        FROM statistics
        WHERE
            SIMULATION_ID=$simulationId AND
            TIMESTEP >= $timestepFrom AND
            TIMESTEP <= $timestepTo")) {

        $result = array();
        while($obj = $response->fetch_object()){
            $result[] = [
                "timestep" => (int)$obj->timestep,
                "numCells" => (int)$obj->numCells,
                "numParticles" => (int)$obj->numParticles,
                "numClusters" => (int)$obj->numClusters,
                "numActiveClusters" => (int)$obj->numActiveClusters,
                "numTokens" => 100
            ];
        }

        echo json_encode(['data'=>$result]);
    }
    $db->close();
?>


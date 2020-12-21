<?php
    require './lib/helpers.php';

    $simulationId = $_GET["simulationId"];
    $timestepFrom = $_GET["timestepFrom"];

    $db = connectToDB();

    $response = $db->query("SELECT TIMESTEP as timestep FROM simulation WHERE ID=$simulationId");
    if ($response->num_rows === 0) {
        $db->close();
        exit;
    }
    $obj = $response->fetch_object();
    $currentTimestep = $obj->timestep;
    
    $repeat = true;
    $iterations = 1;
    while($repeat) {
        $response = $db->query(
            "SELECT
                TIMESTEP as timestep,
                NUM_CELLS as numCells,
                NUM_PARTICLES as numParticles,
                NUM_CLUSTERS as numClusters,
                NUM_ACTIVE_CLUSTERS as numActiveClusters,
                NUM_TOKENS as numTokens
            FROM statistics
            WHERE
                SIMULATION_ID=$simulationId
                AND
                TIMESTEP>=$timestepFrom
            ORDER BY
                TIMESTEP");
        if ($response->num_rows === 0) {
            $db->close();
            exit;
        }
        if($response->num_rows > 10000) {
            $timestepFrom = ($currentTimestep + $timestepFrom) / 2;
            $repeat = true;
        }
        else {
            $repeat = false;
        }
        $iterations = $iterations + 1;
        if ($iterations > 10) {
            $db->close();
            exit;
        }
    }

    $result = array();
    while($obj = $response->fetch_object()){
        $result[] = [
            "timestep" => (int)$obj->timestep,
            "numCells" => (int)$obj->numCells,
            "numParticles" => (int)$obj->numParticles,
            "numClusters" => (int)$obj->numClusters,
            "numActiveClusters" => (int)$obj->numActiveClusters,
            "numTokens" => (int)$obj->numTokens
        ];
    }

    echo json_encode(['data'=>$result]);
    $db->close();
?>


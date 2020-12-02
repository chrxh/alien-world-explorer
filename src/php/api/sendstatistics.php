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

    $timestep = $_POST["timestep"];

    $db->query("DELETE FROM statistics WHERE TIMESTEP >= $timestep");

    $response = $db->query("SELECT * FROM statistics WHERE SIMULATION_ID=$simId AND TIMESTEP=$timestep");
    
    //statistics already sent?
    if ($response->num_rows > 0) {
        $db->close();
        exit;
    }

    //save statistics
    $numCells = $_POST["numCells"];
    $numParticles = $_POST["numParticles"];
    $numClusters = $_POST["numClusters"];
    $numActiveClusters = $_POST["numActiveClusters"];
    $numTokens = $_POST["numTokens"];

    $db->query("INSERT INTO statistics (
            ID, 
            SIMULATION_ID, 
            TIMESTEP, 
            NUM_CELLS, 
            NUM_PARTICLES, 
            NUM_CLUSTERS, 
            NUM_ACTIVE_CLUSTERS, 
            NUM_TOKENS) 
        VALUES (
            NULL, 
            $simId, 
            $timestep, 
            $numCells, 
            $numParticles, 
            $numClusters, 
            $numActiveClusters, 
            $numTokens)");

    $db->query("UPDATE simulation SET TIMESTEP=$timestep WHERE ID = $simId;");

    $db->commit();
    $db->close();
?>
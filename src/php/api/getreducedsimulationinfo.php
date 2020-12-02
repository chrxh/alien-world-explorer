<?php
    require './lib/helpers.php';

    $simulationId = $_GET["simulationId"];

    $db = connectToDB();

    if ($response = $db->query(
        "SELECT TIMESTEP as timestep FROM simulation WHERE ID=$simulationId")) {

        $obj = $response->fetch_object();
        echo json_encode(['data' => ["id" => $simulationId, "timestep" => (int)$obj->timestep]]);
    }
    $db->close();
?>

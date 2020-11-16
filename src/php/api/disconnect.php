<?php
    require './lib/helpers.php';
    
    $db = connectToDB();
    $simulationId = $_POST["simulationId"];
    $token = $_POST["token"];

    $response = $db->query("SELECT sim.ID as id, sim.TOKEN as token FROM simulation sim WHERE sim.ID=$simulationId");

    if ($response == null) {
        exit;
    }
    $obj = $response->fetch_object();
	if ($obj == null) {
        exit;
    }

    if($obj->token === $token) {
        $db->query("UPDATE simulation SET TOKEN=NULL WHERE simulation.ID = " . $obj->id);
    }
?>
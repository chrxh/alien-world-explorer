<?php
    $db = new mysqli("localhost", "root", "", "alien");
	if ($db->connect_error) {
        exit;
    }
    $simulationId = $_POST["simulationId"];
    $password = $_POST["password"];

    $response = $db->query("SELECT sim.ID as id, sim.TOKEN as token, sim.LAST_UPDATE as lastUpdate, u.PASSWORD as pw FROM simulation sim, user u WHERE sim.USER_ID=u.ID AND sim.ID=$simulationId");

    if ($response == null) {
        exit;
    }
    $obj = $response->fetch_object();
	if ($obj == null) {
        exit;
    }

    if ($obj->token != null) {
        $lastUpdateTimestamp = strtotime($obj->lastUpdate);

        $date = new DateTime();
        $currentTimestamp = $date->getTimestamp();

        //invalidate token after 10 min
        if ($currentTimestamp - $lastUpdateTimestamp > 60*1) {
            $db->query("UPDATE simulation SET TOKEN=NULL WHERE simulation.ID = " . $obj->id);
        }
        else {
            exit;
        }
    }

    if ($obj->pw === $password) {
        $token = mt_rand();
        $db->query("UPDATE simulation SET TOKEN='$token' WHERE simulation.ID = " . $obj->id);
        echo $token;
    }
    else {
    }
?>

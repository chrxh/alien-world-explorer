<?php
    include 'lib/helpers.php';

    $db = connectToDB();
    $simulationId = $_POST["simulationId"];
    $password = $_POST["password"];

    if (isSimulationActiveAndInactivateIfTokenExpired($simulationId, $db)) {
        exit();
    }

    $response = $db->query("SELECT sim.ID as id, sim.TOKEN as token, sim.LAST_UPDATE as lastUpdate, u.PASSWORD as pw FROM simulation sim, user u WHERE sim.USER_ID=u.ID AND sim.ID=$simulationId");
    if ($response == null) {
        exit;
    }
    $obj = $response->fetch_object();
	if ($obj == null) {
        exit;
    }

    if ($obj->pw === $password) {
        $token = mt_rand();
        $db->query("UPDATE simulation SET TOKEN='$token' WHERE simulation.ID = " . $obj->id);
        echo $token;
    }
    $db->close();
?>

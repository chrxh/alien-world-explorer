<?php
    $db = new mysqli("localhost", "root", "", "alien");
	if ($db->connect_error) {
        exit;
    }
    $simulationId = $_POST["simulationId"];
    $password = $_POST["password"];
    $response= $db->query("SELECT * FROM simulation WHERE ID=$simulationId");
	if ($response->num_rows == 0) {
        echo "31 " . $simulationId;
        exit;
    }

    $row = $response->fetch_array();
    $userId = $row["USER_ID"];

    echo "Hallo " . $userId;
?>

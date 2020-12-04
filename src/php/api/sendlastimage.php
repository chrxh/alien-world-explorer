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

    $image = $_POST['image'];
    $db->query("UPDATE simulation SET LAST_IMAGE_DATA='" . addslashes($image) . "' WHERE ID = $simId;");

    $db->commit();
    $db->close();
?>
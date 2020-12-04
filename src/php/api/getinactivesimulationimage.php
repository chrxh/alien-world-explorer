<?php
    header("Content-type: image/png");

    require './lib/helpers.php';

    if ($_GET == null) {
        exit();
    }

    $simulationId = $_GET["simulationId"];

    $db = connectToDB();

    $response = $db->query("SELECT LAST_IMAGE_DATA as lastImageData FROM simulation WHERE ID=$simulationId");

    if($obj = $response->fetch_object()) {
        $image = imagecreatefromstring($obj->lastImageData);
        imagepng($image);
        imageDestroy($image);
    }
    $db->close();
?>
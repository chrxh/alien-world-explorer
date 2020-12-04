<?php
    header("Content-type: image/png");

    require './lib/helpers.php';

    if ($_GET == null) {
        exit();
    }

    $simulationId = $_GET["simulationId"];

    $db = connectToDB();

    $response = $db->query("SELECT SIZE_X as sizeX, SIZE_Y as sizeY FROM simulation WHERE ID=$simulationId");

    if($obj = $response->fetch_object()) {
        $im = imagecreate($obj->sizeX, $obj->sizeY);

        // Weißer Hintergrund und blauer Text
        imagecolorallocate($im, 0, 0, 100);
        $textcolor = imagecolorallocate($im, 0, 0, 255);
        
        // Schreibe die Zeichenkette oben links
        imagestring($im, 5, 0, 0, 'Hello world!', $textcolor);

        imagepng($im);
        imagedestroy($im);
    }
    $db->close();
?>
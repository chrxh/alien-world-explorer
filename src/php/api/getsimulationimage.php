<?php
    header("Content-type: image/png");

    require './lib/helpers.php';

    if ($_GET == null) {
        $fp = fopen("nosimulation.png", 'rb');
        fpassthru($fp);
        exit();
    }

    $taskId = $_GET["taskId"];

    $db = connectToDB();
    $response = $db->query("SELECT * FROM task WHERE STATE=1 AND ID=$taskId");
    
    //image ready to retrieve?
    if (isset($response) && $response->num_rows > 0) {
        $row = $response->fetch_array();
        $imageData = $row['DATA'];
        $image = imagecreatefromstring($imageData);
        imagepng($image);
        imageDestroy($image);
        
        //delete task
        $db->query("DELETE FROM task WHERE ID=$taskId");
    }
    else {
        $fp = fopen("nosimulation.png", 'rb');
        fpassthru($fp);
    }
    $db->close();
?>
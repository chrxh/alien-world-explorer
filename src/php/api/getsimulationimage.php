<?php
    header("Content-type: image/png");
    session_start();

    require './lib/helpers.php';

    $sessionId = session_id();
    $imageFileName = "cache\\alien_$sessionId.png";

    //no parameters? => show blank image
    if($_GET == null) {
        $image = imagecreatetruecolor(3, 1);
        $blue = imagecolorallocate($image, 0x13, 0x2e, 0x7e);
        imagefill($image, 0, 0, $blue);
        imagepng($image);
        imageDestroy($image);
        exit();
    }

    $db = connectToDB();

    $simulationId = $_GET["simulationId"];
    $response = $db->query("SELECT * FROM task WHERE STATE=1 AND SIMULATION_ID=$simulationId");
    //image ready to retrieve?
    if ($response->num_rows > 0) {

        $row = $response->fetch_array();
        $imageData = $row['DATA'];
        $image = imagecreatefromstring($imageData);
        imagepng($image, $imageFileName);
        imagepng($image);
        imageDestroy($image);
        
        //delete task
        $id = $row['ID'];
        $db->query("DELETE FROM task WHERE ID=$id");
    }

    //make request
    else {

        //no request already made?
        $request= $db->query("SELECT * FROM task WHERE STATE=0 AND SIMULATION_ID=$simulationId");
        if ($request->num_rows == 0) {
          
            //make request
            $posX = $_GET["posX"];
            $posY = $_GET["posY"];
            $sizeX = $_GET["sizeX"];
            $sizeY = $_GET["sizeY"];
        
            $db->query("INSERT INTO task (ID, SIMULATION_ID, SESSION_ID, STATE, POS_X, POS_Y, SIZE_X, SIZE_Y, DATA) VALUES (NULL, $simulationId, '$sessionId', 0, $posX, $posY, $sizeX, $sizeY, NULL)");
        }

        //image in cache? => stream the image directly from the cachefile
        if(file_exists($imageFileName)) {
            $fp = fopen($imageFileName, 'rb');
            fpassthru($fp);
        }
        else {
            $image = imagecreatetruecolor(3, 1);
            $blue = imagecolorallocate($image, 0x13, 0x2e, 0x7e);
            imagefill($image, 0, 0, $blue);
            imagepng($image);
            imageDestroy($image);
        }
    }
    $db->close();
?>
<?php
    const MAX_TIME_FOR_INACTIVITY = 60; 

    function connectToDB()
    {
        $db = new mysqli("localhost", "root", "", "alien");
        if ($db->connect_error) {
            exit("Connection error: " . mysqli_connect_error());
        }
        return $db;
    }

    function isSimulationActiveAndInactivateIfTokenExpired($simId, $db)
    {
        $response = $db->query("SELECT sim.TOKEN as token, sim.LAST_UPDATE as lastUpdate FROM simulation sim WHERE sim.ID=$simId");

        if ($response == null) {
            $db->close();
            exit();
        }
        $obj = $response->fetch_object();
        if ($obj == null) {
            $db->close();
            exit();
        }
    
        if ($obj->token == null) {
            return false;
        }
        
        $date = new DateTime();
        $currentTimestamp = $date->getTimestamp();
        $lastUpdateTimestamp = strtotime($obj->lastUpdate);
        if ($currentTimestamp - $lastUpdateTimestamp > MAX_TIME_FOR_INACTIVITY) {
            $db->query("UPDATE simulation SET TOKEN=NULL WHERE simulation.ID = " . $simId);
            return false;
        }
        else {
            return true;
        }
    }

    function isTokenValid($simId, $token, $db)
    {
        $response = $db->query("SELECT sim.TOKEN as token, sim.LAST_UPDATE as lastUpdate FROM simulation sim WHERE sim.ID=$simId");
        if ($response == null) {
            $db->close();
            exit;
        }
        $obj = $response->fetch_object();
        if ($obj == null) {
            $db->close();
            exit;
        }
        $date = new DateTime();
        $currentTimestamp = $date->getTimestamp();
        $lastUpdateTimestamp = strtotime($obj->lastUpdate);
        if ($currentTimestamp - $lastUpdateTimestamp > MAX_TIME_FOR_INACTIVITY) {
            return false;
        }
        return $obj->token === $token;
    }

    function updateToken($simId, $db)
    {
        $db->query("UPDATE simulation SET LAST_UPDATE=CURRENT_TIMESTAMP WHERE ID = " . $simId);
    }
?>
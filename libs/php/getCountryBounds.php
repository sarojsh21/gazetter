<?php


$executionStartTime = microtime(true);
$countryBorders = json_decode(file_get_contents("libs/php/countries/countries_large.geo.json"), true);
$border = null;
foreach ($countryBorders['features'] as $feature) {
    if ($feature["properties"]["ISO_A3"] ==  $_REQUEST['iso3']) { 
        $border = $feature;
        break;
    }
}
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $border;
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($output);
?>


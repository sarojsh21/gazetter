<?php

$city = filter_input(INPUT_GET, 'city');

if (!isset($city)) {
    echo 'Error: city is is unknown';
    die();
}

require_once './apiKeys.php';


$url = 'http://api.geonames.org/wikipediaSearchJSON?formatted=true&q=' . 
        urlencode($city) . '&username=' . $GEONAMES_USERNAME;

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['data']['title'] = $decode['geonames'][0]["title"];
$output['data']['summary'] = $decode['geonames'][0]["summary"];
header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
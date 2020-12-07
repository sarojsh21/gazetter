<?php

$lat = filter_input(INPUT_GET, 'lat');
$lon = filter_input(INPUT_GET, 'lon');

if (!isset($lat) || !isset($lon)) {
    echo 'Error: lat or lon is is unknown';
    die();
}

require_once './apiKeys.php';

$url = 'https://api.opencagedata.com/geocode/v1/json?q=' . 
        $lat . '+' . $lon . '&key=' . $OPENCAGEDATA_API_KEY;

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['data']['country'] = $decode["results"][0]["components"]["country"];
$output['data']['currency'] = $decode["results"][0]["annotations"]["currency"]["name"];
$output['data']['symbol'] = $decode["results"][0]["annotations"]["currency"]["symbol"];
$output['data']['subunit'] = $decode["results"][0]["annotations"]["currency"]["subunit"];
$output['data']['smallest_denomination'] = $decode["results"][0]["annotations"]["currency"]["smallest_denomination"];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

<?php

$country = filter_input(INPUT_GET, 'country');

if (!isset($country)) {
    echo 'Error: country is is unknown';
    die();
}

require_once './apiKeys.php';

$url = 'https://api.opencagedata.com/geocode/v1/json?q=' . 
        urlencode($country) . '&key=' . $OPENCAGEDATA_API_KEY;

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";

$output['data']['lat'] = $decode["results"][0]["geometry"]["lat"];
$output['data']['lon'] = $decode["results"][0]["geometry"]["lng"];
$output['data']['northeast_lat'] = $decode["results"][0]["bounds"]["northeast"]["lat"];
$output['data']['northeast_lon'] = $decode["results"][0]["bounds"]["northeast"]["lng"];
$output['data']['southwest_lat'] = $decode["results"][0]["bounds"]["southwest"]["lat"];
$output['data']['southwest_lon'] = $decode["results"][0]["bounds"]["southwest"]["lng"];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

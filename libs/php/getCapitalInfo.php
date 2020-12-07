<?php

$country = filter_input(INPUT_GET, 'country');

if (!isset($country)) {
    echo 'Error: country is is unknown';
    die();
}

require_once './apiKeys.php';

$url = 'https://restcountries.eu/rest/v2/name/' . 
        urlencode($country);

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";

$output['data']['capital'] = $decode[0]["capital"];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

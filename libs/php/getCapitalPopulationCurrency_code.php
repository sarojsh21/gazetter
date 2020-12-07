<?php

$countryName = filter_input(INPUT_GET, 'countryName');

if (!isset($countryName)) {
    echo 'Error: country name is is unknown';
    die();
}


$url = 'https://restcountries.eu/rest/v2/name/' . $countryName;

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);



$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['data']['capital'] = $decode[0]['capital'];
$output['data']['population'] = $decode[0]['population'];
$output['data']['area'] = $decode[0]['area'];
$output['data']['currency_code'] = $decode[0]['currencies'][0]['code'];
$output['data']['alpha2code'] = $decode[0]['alpha2Code'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
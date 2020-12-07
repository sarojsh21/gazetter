<?php

$capital = filter_input(INPUT_GET, 'capital');

if (!isset($capital)) {
    echo 'Error: capital is is unknown';
    die();
}

require_once './apiKeys.php';


$url = 'https://api.openweathermap.org/data/2.5/weather?q=' . 
        $capital . '&appid=' . $OPENWEATHER_API_KEY;

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['data']['main'] = $decode["weather"][0]["main"];
$output['data']['description'] = $decode["weather"][0]["description"];
$output['data']['icon'] = $decode["weather"][0]["icon"];
$output['data']['temp'] = $decode["main"]["temp"];
$output['data']['feels_like'] = $decode["main"]["feels_like"];
$output['data']['humidity'] = $decode["main"]["humidity"];
$output['data']['pressure'] = $decode["main"]["pressure"];
$output['data']['wind'] = $decode["wind"]["speed"];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
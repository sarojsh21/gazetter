<?php

require_once './apiKeys.php';

$currencyCode = filter_input(INPUT_GET, 'currencyCode');

$url = 'https://openexchangerates.org/api/latest.json?app_id=' . $OPENEXCHANGERATES_API_KEY;

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['data']['rate'] = $decode['rates'][$currencyCode];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);


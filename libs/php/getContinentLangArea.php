<?php

$lang = filter_input(INPUT_GET, 'lang');
$country = filter_input(INPUT_GET, 'country');

if (!isset($lang) || !isset($country)) {
    echo 'Error: lang or country is is unknown';
    die();
}

require_once './apiKeys.php';



$url = 'http://api.geonames.org/countryInfoJSON?formatted=true&lang=' . 
        $lang . '&country=' .
        $country . '&username=' . 
        $GEONAMES_USERNAME . '&style=full';

//echo ' Here: ' . $url;

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);



curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['data']['continent'] = $decode['geonames'][0]['continent'];
$output['data']['languages'] = $decode['geonames'][0]['languages'];
$output['data']['area'] = $decode['geonames'][0]['areaInSqKm'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
?>

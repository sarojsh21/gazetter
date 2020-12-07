// Default coordinates if user's browser does not allow geolocation.
const default_lat = 51.505, default_lng = -0.09;

var latitude, longitude;
var nam = '';
var continent = '';
var capital = '';
var languages = '';
var population = '';
var area = '';
var currency = '';
var currency_code = '';
var symbol = '';
var subunit = '';
var smallestDenom = '';
var curExchRate = '';
var curWeather = '';
var temp = '';
var humidity = '';
var pressure = '';
var wind = '';
var wiki = '';
var country = '';
var countryAlpha2Code = '';
var city='';
var latitude1, longitude1;

// to fit bounds in the map
var countryLat = '';
var countryLon = '';
var northEastLat = '';
var northEastLon = '';
var northWestLat = '';
var northWestLon = '';

var bounds = [];

var mymap;

$(document).ready(function () {

    $.ajax({
        url: "libs/php/getCountries.php",
        type: 'POST',
        dataType: 'json',

        success: function (result) {

            if (result.status.name === "ok") {

                var countries = result.data.countries;
                
                countries.sort(function(c1, c2) {
                    var a = c1.properties.name;
                    var b = c2.properties.name;
                   return (a < b) ? -1 : (a > b) ? 1 : 0;
                });

                for (var i = 0; i < countries.length; i++) {

                    var countryName = countries[i]['properties']['name'];

                    $('#sel-country').append('<option value="' + countryName + '">' + countryName + '</option>');
                }
				
                loadCurrentCountry();
				
				 // Only after all country names have been loaded
                // successfully into drop down list.
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // your error code
            console.log("not ok: " + errorThrown + " " + jqXHR + " " + textStatus);
        }
    });

    // Listener on 'run' button.
    $('#sel-country').change(function ()
    {
         country = $('#sel-country').val();
        console.log(country + " <= country");
		
        updateCapital();
		//updateMap();
    });
    
    $('#btnInfo').click(function ()
    {

        displayInfo();
		
    });
});

function updateCapital() {
    $.ajax({
        url: "libs/php/getBoundsByCountry.php?country=" + country,
        type: 'GET',
        dataType: 'json',
        success: function (result) {

            if (result.status.name === "ok") {

                latitude = result.data['lat'];
                longitude = result.data['lon'];
				

                updateCountryCurrency();

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // your error code
            console.log("updateCountryBounds: " + errorThrown + " " + jqXHR + " " + textStatus);
        }
    });
}


function updateCountryCurrency() {

    $.ajax({
        url: "libs/php/getCountryCurrency.php?lat=" + latitude + "&lon=" + longitude,
        type: 'GET',
        dataType: 'json',
        success: function (result) {
			console.log(latitude);
				console.log(longitude);

            if (result.status.name === "ok") {

                country = result.data['country'];
				//city = result.data['city'];
                currency = result.data['currency'];
                symbol = result.data['symbol'];
                subunit = result.data['subunit'];
                smallestDenom = result.data['smallest_denomination'];
				console.log(result.data);

                updateCountryBounds();
				//updatecity();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // your error code
            console.log("updateCountryCurrency: " + errorThrown + " " + jqXHR + " " + textStatus);
        }
    });
}

function updateCountryBounds() {

    console.log("c: " + country);

    $.ajax({
        url: "libs/php/getBoundsByCountry.php?country=" + country,
        type: 'GET',
        dataType: 'json',
        success: function (result) {
			

            if (result.status.name === "ok") {

                countryLat = result.data['lat'];
                countryLon = result.data['lon'];
				
                northEastLat = result.data['northeast_lat'];
                northEastLon = result.data['northeast_lon'];
                northWestLat = result.data['southwest_lat'];
                northWestLon = result.data['southwest_lon'];
				
				
				//console.log(nam);
				//updatecity();
				//updateMap();
                updateCapitalPopulationCurrencyCode();
				//console.log(countryLat);
				//console.log(countryLon);

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // your error code
            console.log("updateCountryBounds: " + errorThrown + " " + jqXHR + " " + textStatus);
        }
    });
}



function updateCapitalPopulationCurrencyCode() {
    console.log("Country: " + country);
    $.ajax({
        url: "libs/php/getCapitalPopulationCurrency_code.php?countryName=" + country,
        type: 'GET',
        dataType: 'json',
        success: function (result) {

            if (result.status.name === "ok") {

                capital = result.data['capital'];
                population = formatPopulation(result.data['population']);
				area = formatArea(result.data['area']);
                currency_code = result.data['currency_code'];
                countryAlpha2Code = result.data['alpha2code'];
console.log(countryAlpha2Code);
				//updateMap();
                updateContinentLanguagesArea();
				updatecity();
				
				
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // your error code
            console.log("updateCapitalPopulationCurrencyCode: " + errorThrown + " " + jqXHR + " " + textStatus);
        }
    });
}
function formatArea(num){
    let area = Number(num).toPrecision();
    if(area/1000000 > 1){
        return `${(area/1000000).toFixed(2)} mln`;
    }else if(area/1000 > 1) {
        return `${(area/1000).toFixed(2)} k`
    }else {
        return `${area}`;
    }
}
function formatPopulation(num){
				let pop = parseInt(num);
				console.log(num);
				if(pop/1000000 > 1){
					return (pop/1000000).toFixed(2) + "mln";
				}else if(pop/1000 > 1){
					return (pop/1000).toFixed(2) + "k";
				}else {
					return pop.toFixed();
				}
			}

function updateContinentLanguagesArea() {

    $.ajax({
        url: "libs/php/getContinentLangArea.php?lang=en&country=" + countryAlpha2Code,
        type: 'GET',
        dataType: 'json',
        success: function (result) {

            if (result.status.name === "ok") {

                continent = result.data['continent'];
                languages = result.data['languages'];
                area =  formatArea(result.data['area']);
				console.log(area);
                updateExchangeRate();

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // your error code
            console.log("updateContinentLanguagesArea: " + errorThrown + " " + jqXHR + " " + textStatus);
        }
    });
}

function updateExchangeRate() {
    $.ajax({
        url: "libs/php/getExchangeRate.php?currencyCode=" + currency_code,
        type: 'GET',
        dataType: 'json',
        success: function (result) {
			console.log(currency_code);
            if (result.status.name === "ok") {

                 curExchRate = result.data['rate'];
				
                updateWeather();
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // your error code
            console.log("updateContinentLanguagesArea: " + errorThrown + " " + jqXHR + " " + textStatus);
        }
    });
}

function updateWeather() {
    $.ajax({
        url: "libs/php/getWeather.php?capital=" + capital,
        type: 'GET',
        dataType: 'json',
        success: function (result) {

            if (result.status.name === "ok") {

                curWeather = result.data['main'] + ", " + result.data['description'] +
                        ", " + "<img src='https://openweathermap.org/img/w/" + result.data['icon'] + ".png' />";
                var kelv = result.data['temp'];
                var kelvFeelsLike = result.data['feels_like'];
                temp =  kelvToCels(result.data['temp']) ;
				console.log(temp);
                humidity = result.data['humidity'];
                pressure = result.data['pressure'];
                wind = result.data['wind'];
				
                 updateCountryFeatures();
				 updateMap();

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // your error code
            console.log("updateContinentLanguagesArea: " + errorThrown + " " + jqXHR + " " + textStatus);
        }
    });
}


function updateWiki() {
    $.ajax({
        url: "libs/php/getWikiLink.php?city=" + capital,
        type: 'GET',
        dataType: 'json',
        success: function (result) {

            if (result.status.name === "ok") {

               if (result.data['title'] === capital) {
						
                        wiki = result.data['summary'];
						console.log(wiki);
                        
							
                   }
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // your error code
            console.log("updateContinentLanguagesArea: " + errorThrown + " " + jqXHR + " " + textStatus);
        }
    });
}


function loadCurrentCountry() {

    // Make sure navigator works.
    if (navigator.geolocation) {

        // Make a request for a current position of user.
         var a = navigator.geolocation.getCurrentPosition(function (position) {
			console.log(a);
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
			console.log(latitude);
			console.log(longitude);

            updateCountryCurrency();
			//updatecity();

        },
//                // Case when geolocation is not available.
                function (error) {

                    // Display modal with error.
                    document.getElementById("modal-wa-info").innerHTML = "Geolocation Problem: default location is used";
                    document.getElementById("modal-body-info").innerHTML = error.message;
                    $('#modal-info').modal('show');

                    // Set timeout 3 seconds while modal error being displayed.
                    setTimeout(function () {

                        latitude = default_lat;
                        longitude = default_lng;

                        // Use default coordinates.
						//updatecity();
                        updateCountryCurrency();
						//updateMap();

                    }, 3000); // Wait for 3 seconds to allow the user seeing error message in
                    // case the browser does not allow geolocation.
                });
    }
}

function updateCountryFeatures() {
    $.ajax({
        url: "libs/php/getCountryBounds.php",
        type: 'POST',
        dataType: 'json',
        data: {
            iso3: countryAlpha2Code
        },
        success: function(result) {
            console.log(result);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("updateCountryFeatures: " + errorThrown + " " + jqXHR + " " + textStatus);
        }
    });
}
function updatecity() {
    $.ajax({
        url: "libs/php/getCoordsByCity.php?city=" + capital,
        type: 'GET',
        dataType: 'json',
        success: function (result) {

            if (result.status.name === "ok") {

                latitude = result.data['lat'];
				longitude = result.data['lon'];

                console.log(result.data);
				//console.log(longitude);
				updateMap();
				updateWiki();
				
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // your error code
            console.log(" " + errorThrown + " " + jqXHR + " " + textStatus);
        }
    });
}

function updateMap() {

    if (mymap !== undefined) {
        mymap.remove();
    }

    // Taken from leaflet tutorial: https://leafletjs.com/examples/quick-start/
    mymap = L.map('mapid', {
				zoomControl: false}).setView([latitude, longitude], 13);
     L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox/streets-v11',
                    tileSize: 512,
                    zoomOffset: -1,
                    accessToken: 'pk.eyJ1Ijoic3RhbGxpbnMiLCJhIjoiY2tnNmJrNXE4MTI5cDJ3bDYwcHR6cWFjZSJ9.CHPgjfHh1z3n-QVTjAb9pg'
                }).addTo(mymap);
				
    var southWestBounds = new L.LatLng(northEastLat, northEastLon),
            northEastBounds = new L.LatLng(northWestLat, northWestLon),
            boundCoords = new L.LatLngBounds(southWestBounds, northEastBounds);

    mymap.fitBounds(boundCoords);

    // Add geo json with coordinates of all countries to map.

    geojson = L.geoJson(bounds, {
        style: style,
        onEachFeature: onEachFeature
    }).addTo(mymap);
	console.log(bounds);
    var marker = L.marker([latitude, longitude]).addTo(mymap).bindPopup(""+capital).openPopup();
	console.log(marker);
	console.log(latitude);
	
    
    
    //displayInfo();
//	updateWiki();

}

function style() {
    return {
        weight: 2,
        opacity: 1,
        color: 'lightblue',
        dashArray: '3',
        fillOpacity: 0.3,
        fillColor: 'green'
    };
}

// Method to highlight country by click or over.
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// Helper function to highlight country with the specific bound color.
function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
		opacity: 0.3,
        color: 'red',
        dashArray: '',
        fillOpacity: 0.3
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

// Helper method to reset highlight on mouse out.
function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

// Helper method to fit bounds to display zoom properly on mouse click.
function zoomToFeature(e) {
    mymap.fitBounds(e.target.getBounds());
}

function displayInfo() {
    // Afte that, build string 'body' with html code to add
    // to the modal.
	var lower = countryAlpha2Code.toLowerCase();
	var flag = setFlag(lower);
    var capi = "<b>" + capital + "</b>";
    var curr =  currency_code ;
    var conti = "<p>" + continent + "</p>";
    var small = "<p>" + smallestDenom + "</p>";
    var pop = "<p>" + population + "</p>";
    var ar =  area + " km<sup>2</sup>";
	var exchange = "USD/"+curr+" XR:";
	//var msg = document.createTextNode("USD/" +curr+ " XR:");
    var currencyxan = "<p>" + curExchRate + "</p>";
    var weather = "<p>" +
            curWeather + "</p>";
    var tempera = "<p>" + temp +
             "</p>";
			 console.log(tempera);
    var humi = "<p>" + humidity + "%</p>";
    var press = "<p>" + pressure + " hPa</p>";
    var wi = "<p>" + wind + " kts</p>";
	
	console.log(wiki);
	$('#continent').html(conti);
	//$('#txtContinent').html(continent);
    $('#capital').html(capital);
    //$('#txtLanguages').html(languages);
    $('#population').html(population);
    /*$('#txtArea').html(area);
    $('#txtCurrency').html(currency);
    $('#txtSymbol').html(symbol);
    $('#txtSubunit').html(subunit);
    $('#txtSmallestDenomination').html(smallestDenom);
    $('#txtCurExchRate').html(curExchRate);
    $('#txtCurWeather').html(curWeather);
    $('#txtTemperature').html(temp);
    $('#txtHumidity').html(humidity);
    $('#txtPressure').html(pressure);*/
    //'#wiki').html(wik);
	document.getElementById("country-name").innerHTML = country;
	//document.getElementById("country_flag").innerHTML = flag;
	document.getElementById("capital").innerHTML = capi;
	document.getElementById("currency").innerHTML = curr;
	//document.getElementById("continent").innerHTML = conti;
	document.getElementById("small").innerHTML = small;
	//document.getElementById("population").innerHTML = pop;
	document.getElementById("area").innerHTML = ar;
	document.getElementById("exchangeTitle").innerHTML = exchange;
	document.getElementById("currencyxan").innerHTML = currencyxan;
	document.getElementById("weather").innerHTML = weather;
	document.getElementById("temperature").innerHTML = tempera;
	document.getElementById("humidity").innerHTML = humi;
	document.getElementById("pressure").innerHTML = press;
	document.getElementById("wind").innerHTML = wi;
	document.getElementById("wiki").innerHTML = wiki;
    // Finally, display modal.
    $('#modal-info').modal('show');
}

// Helper function to convert temperature in kelving to celsius.
function kelvToCels(kelv) {
    var res = kelv - 273.15;
    return parseInt(res, 10) + '\xB0C';
}

function kelvToFahr(kelv) {
    var res = ((kelv - 273.15) * 1.8) + 32;
    return parseInt(res, 10) + '\xB0F';
}

function setFlag(count) {
				$('#flag').html("<img src='https://flagcdn.com/56x42/"+count+".png'>");
			}
			
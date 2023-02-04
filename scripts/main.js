let mode = 'f';

function requestHandler(url, resolve, reject) {
    let request = new XMLHttpRequest();

    request.open('GET', url);

    request.onload = function () {
        if (request.status === 200) {
            resolve(request.response);
        } else {
            reject(Error(request.statusText));
        }
    };

    // Handle network errors
    request.onerror = function () {
        reject(Error('Network Error!!!'));
    };

    request.send();
}


function getCoordinates(freeFormAddress) {
    return new Promise((resolve, reject) => {
        let apiEndpoint = 'https://geocode.maps.co/search';
        let getCoordinatesUrl = `${apiEndpoint}?q=${freeFormAddress.replace(' ', '+')}`;

        requestHandler(getCoordinatesUrl, resolve, reject)
    });
}


function getWeather(lat, long) {
    return new Promise((resolve, reject) => {
        let apiEndpoint = 'https://api.open-meteo.com/v1/forecast';
        let getWeatherUrl = `${apiEndpoint}?latitude=${lat}&longitude=${long}&current_weather=true`;

        requestHandler(getWeatherUrl, resolve, reject)
    });
}


function initGetWeatherButton() {
    let weatherTextNode = document.querySelectorAll('.weather-text')[0];
    let locationInputNode = document.querySelectorAll('.location-input')[0];
    let getWeatherButtonNode = document.querySelectorAll('.get-weather')[0];
    let coordinates = null;
    let currentWeatherC = null;
    let currentWeatherF = null;

    getWeatherButtonNode.addEventListener('click', e => {
        let location = locationInputNode.value;

        if (location !== '') {
            weatherTextNode.textContent = `Loading..`;
            getCoordinates(location).then( responseString => {
                let response = eval(responseString);
                coordinates = {
                    lat: response[0]['lat'],
                    long: response[0]['lon']
                };
                return getWeather(coordinates.lat, coordinates.long);
            }).then( responseString => {
                let response = JSON.parse(responseString);
                currentWeatherC = response['current_weather']['temperature'];
                currentWeatherF = (response['current_weather']['temperature'] * 9 / 5) + 32;

                if (mode === 'f') {
                    weatherTextNode.textContent = `${currentWeatherF} ℉` ;
                } else {
                    weatherTextNode.textContent = `${currentWeatherC} ℃`;
                }

            }).catch( e => {
                weatherTextNode.textContent = `ERROR`;
            });
        }
    });
}


function initTempUnitButtons() {
    let fahrenheitButton = document.querySelectorAll('.fahrenheit')[0];
    let celsiusButton = document.querySelectorAll('.celsius')[0];

    fahrenheitButton.addEventListener('click', e => {
        mode = 'f';
        celsiusButton.classList.remove('toggled');
        fahrenheitButton.classList.add('toggled');
    });

    celsiusButton.addEventListener('click', e => {
        mode = 'c';
        fahrenheitButton.classList.remove('toggled');
        celsiusButton.classList.add('toggled');
    });
}


initGetWeatherButton();
initTempUnitButtons();

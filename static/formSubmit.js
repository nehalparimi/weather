document.addEventListener('DOMContentLoaded', function() {

    (function submitForm() {    
        let form = document.querySelector('#forecast-form');
        let mainDiv = document.querySelector("#weather-form-div");
        let resultDiv = document.querySelector('#result-div');
        let input = document.querySelector('#city-input');
        form.addEventListener('submit', function(event) {

            event.preventDefault();
            // Grab city value
            let city = input.value;
            console.log(city);

            // new xhr
            let xhr = new XMLHttpRequest;
            let url = '/forecast/' + city;
            console.log('URL: ', url)

            xhr.open('GET', url, true);
            xhr.responseType = 'json';
            xhr.onload = function() {
                if (xhr.status !== 200) {
                    console.log('Error, wrong request', xhr.status);
                }
                if (xhr.status === 200 && xhr.readyState === 4) {
                    // Changing the old stuff
                    mainDiv.style.display = 'none';

                    // city and country:
                    let cityName = document.createElement('h2');
                    // cityName.innerHTML = xhr.response[0].city;
                    // document.body.appendChild(cityName);

                    // Temperatures:
                    let weatherList = document.createElement('ul');
                    let item;
                    xhr.response.forEach(obj => {
                        item = document.createElement('li');
                        // check if day is returned
                        item.innerHTML = `${obj.day}: ${Math.round(obj.low)} -- ${Math.round(obj.high)} &#8457;`;
                        weatherList.appendChild(item);
                    });
                    resultDiv.appendChild(weatherList);
                    let backLink = document.createElement('a');
                    backLink.href = '/forecast';
                    backLink.innerHTML = '< Back';
                    resultDiv.insertAdjacentElement('afterend', backLink);
                }
            }
            xhr.onerror = function() {
                console.log('Error')
            }
            xhr.send();
        });
    })();
});
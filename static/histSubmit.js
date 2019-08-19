document.addEventListener('DOMContentLoaded', function() {

    (function histSubmit() {

        let form = document.querySelector('#time-machine-weather');

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            // City
            let cityInput = document.querySelector('#input-weather-city');
            let city = cityInput.value;

            // Date
            let dateInput = document.querySelector('#input-weather-date');
            let date = dateInput.value;
            let url = 'history/' + city + ',' + date;

            xhrRequest(url, 'GET', true);

        })
    })();

    function xhrRequest(url, method, async=true) {
        let xhr = new XMLHttpRequest;
        xhr.open(method, url, async);
        xhr.onload = function() {
            if (xhr.status !== 200) {
                console.log('Error: ', xhr.status);
            }
            if (xhr.status === 200 && xhr.readyState === 4) {
                let div = document.querySelector('div');
                div.innerHTML = xhr.response;
            }
        };
        xhr.onerror = function() {
            console.log('Error')
        }
        
        xhr.send();
    }
})
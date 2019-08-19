document.addEventListener('DOMContentLoaded', function() {
    
    (function() {
        let button = document.querySelector('button');
        console.log('yes')
        button.addEventListener('click', function() {
            let key = '4edf8e1353514fb7b9c342895319976f';
            let xhr = new XMLHttpRequest;
            let url = `https://api.opencagedata.com/geocode/v1/json?q=paris&key=${key}`;
            xhr.open('GET', url, true);
            xhr.send();
            xhr.onload = function() {
                if (xhr.status == 200 && xhr.readyState == 4) {
                    let h1 = document.createElement('h1');
                    h1.innerHTML = 'Succès !';
                    document.body.appendChild(h1);
                    console.log('success')
                }
            }
            xhr.onerror = function() {
                console.log('Erreur');
            }
        });
    })();
});
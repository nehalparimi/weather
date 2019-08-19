let https = require('https');

function geoloc(city, key) {
    return new Promise((resolve, reject) => {
        let requestURL = `https://api.opencagedata.com/geocode/v1/json?q=${city}&key=${key}`;
        let cityInfo, error;

        https.get(requestURL, (res) => {
            let { statusCode } = res;
            if (statusCode !== 200) {
                error = new Error('Request Failed: ' + statusCode);
            }
            let raw = '';
            res.on('data', (chunk) => raw += chunk);
            res.on('end', () => {
                let retObj;
                try {
                    cityInfo = JSON.parse(raw).results[0];
                    retObj = {
                        'city': cityInfo.components.city,
                        'country': cityInfo.components.country,
                        'continent': cityInfo.components.continent,
                        'lat': cityInfo.geometry.lat,
                        'lng': cityInfo.geometry.lng,
                    };
                }
                catch(e) {
                    reject(e);
                }
                resolve(retObj);
            })
        }).on('error', (e) => {
            console.error(`Got error: ${e}`);
        });
    });
}
module.exports = geoloc;

// Instead of returning a Promise.resolve(obj)
// We're returning an entire promise with resolve and reject in the first place
// Let's see how this works
// Make an alternate function that DOESN'T, this time, 
// wrap the entire http request in a promise, and just returns a promise.resolve
// As I did last time, and see how that works. This above, wrapping the entire thing
// In a promise worked, as the promise resolved only with HTTP req, and only then, sent data
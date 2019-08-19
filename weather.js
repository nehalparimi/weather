let https = require('https');

function getWeather(key, lat, lng, time) {
    return new Promise(function(resolve, reject) {    
        let requestURL = `https://api.darksky.net/forecast/${key}/${lat},${lng}`;
        if (time) requestURL += ',' + time;
        console.log('WEATHER URL', requestURL);
        https.get(requestURL, (res) => {
            const {
                statusCode
            } = res;
            const contentType = res.headers['content-type'];

            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' +
                    `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' +
                    `Expected application/json but received ${contentType}`);
            }
            if (error) {
                console.error(error.message);
                // Consume response data to free up memory
                res.resume();
                return;
            }
            let raw = '';
            res.on('data', (chunk) => raw += chunk);
            res.on('end', () => {
                let parsedData;
                try {
                    parsedData = JSON.parse(raw);
                } catch (e) {
                    reject(e)
                }
                resolve(parsedData);
            });
        }).on('error', (e) => {
            reject(e);
        });
    })
}
module.exports = getWeather;
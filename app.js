let express = require('express');
let path = require('path');
require('dotenv').config();

let coordinates = require('./coordinates');
let getWeather = require('./weather');
let getDayName = require('./extra/datetoday');

let app = express();

let staticPath = path.resolve(__dirname, "static");
app.use(express.static(staticPath));

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/forecast', function(req, res) {
    res.render('forecast');
});

app.get('/forecast/:city', function(req, res, next) {
    let { city } = req.params;
    coordinates(city, process.env.OCD_API_KEY)
        .then(info => {
            let { lat, lng } = info;
            getWeather(process.env.DARK_SKY_KEY, lat, lng)
                .then(cityData => {
                    // Format citydata to show daily forecast
                   let daily = cityData.daily.data;
                   let ms = 1000*60*60*24;
                   let returnArray = [];
                   
                   for (let i = 0; i < daily.length; i++) {
                       // Date objects have day for display
                       // can we do this with map / for each?
                       daily[i].day = getDayName((new Date(Date.now() + i * ms)).getDay());
                       if (i === 0) {
                           daily[0].day = 'Today';
                       }
                       console.log(cityData);
                       returnArray.push({
                           "high": daily[i].temperatureHigh,
                           "low": daily[i].temperatureLow,
                           "day": daily[i].day,
                           "city": cityData.formatted,
                       });
                   }
                   res.json(returnArray);
                })
                .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
});

app.get('/history', function(req, res, next) {
    res.render('time-machine');
});

app.get('/history/:city,:date', function(req, res, next) {
    let { city, date } = req.params;
    let time = Number(Date.parse(date));
    let obj = {};
    coordinates(city, process.env.OCD_API_KEY)
        .then(info => {
            let {
                lat,
                lng,
                city,
                country, 
                continent
            } = info;
            getWeather(process.env.DARK_SKY_KEY, lat, lng, time)
                .then(cityData => {
                    obj.city = city;
                    obj.country = country;
                    obj.continent = continent;
                    obj.currently = cityData.currently;
                    res.json(obj);
                })
                .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
});

app.use(function(req, res) {
    res.render('404');
});

app.listen(process.env.PORT, function() {
    console.log(`Listening on port ${process.env.PORT}`);
});

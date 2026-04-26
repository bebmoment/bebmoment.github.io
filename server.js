import express from 'npm:express';
import { fetchWeatherApi } from 'npm:openmeteo';
import { CsvParseStream } from '@std/csv/parse-stream';
import cities from './cities.json' with {type: "json"};

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index', {cityname: "", result: "" });
});
app.get('/styles.css', (req, res) => {
    res.sendFile(import.meta.dirname + "/styles.css");
});
app.post('/', async (req, res) => {

    const city = req.body.city;
    const coord = cities[city];

    if (coord === undefined) {
        const result = "Sorry, I don't know what that city is. Try another one?"
        res.render('index', { cityname: "", result: result });
        return
    }

    const params = {
        latitude: coord[0],
        longitude: coord[1],
        current: "temperature_2m"
    }
    const url = "https://api.open-meteo.com/v1/forecast";
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const current = response.current();
    const weatherData = {
	    current: {
		    temperature_2m: current.variables(0).value(),
	    },
    };
    const result = `${Math.round(weatherData.current.temperature_2m)}°C`
    res.render('index', { cityname: city, result: result });
});

app.listen(9000);
console.log("App listening on port 9000");
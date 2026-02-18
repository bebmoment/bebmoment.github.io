async function startServer(port) {
    const fs = await import('node:fs');
    const weather = await import('openmeteo');
    const parse = await import("jsr:@std/csv/parse");
    const bodyParser = await import("npm:body-parser");
    const http = await import('node:http');
    let htmlFile;
    let cssFile;
    fs.readFile('./index.html', (err, data) => {
        if (err) {
            throw err;
        }
        htmlFile = data;
    });
    fs.readFile('./styles.css', (err, data) => {
        if (err) {
            throw err;
        }
        cssFile = data;
    });
    http.createServer(
        (req, res) => {
            const url = req.url;
            const method = req.method;
            switch (url) {
                case "/":
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.write(htmlFile);
                    break;
                case "/styles.css":
                    res.writeHead(200, { 'Content-Type': 'text/css' });
                    res.write(cssFile);
                    break;
                case "/clicked":
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    return res.end("<h1>City</h1>")
                default:
                    res.writeHead(404, {'Content-Type': 'text/plain'})
                    res.write("Error 404 Not Found")
            }
            res.end();
        }
    ).listen(port, () => {
        console.log("Server running on port " + port);
    })
}

// startServer(9000);
import express from 'npm:express';
import { fetchWeatherApi } from 'npm:openmeteo';
import { CsvParseStream } from '@std/csv/parse-stream';

using table = await Deno.open("./worldcities.csv", {read: true});
const csvStream = table.readable.pipeThrough(new CsvParseStream({skipFirstRow: true}));
const cities = await Array.fromAsync(csvStream);
console.log(cities);

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.get('/', (req, res) => {
    res.render('index', { result: "" });
});
app.get('/styles.css', (req, res) => {
    res.sendFile(import.meta.dirname + "/styles.css");
});
app.post('/', (req, res) => {
    const city = req.body.city;
    console.log(city);
    const result = "you did it"
    res.render('index', { result });
});

app.listen(9000);
console.log("App listening on port 9000");
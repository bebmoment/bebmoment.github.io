import express from 'express'
const app = express();
import ejs from 'ejs';
app.set('view engine', 'ejs');

app.get('/', (req, res) => res.render('index'));
app.get('/about', (req, res) => res.render('about'))
app.get('/store', (req, res) => res.render('store'))

app.listen(3000, console.log('Express server initalized'));
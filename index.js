
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
const app = express()


app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())
app.use(helmet())
dotenv.config()

app.get('/', function (req, res) {
    const msg = `
    <h1>Wellcome to the weather API</h1>
    <div> GET /forecast?lat=XXX&lon=XXX <a href="/forecast?lat=41.3879&lon=2.16992">Example</a></div>
    <div> GET /forecast/CITY_NAME <a href="/forecast/London">Example</a></div>
    <hr>
    <div className='mention'>Powered by <a href="https://rapidapi.com/">RapidAPI.com</a></div>
    `
    res.send(msg);
});

app.get('/forecast', async (req, res) => {
    const { lat, lon } = req.query;
    const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?days=5&q=${lat},${lon}`
    const data = await fetchWeather(url)
    res.json(data)
})

app.get('/forecast/:location', async (req, res) => {
    const { location } = req.params;
    const url = 'https://weatherapi-com.p.rapidapi.com/forecast.json?days=5&q=' + location
    const data = await fetchWeather(url)
    res.json(data)
})


async function fetchWeather(url) {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': process.env.RapidAPIHost,
            'X-RapidAPI-Key': process.env.RapidAPIKey
        }
    };
    const response = await fetch(url, options)
    const data = await response.json()
    const toSend = data;
    try {
        toSend.current.condition.condition_spanishDayText = weatherConditions.find(c => c.code === data.current.condition.code).languages[0].day_text
        toSend.current.condition.condition_spanishNightText = weatherConditions.find(c => c.code === data.current.condition.code).languages[0].night_text
    } catch (e) {
        console.log(e)
    }
    return toSend;
}



async function preLoadWeatherConditions() {
    const url = 'https://www.weatherapi.com/docs/conditions.json'
    const response = await fetch(url)
    const data = await response.json()
    const spanishTraductions = data.map(a => ({ ...a, languages: a.languages.filter(l => l.lang_name === 'Spanish') }))
    return spanishTraductions
}


const weatherConditions = await preLoadWeatherConditions()
const run = async () => {
    await app.listen(process.env.PORT || 4000)
    console.log(`Server starter on port ${process.env.PORT}`)
}
run().catch(error => console.log('Error to start:' + error))

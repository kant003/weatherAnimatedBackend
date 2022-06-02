
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
    res.send('Wellcome to the weather API');
});

app.get('/RapidAPIHost', function (req, res) {
    res.send(process.env.RapidAPIHost)
});


app.get('/weather', async (req, res) => {
    var ip = req.headers['x-forwarded-for'] ||
        req.socket.remoteAddress ||
        null;
    console.log(req.headers['x-forwarded-for'])
    console.log(req.socket.remoteAddress)
    console.log('ip:', ip)

    /* console.log(req.headers['x-forwarded-for'],
     req.socket.remoteAddress)
*/
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': process.env.RapidAPIHost,
            'X-RapidAPI-Key': process.env.RapidAPIKey
        }
    };
    const url = 'https://weatherapi-com.p.rapidapi.com/current.json?q=' + ip
    const response = await fetch(url, options)
    const data = await response.json()

    const toSend = {
        name: data.location.name,
        country: data.location.country,
        region: data.location.region,
        lat: data.location.lat,
        lon: data.location.lon,
        temp_c: data.current.temp_c,
        is_day: data.current.is_day,
        wind_kph: data.current.wind_kph,
        precip_mm: data.current.precip_mm,
        humidity: data.current.humidity,
        cloud: data.current.cloud,
        condition_text: data.current.condition.text,
        condition_spanishDayText: weatherConditions.find(c => c.code === data.current.condition.code).languages[0].day_text,
        condition_spanishNightText: weatherConditions.find(c => c.code === data.current.condition.code).languages[0].night_text,
        icon: weatherConditions.find(c => c.code === data.current.condition.code).icon,

    }
    res.json(toSend)
})


app.get('/forecast', async (req, res) => {
    const { lat, lon } = req.query;
    console.log(lat, lon)
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': process.env.RapidAPIHost,
            'X-RapidAPI-Key': process.env.RapidAPIKey
        }
    };
    const url = `https://weatherapi-com.p.rapidapi.com/forecast.json?days=5&q=${lat},${lon}`
    const response = await fetch(url, options)
    const data = await response.json()
    const toSend = data;
    try {

        toSend.current.condition.condition_spanishDayText = weatherConditions.find(c => c.code === data.current.condition.code).languages[0].day_text
        toSend.current.condition.condition_spanishNightText = weatherConditions.find(c => c.code === data.current.condition.code).languages[0].night_text
    } catch (e) {
        console.log(e)
    }

    res.json(toSend)

})

app.get('/forecast/:location', async (req, res) => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': process.env.RapidAPIHost,
            'X-RapidAPI-Key': process.env.RapidAPIKey
        }
    };
    const url = 'https://weatherapi-com.p.rapidapi.com/forecast.json?days=5&q=' + req.params.location
    const response = await fetch(url, options)
    const data = await response.json()
    const toSend = data;
    try {
        toSend.current.condition.condition_spanishDayText = weatherConditions.find(c => c.code === data.current.condition.code).languages[0].day_text
        toSend.current.condition.condition_spanishNightText = weatherConditions.find(c => c.code === data.current.condition.code).languages[0].night_text
    } catch (e) {
        console.log(e)
    }   
        /*const toSend = {
            name: data.location.name,
            country: data.location.country,
            region: data.location.region,
            lat: data.location.lat,
            lon: data.location.lon,
            temp_c: data.current.temp_c,
            is_day: data.current.is_day,
            wind_kph: data.current.wind_kph,
            precip_mm: data.current.precip_mm,
            humidity: data.current.humidity,
            cloud: data.current.cloud,
            condition_text: data.current.condition.text,
            condition_spanishDayText: weatherConditions.find(c => c.code === data.current.condition.code).languages[0].day_text,
            condition_spanishNightText: weatherConditions.find(c => c.code === data.current.condition.code).languages[0].night_text,
            icon:weatherConditions.find(c => c.code === data.current.condition.code).icon,
            forecast: data.forecast.forecastday.map(f => ({
                date: f.date,
                day: new Date(f.date_epoch * 1000).getDate(),
                date_epoch: f.date_epoch,
                avgtemp_c: f.day.avgtemp_c,
                icon: f.day.condition.icon,
                hours: f.hour.map(h => ({
                    hour: new Date(h.time_epoch * 1000).getHours(),
                    date: h.time,
                    temp_c: h.temp_c,
                    icon: h.condition.icon,
                }))
            })),
    
            
        }*/
        res.json(toSend)

})
app.get('/weather/:location', async (req, res) => {
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Host': process.env.RapidAPIHost,
            'X-RapidAPI-Key': process.env.RapidAPIKey
        }
    };
    const url = 'https://weatherapi-com.p.rapidapi.com/current.json?q=' + req.params.location
    const response = await fetch(url, options)
    const data = await response.json()

    const toSend = {
        name: data.location.name,
        country: data.location.country,
        region: data.location.region,
        lat: data.location.lat,
        lon: data.location.lon,
        temp_c: data.current.temp_c,
        is_day: data.current.is_day,
        wind_kph: data.current.wind_kph,
        precip_mm: data.current.precip_mm,
        humidity: data.current.humidity,
        cloud: data.current.cloud,
        condition_text: data.current.condition.text,
        condition_spanishDayText: weatherConditions.find(c => c.code === data.current.condition.code).languages[0].day_text,
        condition_spanishNightText: weatherConditions.find(c => c.code === data.current.condition.code).languages[0].night_text,
        icon: weatherConditions.find(c => c.code === data.current.condition.code).icon,

    }
    res.json(toSend)
})





async function preLoadWeatherConditions() {
    const url = 'https://www.weatherapi.com/docs/conditions.json'
    const response = await fetch(url)
    const data = await response.json()
    const spanishTraductions = data.map(a => ({ ...a, languages: a.languages.filter(l => l.lang_name === 'Spanish') }))
    return spanishTraductions
}


const weatherConditions = await preLoadWeatherConditions()
//const weathers = await preLoadWeathers()
//console.log(weatherConditions)
const run = async () => {
    await app.listen(process.env.PORT || 4000)
    console.log('Server starter')
}
run().catch(error => console.log('Error to start:' + error))

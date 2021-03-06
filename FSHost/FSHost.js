const https = require("https");
const async = require("async");

module.exports = {
    getAirport: getAirport,
    init: init
}

var airportMap = new Map();
var Bot;
var queue = async.queue(downloadAirport, 2);

async function init(bot){
    Bot = bot;
}

function downloadAirport(icao, callback){
    if(airportMap.has(icao)) return callback(undefined, airportMap.get(icao));

    let options = {
        host: "fshub.io",
        path: `/api/v3/airport/${icao}`,
        method: "get",
        headers: {
            "X-Pilot-Token": "UkKvvyWAWhWRwZpZQCyUxZFAyg1Z5ZN3rxaDs2edQlSeYqRVX9jgoYleXLwl"
        }
    }

    Bot.log("Retrieving Airport Info: " + icao);

    https.get(options, res =>{
        let body = "";    
    
        res.on("error", err => {
            return callback(err);
        })

        res.on("data", data => {
            body += data;
        });

        res.on("end", () => {
            try{
                body = JSON.parse(body);
            } catch(err) {
                Bot.error(body);
                callback(err);
            }

            airportMap.set(icao, body);
            return callback(undefined, body);
        });
    });
}

/**
 * Get airport information from an internal map, or request the data from FSHub
 * @param {String} icao 
 */
async function getAirport(icao){
    return new Promise((resolve, reject) => {
        queue.push(icao, (err, airport) => {
            if(err) {
                reject(err);
            }
            else resolve(airport);
        });
    });
}
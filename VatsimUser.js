const http = require('http');
const {URL} = require('url');
const newLine = "\u000A";

var options = {
    host: "http://status.vatsim.net",
    path: "/status.txt"
}

var links = [];

const getWebsiteData = async (host, path) => {
    return new Promise((resolve, reject) => {

        data = "";

        if(path == undefined){
            path = "";
        }

        let parsedURL = new URL(host + path);

        http.request(parsedURL , function(res){
            res.on('data', function(chunk){
                data += chunk.toString();
            });

            res.on('end', () => {
                resolve(data);
            });
        }).on('error', (err) => {
            reject(err);
        }).end();
    });
}

var statusData = "";

(async (url, path) => {
    statusData = await getWebsiteData(url, path);

    let lines = statusData.split(newLine);

    for(lineIndex in lines){
        let line = lines[lineIndex];
        if(line.startsWith(";")) continue;
        if(line.startsWith("url0")) {
            let link = line.split("=")[1];
            link = link.replace("\r", "");
            //link = link.replace("http://", "")
            links.push(link);
        };
    }

    let random = Math.round(Math.random() * 3.0);

    let ayyoo = await getWebsiteData(links[random - 1]);
    parseurl0(ayyoo);
    
})(options.host, options.path);
//console.log(await getWebsiteData(url));

function parseurl0(url0){
    let lines = url0.split(newLine);

    let parsePilots = false;

    let pilots = [];

    for(lineIndex in lines){
        let line = lines[lineIndex];
        if(line.startsWith(";")) continue;
        if(line.startsWith("!CLIENTS:")) parsePilots = true;
        if(line.startsWith("!SERVERS:")) parsePilots = false;

        if(parsePilots){
            parsePilotController(line) ? pilots.push(new VatsimPilot(line.split(":"))) : console.log("Not a Pilot");
        }
    }

    for(pilot in pilots){
        console.log(pilots[pilot].callsign);
    }
}

function parsePilotController(line){
    let pilotLine = line.split(":");
    if(pilotLine[3] == undefined) return false;

    return pilotLine[3].indexOf("PILOT") > -1;
}

class VatsimUser {

    // callsign;
    // cid;
    // realName;
    // clientType;
    // latitude;
    // longitude;
    // altitude;
    // plannedTasCruise;
    // server;
    // protrevision;
    // rating;
    // logonTime;

    constructor(inputArray) {
        this.callsign = inputArray[0];
        this.cid = parseInt(inputArray[1]);
        this.realName = inputArray[2];
        this.clientType = inputArray[3];
        this.latitude = parseFloat(inputArray[5]);
        this.longitude = parseFloat(inputArray[6]);
        this.altitude = parseInt(inputArray[7]);
        this.plannedTasCruise = parseInt(inputArray[10]);
        this.server = inputArray[14];
        this.protrevision = parseInt(inputArray[15]);
        this.rating = inputArray[16];
        this.logonTime = parseInt(inputArray[37]);
    }
}

class VatsimPilot extends VatsimUser {

    // groundspeed;
    // plannedAircraft;
    // plannedDepartingAirport;
    // plannedAltitude;
    // plannedDestinationAirport;
    // transponder;
    // plannedRevision;
    // plannedFlightType;
    // plannedDepartTime;
    // ActualDepartTime;
    // plannedHoursEnroute;
    // plannedMinuteEnroute;
    // plannedHoursFuel;
    // plannedMinutesFuel;
    // plannedAlternateAirport;
    // plannedRemarks;
    // plannedRoute;
    // plannedDepartureAirportLat;
    // plannedDepartureAirportLong;
    // heading;
    // QNHhg;
    // QNHmb;

    constructor(inputArray){
        super(inputArray);
        this.groundspeed = parseInt(inputArray[8]);
        this.plannedAircraft = inputArray[9];
        this.plannedDepartingAirport = inputArray[11];
        this.plannedAltitude = parseInt(inputArray[12]);
        this.plannedDestinationAirport = inputArray[13];
        this.transponder = inputArray[14];



    }
}
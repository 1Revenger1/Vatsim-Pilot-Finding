const Discord = require('discord.js');

const Bot = {};
Bot.CommandHandler = require("./Discord/CommandHandler");
Bot.Vatsim = require("./Vatsim/Vatsim");
Bot.FSHost = require("./FSHost/FSHost");

Bot.client = new Discord.Client();

Bot.client.login(""); //Bot Token needed

Bot.error = async function(error){
    console.error(new Date().toISOString() + ": " + error);
}

Bot.log = async function(msg){
    console.log(new Date().toISOString() + ": " + msg);
}

Bot.client.on("ready", async () => {
    Bot.log("Ready event fired!");
    if(Bot.started) return Bot.err("Ready event fired already!");

    Bot.started = true;

    Bot.FSHost.init(Bot);
    Bot.CommandHandler.init(Bot);
    Bot.Vatsim.init(Bot);
});

Bot.client.on("message", async (message) => {
    if(message.channel.type == "dm") return;
    Bot.CommandHandler.handleMessage(message);

    
});

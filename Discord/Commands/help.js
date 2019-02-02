const Discord = require('discord.js');

module.exports = {
	name: "help",
    helpDesc: "Returns Dragonite's commands",
	helpTitle: "Help",
    aliases: ["h"],
    run: async (bot, message, args) => {
		let helpString = "***Pandemic Commands__***\nUse P! or <@" + bot.client.user + "> to call commands\n\n"		

		let generalString = "**__General__**\n";
		let adminString = "**__Administration__**\n";

		bot.commands.forEach(async (value, key, map) => {
			if(value.ignore){
				//Don't do anything	
			} else if(!value.cat || value.cat == "general"){
				generalString += "*" + value.helpTitle + "*: " + value.helpDesc + "\n";
			} else if(value.cat == "admin"){
				adminString += "*" + value.helpTitle + "*: " + value.helpDesc + "\n";
			 }
		});

		helpString += generalString + "\n" + adminString;

		message.channel.send(helpString);
	}
}
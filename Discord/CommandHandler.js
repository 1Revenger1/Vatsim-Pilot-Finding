const Discord = require('discord.js');
const fs = require('fs');
const levels = new Map([
	["Roles", "MANAGE_ROLES"],
	["Guild", "MANAGE_GUILD"],
	["Owner", "Owner"]
]);

module.exports = {
    init: init,
    handleMessage: handleMessage
}

var Bot;

async function init(bot){
    Bot = bot;
    Bot.levels = levels;
    Bot.commands = new Discord.Collection();
    Bot.aliases = new Discord.Collection();

    let commandPromise = new Promise((resolve, reject) => {
        fs.readdir("./Discord/Commands/", (err, files) => {
            if (err) return console.error(err);
            Bot.log("Commands: Loading " + files.length + " commands!");
            files.forEach(file => {
                var name = require(`./Commands/${file}`).name.toLowerCase();
                Bot.commands.set(name, require(`./Commands/${file}`));
                require(`./Commands/${file}`).aliases.forEach(alias => {
                    Bot.aliases.set(alias, name);
                });
            });
    
            resolve("Command load success!");
        });
    }).then((cmdSuccess) => {
        Bot.log(`Commands: ${cmdSuccess}`);
    });
}

async function handleMessage(message){
    let args = message.content.split(" ");
    if(args[0].substring(0, 3) != "P!" && args[0] != message.guild.me.toString())
        return;

    try {
        if(args[0] == message.guild.me.toString()){
            args.shift();
        }
        //Get the command name itself
        var commandArg = args[0].replace("P!", "").toLowerCase();
        
        //Check for aliases, and set commandArg to the full name if there are aliases
        if(Bot.aliases.has(commandArg)) commandArg = Bot.aliases.get(commandArg);

        var command = Bot.commands.get(commandArg);

        if(command == undefined){
            return;
        }

        //Check permissions to make sure the user can run the command
        if(command.permLevel){
            if(command.permLevel == "Owner" && message.member.id != '139548522377641984'){
                message.channel.send("This can only be run by the Bot owner, 1Revenger1");
                return;
            }

            if(!message.member.hasPermission(levels.get(command.permLevel))){
                message.channel.send("This can only be run by someone with the `" + command.permLevel + "` permission");
                return;
            }
        }
        message.channel.startTyping();
        //Run the command
        await command.run(Bot, message, args);

        message.channel.stopTyping();
    } catch (err){
        console.log(err.stack);
        message.channel.stopTyping();
        return;
    }
}
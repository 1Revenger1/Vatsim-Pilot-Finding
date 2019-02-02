const Discord = require('discord.js');
module.exports = {
    name: "eval",
    aliases: [],    
    helpDesc: "Debugging for 1Revenger1",
    helpTitle: "Eval",
    cat: "admin",
    ignore: true,
    permLevel: "Owner",
    run: async (bot, message, args) => {
        var evalArgs = '';
        for(var i = 1; i < args.length; i++){
            evalArgs += args[i] + " ";
        }
        
        try {
          return message.channel.send(`\`\`\`js\n${eval(evalArgs)}\n\`\`\``);
        } catch (e) {
          return message.channel.send(`\`\`\`js\n${e.stack}\n\`\`\``);
        }    
    }
}
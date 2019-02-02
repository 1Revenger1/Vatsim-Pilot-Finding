const Discord = require(`discord.js`);
const prettyMs = require(`pretty-ms`);

module.exports = {
    name: "info",
    aliases: [],    
    helpDesc: "information about FSACTA bot",
    helpTitle: "Info",
    run: async (bot, message, args) => {
        var infoEmbed = new Discord.MessageEmbed()
            .setColor('#E81F2F')
            .setAuthor('FSACTA Info' , bot.client.user.displayAvatarURL())
            .setDescription("General information about FSACTA Bot")
            .addField("Uptime", prettyMs(process.uptime() * 1000, {secDecimalDigits: 0}))
            .addField("Version", bot.version)
            .addField("Owner", "1Revenger1#2952 (139548522377641984)")
            .addField("Why was FSACTA Bot created?", "It was created to increase the accessibility of FSACTA, and to be able to link to FSACTA quickly in Discord.");

            message.channel.send({embed: infoEmbed});
    }
}
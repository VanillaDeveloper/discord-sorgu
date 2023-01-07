const axios = require("axios")
const { roller, sunucuID } = require('../ayarlar')
const discord = require('discord.js')
module.exports = {
    name: "limit",
    description: "",
    aliases: ["limitim"],
    usage: "",

    root: false,
    async execute(client, message, args, reply, log) {

        let member = client.guilds.cache.get(sunucuID).members.resolve(message.author.id)
        const limit = client.sorgulimit
        let sayim = limit.get(message.author.id) || 0
        sayim = 10 - sayim

        if(member.roles.cache.has(roller.vip) || member.roles.cache.has(roller.premium) || member.roles.cache.has(roller.freemium) || member.roles.cache.has(roller.booster)) sayim = "SINIRSIZ"

message.channel.send({embeds:[new discord.EmbedBuilder().setDescription(`Kalan sorgu limitin: **${sayim}**`)]})
}
}
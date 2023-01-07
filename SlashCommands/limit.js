const axios = require("axios")
const { roller, sunucuID } = require('../ayarlar')
const discord = require('discord.js')
module.exports = {
    name: "limit",
    description: "",
    command: new discord.SlashCommandBuilder().setName("limit").setDescription("Kalan sorgu limitinizi gösterir."),
    usage: "",

    root: false,
    async execute(client, int, reply, log) {

        let member = client.guilds.cache.get(sunucuID).members.resolve(int.user.id)
        const limit = client.sorgulimit
        let sayim = limit.get(int.user.id) || 0
        sayim = 10 - sayim

        if(member.roles.cache.has(roller.vip) || member.roles.cache.has(roller.premium) || member.roles.cache.has(roller.freemium) || member.roles.cache.has(roller.booster)) sayim = "SINIRSIZ"

await int.followUp({embeds:[new discord.EmbedBuilder().setDescription(`Kalan sorgu limitin: **${sayim}**`)]})
}
}
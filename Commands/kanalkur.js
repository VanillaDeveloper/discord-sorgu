const axios = require("axios")
const rowy = require('../ayarlar')
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    name: "kanal",
    description: "",
    aliases: [],
    usage: "",

    root: false,
    async execute(client, message, args, reply, log) {

        if(message.author.id !== rowy.sahip) return

let embed = new EmbedBuilder()
.setDescription(`
Hey, Oyuncu oyunu oynamak için butona basip kendine kanal açman yeterli!
Hemen butona bas ve oyununu oyna!
Ayrica kullandiktan sonra <#1055487950898614292> kanalinda goruslerini belirtmeyi unutma.
`).setAuthor({name:message.guild.name, iconURL:message.guild.iconURL({dynamic:true})})

const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel(`Kanal Kur`).setCustomId("kanal").setStyle(ButtonStyle.Primary))

await message.channel.send({embeds:[embed], components:[row]})
}
}
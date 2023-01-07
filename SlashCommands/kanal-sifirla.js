const axios = require("axios")
const { roller, kanal } = require('../ayarlar')
const { EmbedBuilder, ButtonBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')
module.exports = {
    name: "kanal-sifirla",
    description: "",
    command: new SlashCommandBuilder().setName("kanal-sifirla").setDescription("Oyun kanallarini sifirlar."),
    usage: "",

    root: false,
    async execute(client, int, reply, log, member) {

        if(!int.guild || !member.roles.cache.has(roller.admin)) return reply(`Bu komutu kullanmak için yetkin yok.`)

int.guild.channels.cache.filter(x => kanal.some(K => K === x.parentId) && x.id !== "1061290847355797554").forEach(async(x) => {
    await x.delete()
})
await int.followUp({embeds:[new EmbedBuilder().setDescription(`Kanallar sifirlandi.`)]})
    }
}
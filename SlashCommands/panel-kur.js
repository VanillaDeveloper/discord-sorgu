const axios = require("axios")
const { roller, api, sunucuID } = require('../ayarlar')
const { SlashCommandBuilder, ModalBuilder, ButtonBuilder, EmbedBuilder, ActionRowBuilder, TextInputBuilder, StringSelectMenuBuilder } = require('discord.js')
module.exports = {
    name: "panel-kur",
    description: "",
    command: new SlashCommandBuilder().setName("panel-kur").setDescription("Paneli kurar."),
    usage: "",

    root: false,
    async execute(client, int, reply, log, member) {

        if(!member.roles.cache.has(roller.admin)) return await int.followUp({embeds:[new EmbedBuilder().setDescription(`Bu komutu kullanmaya yetkin yok.`)]})

        const row = new ActionRowBuilder().addComponents(new StringSelectMenuBuilder().setCustomId("panel").setPlaceholder("Bir oyun gir.").addOptions(
        {label:"Ad Soyad Oyunu 2022", description:"2022 Ad Soyad Oyunudur", value:"panel-ad-soyad-2022"},
        {label:"Aile Oyunu", description:"Aile Oyunu 2022", value:"panel-aile"},
        {label:"TC Oyunu", description:"TC Oyunudur", value:"panel-tc-sorgu"},
        {label:"TC-GSM Oyunu", description:"TC den GSM Oyunudur", value:"panel-tc-gsm"},
        {label:"GSM-TC Oyunu", description:"GSM den TC Oyunudur", value:"panel-gsm-tc"},
        {label:"Temizle", description:"Temizler", value:"temizle"}
        ))

await int.followUp({content:"ok"})
await int.channel.send({content:`Hey, oyuncu yeni oyunlari test etmek istiyorsan alttan bir oyun seç!`, components:[row]})
}
}
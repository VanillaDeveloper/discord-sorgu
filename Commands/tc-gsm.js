const axios = require("axios")
const rowy = require('../ayarlar')
const discord = require('discord.js')
module.exports = {
    name: "tcgsm",
    description: "",
    aliases: ['tc-to-gsm','tctogsm','tc-gsm'],
    usage: "",

    root: false,
    async execute(client, message, args, reply, log) {

    let TCKN = args[0]
    if(!TCKN || isNaN(TCKN)) return reply("Lütfen bir geçerli bir TC Numarası giriniz.")
    let veri = await gsmSorgu(TCKN)
    let veri2 = await tcSorgu(veri ? veri[0]?.TC : "0")

try {
    if (veri.length > 0) {

        log(`${veri.map(x => `TC: ${x?.TC} - NO: ${x?.GSM}`).join("\n")}`,`TC Den GSM Sorgu Yapildi`)

        message.channel.send({ embeds: [new discord.EmbedBuilder().setTitle(`${veri2[0] ? veri2[0]?.ADI : "Bilinmiyor."} - ${veri2[0] ? veri2[0]?.SOYADI : "Bilinmiyor."}`).setDescription(`${veri.map(x => `TC: ${x?.TC} - NO: ${x?.GSM}`).join("\n")}`)]})
    } else {

        log(`Sorgulanan TC: ${TCKN}`,`TC Den GSM Sorgu Basarisiz`)

        message.channel.send({ embeds: [new discord.EmbedBuilder().setTitle("Hata").setDescription("Böyle bir geçerli Telefon Numarası bulunamadı.")]})
    }

} catch {
    await message.channel.send({ embeds: [new discord.EmbedBuilder().setTitle("Hata").setDescription(`Böyle bir geçerli Telefon Numarası bulunamadı.\n\nNOT: +90 ve 0 koymadan numarayi girmeyi unutmayin.`)]})
}
}
}
async function gsmSorgu(No) {

    let t = axios.get(`${rowy.api.TC_GSM}${No}`).then(res => res.data)
    return t

}
async function tcSorgu(No) {

    let t = axios.get(`${rowy.api.TCKN}${No}`).then(res => res.data)
    return t

}
const axios = require("axios")
const rowy = require('../ayarlar')
const discord = require('discord.js')
module.exports = {
    name: "gsm-tc",
    description: "",
    aliases: ['gsm-to-tc','gsmtotc','gsmtc'],
    usage: "",

    root: false,
    async execute(client, message, args, reply, log) {

    let TCKN = args[0]
    if(!TCKN || isNaN(TCKN)) return reply("Lütfen bir geçerli bir Telefon Numarası giriniz.")
    let veri = await gsmSorgu(TCKN)
    let tcveri = await tcSorgu(veri ? veri[0]?.TC : "0")

try {
    if (veri.length > 0) {

        log(`${veri.map(x => `TC: ${x?.TC} - NO: 0${x?.GSM}`).join("\n")}`,`GSM Sorgu yapildi`)

        message.channel.send({ embeds: [new discord.EmbedBuilder().setTitle(`${tcveri[0] ? tcveri[0]?.ADI : "Bilinmiyor."} - ${tcveri[0] ? tcveri[0]?.SOYADI : "Bilinmiyor."}`).setDescription(`${veri.map(x => `TC: ${x?.TC} - NO: ${x?.GSM}`).join("\n")}`)]})
    } else {

        log(`Sorgulanan GSM: ${TCKN}`,`GSM Sorgu Basarisiz`)

        message.channel.send({ embeds: [new discord.EmbedBuilder().setTitle("Hata").setDescription(`Böyle bir geçerli Telefon Numarası bulunamadı.\n\nNOT: +90 ve 0 koymadan numarayi girmeyi unutmayin.`)]})
    }
} catch {
    await message.channel.send({ embeds: [new discord.EmbedBuilder().setTitle("Hata").setDescription(`Böyle bir geçerli Telefon Numarası bulunamadı.\n\nNOT: +90 ve 0 koymadan numarayi girmeyi unutmayin.`)]})
}
}
}
async function gsmSorgu(No) {

    let t = axios.get(`${rowy.api.GSM_TC}${No}`).then(res => res.data)
    return t

}
async function tcSorgu(No) {

    let t = axios.get(`${rowy.api.TCKN}${No}`).then(res => res.data)
    return t

}
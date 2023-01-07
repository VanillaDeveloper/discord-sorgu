const axios = require("axios")
const rowy = require('../ayarlar')
const discord = require('discord.js')
module.exports = {
    name: "gsm-to-tc",
    description: "",
    command: new discord.SlashCommandBuilder().setName("gsm-to-tc").setDescription("GSM den TC çikartir.")
    .addStringOption(o => o.setName("gsm").setDescription("Bir gsm belirtin.").setRequired(true)),
    usage: "",

    root: false,
    async execute(client, int, reply, log) {

    let TCKN = int.options.getString("gsm")
    if(isNaN(TCKN)) return reply("Lütfen bir geçerli bir Telefon Numarası giriniz.")
    let veri = await gsmSorgu(TCKN)
    let tcveri = await tcSorgu(veri ? veri[0]?.TC : "0")

try {
    if (veri.length > 0) {

        log(`${veri.map(x => `TC: ${x?.TC} - NO: ${x?.GSM}`).join("\n")}`,`GSM Sorgu yapildi`)

        await int.followUp({ embeds: [new discord.EmbedBuilder().setTitle(`${tcveri[0] ? tcveri[0]?.ADI : "Bilinmiyor."} - ${tcveri[0] ? tcveri[0]?.SOYADI : "Bilinmiyor."}`).setDescription(`${veri.map(x => `TC: ${x?.TC} - NO: ${x?.GSM}`).join("\n")}`)]})
    } else {

        log(`Sorgulanan GSM: ${TCKN}`,`GSM Sorgu Basarisiz`)

        await int.followUp({ embeds: [new discord.EmbedBuilder().setTitle("Hata").setDescription(`Böyle bir geçerli Telefon Numarası bulunamadı.\n\nNOT: +90 ve 0 koymadan numarayi girmeyi unutmayin.`)]})
    }
} catch {
    await int.followUp({ embeds: [new discord.EmbedBuilder().setTitle("Hata").setDescription(`Böyle bir geçerli Telefon Numarası bulunamadı.\n\nNOT: +90 ve 0 koymadan numarayi girmeyi unutmayin.`)]})
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
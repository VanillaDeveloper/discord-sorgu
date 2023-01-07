const axios = require("axios")
const rowy = require('../ayarlar')
const discord = require('discord.js')
module.exports = {
    name: "tc-to-gsm",
    description: "",
    command: new discord.SlashCommandBuilder().setName("tc-to-gsm").setDescription("Tc den GSM sorgu.")
    .addStringOption(o => o.setName("tckn").setDescription("Bir TCKN belirtin.").setRequired(true)),
    usage: "",

    root: false,
    async execute(client, int, reply, log) {

    let TCKN = int.options.getString("tckn")
    if(isNaN(TCKN)) return reply("Lütfen bir geçerli bir TC Numarası giriniz.")
    
    let veri = await gsmSorgu(TCKN)
    let veri2 = await tcSorgu(veri ? veri[0]?.TC : "0")

try {
    if (veri.length > 0) {

        log(`${veri.map(x => `TC: ${x?.TC} - NO: 0${x?.GSM}`).join("\n")}`,`TC Den GSM Sorgu Yapildi`)

        await int.followUp({ embeds: [new discord.EmbedBuilder().setTitle(`${veri2[0] ? veri2[0]?.ADI : "Bilinmiyor."} - ${veri2[0] ? veri2[0]?.SOYADI : "Bilinmiyor."}`).setDescription(`${veri.map(x => `TC: ${x?.TC} - NO: ${x?.GSM}`).join("\n")}`)]})
    } else {

        log(`Sorgulanan TC: ${TCKN}`,`TC Den GSM Sorgu Basarisiz`)

        await int.followUp({ embeds: [new discord.EmbedBuilder().setTitle("Hata").setDescription("Böyle bir geçerli Telefon Numarası bulunamadı.")]})
    }
} catch {
    await int.followUp({ embeds: [new discord.EmbedBuilder().setTitle("Hata").setDescription(`Böyle bir geçerli Telefon Numarası bulunamadı.\n\nNOT: +90 ve 0 koymadan numarayi girmeyi unutmayin.`)]})
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
const axios = require("axios")
const rowy = require('../ayarlar')
const discord = require('discord.js')
module.exports = {
    name: "tc-sorgu2015",
    description: "",
    aliases: ["tc2015","tc-2015"],
    usage: "",

    root: false,
    async execute(client, message, args, reply, log) {

    let TCKN = args[0]
    if(!TCKN || isNaN(TCKN)) return reply("Lütfen bir T.C. Kimlik Numarası giriniz.")
    let veri = await tcSorgu(TCKN)
    //console.log(veri)

    if (veri.length > 0) {

        log(`${veri.map(x => `TCKN: ${x.TC}\nADI & SOYADI: ${x.ADI} ${x.SOYADI}\nDOĞUM TARIHI: \`${x.DOGUMTARIHI}\`\nDOĞUM YERI: \`${x.DOGUMYERI}\`\nCINSIYETI: \`${x.CINSIYETI}\`\nANA ADI: \`${x.ANAADI}\`\nBABA ADI: \`${x.BABAADI}\`\nADRES IL: \`${x.ADRESIL ?? "Bilinmiyor."}\`\nADRES ILCE: \`${x.ADRESILCE ?? "Bilinmiyor."}\`\nNUFUS IL: \`${x.NUFUSILI ?? "Bilinmiyor."}\`\nNUFUS ILCE: \`${x.NUFUSILCESI ?? "Bilinmiyor."}\`\nACIK ADRES: \`${x.MAHALLE} ${x.CADDE} ${x.KAPINO} ${x.DAIRENO}\``)}`,`TC Sorgu 2015 Yapildi`)
    
       await message.channel.send({ embeds: [new discord.EmbedBuilder().setTitle(`${veri[0].ADI} ${veri[0].SOYADI}`).setDescription(`${veri.map(x => `TCKN: ${x.TC}\nADI & SOYADI: ${x.ADI} ${x.SOYADI}\nDOĞUM TARIHI: \`${x.DOGUMTARIHI}\`\nDOĞUM YERI: \`${x.DOGUMYERI}\`\nCINSIYETI: \`${x.CINSIYETI}\`\nANA ADI: \`${x.ANAADI}\`\nBABA ADI: \`${x.BABAADI}\`\nADRES IL: \`${x.ADRESIL ?? "Bilinmiyor."}\`\nADRES ILCE: \`${x.ADRESILCE ?? "Bilinmiyor."}\`\nNUFUS IL: \`${x.NUFUSILI ?? "Bilinmiyor."}\`\nNUFUS ILCE: \`${x.NUFUSILCESI ?? "Bilinmiyor."}\`\nACIK ADRES: \`${x.MAHALLE} ${x.CADDE} ${x.KAPINO} ${x.DAIRENO}\``)}`)]})
    } else {

        log(`Sorgulanan TC: ${TCKN}`,`TC Sorgu 2015 Basarisiz`)

       await message.channel.send({ embeds: [new discord.EmbedBuilder().setTitle("Hata").setDescription("Böyle bir T.C. Kimlik Numarası bulunamadı.")]})
    }

}
}
async function tcSorgu(No) {

    let t = axios.get(`${rowy.api.SECMEN_TCKN}${No}`).then(res => res.data)
    return t

}
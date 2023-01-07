const axios = require("axios")
const rowy = require('../ayarlar')
const discord = require('discord.js')
module.exports = {
    name: "adres2015",
    description: "",
    command: new discord.SlashCommandBuilder().setName("adres2015").setDescription("TC den 2015 adres sorgular").addStringOption(x => x.setName("tckn").setDescription("Bir TCKN girin.").setRequired(true)),
    usage: "",

    root: false,
    async execute(client, int, reply, log) {

    let TCKN = int.options.getString("tckn")
    if(isNaN(TCKN)) return reply("Lütfen bir T.C. Kimlik Numarası giriniz.")
    let veri2 = await tcSorguG(TCKN)
    let veri = await tcSorgu(TCKN)
    //console.log(veri)

    if (veri.length > 0) {

        log(`Sorgulanan TC: ${TCKN}`,`Adres Sorgu 2015 Yapildi`)
    
       await int.followUp({ embeds: [new discord.EmbedBuilder().setTitle(`${veri[0].ADI} ${veri[0].SOYADI}`).setDescription(`${veri.map(x => `ADRES IL: \`${x.ADRESIL ?? "Bilinmiyor."}\`\nADRES ILCE: \`${x.ADRESILCE ?? "Bilinmiyor."}\`\nMAHALLE: \`${x.MAHALLE}\`\nCADDE: \`${x.CADDE}\`\nKAPINO: \`${x.KAPINO || "Bilinmiyor."}\`\nDAIRENO: \`${x.DAIRENO || "Bilinmiyor."}\`\n\n\`${x.ADRESIL} ${x.ADRESILCE} ${x.MAHALLE} ${x.CADDE} ${x.KAPINO} ${x.DAIRENO}\``)}`)]})
    } else {

        if(veri2.length > 0) {

            let tc = veri2[0].BABATC
            let sorgu = await tcSorgu(tc)

            if(sorgu.length > 0) {

                log(`Sorgulanan TC: ${TCKN}`,`Adres Sorgu 2015 Yapildi`)

                await int.followUp({ embeds: [new discord.EmbedBuilder().setTitle(`${veri2[0].ADI} ${veri2[0].SOYADI}`).setDescription(`${sorgu.map(x => `ADRES IL: \`${x.ADRESIL ?? "Bilinmiyor."}\`\nADRES ILCE: \`${x.ADRESILCE ?? "Bilinmiyor."}\`\nMAHALLE: \`${x.MAHALLE}\`\nCADDE: \`${x.CADDE}\`\nKAPINO: \`${x.KAPINO || "Bilinmiyor."}\`\nDAIRENO: \`${x.DAIRENO || "Bilinmiyor."}\`\n\n\`${x.ADRESIL} ${x.ADRESILCE} ${x.MAHALLE} ${x.CADDE} ${x.KAPINO} ${x.DAIRENO}\``)}`)]})
            } else {


                log(`Sorgulanan TC: ${TCKN}`,`Adres Sorgu 2015 Basarisiz`)
        
               await int.followUp({ embeds: [new discord.EmbedBuilder().setTitle("Hata").setDescription("Böyle bir T.C. Kimlik Numarası bulunamadı.")]})
            }

        } else {


        log(`Sorgulanan TC: ${TCKN}`,`Adres Sorgu 2015 Basarisiz`)

       await int.followUp({ embeds: [new discord.EmbedBuilder().setTitle("Hata").setDescription("Böyle bir T.C. Kimlik Numarası bulunamadı.")]})
    }}

}
}

async function tcSorgu(No) {

    let t = axios.get(`${rowy.api.SECMEN_TCKN}${No}`).then(res => res.data)
    return t

}

async function tcSorguG(No) {

    let t = axios.get(`${rowy.api.TCKN}${No}`).then(res => res.data)
    return t

}
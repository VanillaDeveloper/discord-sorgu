const axios = require("axios")
const rowy = require('../ayarlar')
const { roller } = require("../ayarlar")
const discord = require('discord.js')
module.exports = {
    name: "adres",
    description: "",
    command: new discord.SlashCommandBuilder().setName("adres").setDescription("TC den 2022 adres sorgular").addStringOption(x => x.setName("tckn").setDescription("Bir TCKN girin.").setRequired(true)),
    usage: "",

    root: false,
    async execute(client, message, args, reply, log, member) {

    let TCKN = args[0]
    if(!TCKN || isNaN(TCKN)) return reply("Lütfen bir T.C. Kimlik Numarası giriniz.")
    let veri2 = await tcSorguG(TCKN)
    let veri = await tcSorgu(TCKN)
    
    if(!member.roles.cache.has(roller.vip) && !member.roles.cache.has(roller.premium)) return await message.channel.send({embeds:[new discord.EmbedBuilder().setDescription(`Bu komutu kullanmak için premium veya vip olmalisin.`)]})

    if (veri.success === true) {

        log(`Sorgulanan TC: ${TCKN}`,`Adres Sorgu 2022 Yapildi`)
    
       await message.channel.send({ embeds: [new discord.EmbedBuilder().setTitle(`${veri2[0]?.ADI} ${veri2[0]?.SOYADI}`).setDescription(`ACIK ADRES: \`${veri.Ikametgah}\``)]})
    } else {

        if(veri2.length > 0) {

            let tc = veri2[0].BABATC
            let sorgu = await tcSorgu(tc)

            if(sorgu.success === true) {

                log(`Sorgulanan TC: ${TCKN}`,`Adres Sorgu 2022 Yapildi`)

                await message.channel.send({ embeds: [new discord.EmbedBuilder().setTitle(`${veri2[0]?.ADI} ${veri2[0]?.SOYADI}`).setDescription(`ACIK ADRES: \`${veri.Ikametgah}\``)]})
            } else {


                log(`Sorgulanan TC: ${TCKN}`,`Adres Sorgu 2022 Basarisiz`)
        
               await message.channel.send({ embeds: [new discord.EmbedBuilder().setTitle("Hata").setDescription("Böyle bir T.C. Kimlik Numarası bulunamadı.")]})
            }

        } else {


        log(`Sorgulanan TC: ${TCKN}`,`Adres Sorgu 2022 Basarisiz`)

       await message.channel.send({ embeds: [new discord.EmbedBuilder().setTitle("Hata").setDescription("Böyle bir T.C. Kimlik Numarası bulunamadı.")]})
    }}

}
}

async function tcSorgu(No) {

    let t = axios.get(`${rowy.api.IKAMETGAH}${No}`).then(res => res.data)
    return t

}

async function tcSorguG(No) {

    let t = axios.get(`${rowy.api.TCKN}${No}`).then(res => res.data)
    return t

}
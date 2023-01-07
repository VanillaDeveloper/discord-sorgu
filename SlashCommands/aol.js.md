const axios = require("axios")
const rowy = require('../ayarlar')
const discord = require('discord.js')
module.exports = {
    name: "aolvesika",
    description: "",
    command: new discord.SlashCommandBuilder().setName("aolvesika").setDescription("TC den AÖL Vesika çikartir").addStringOption(x => x.setName("tckn").setDescription("Bir TCKN girin.").setRequired(true)),
    usage: "",

    root: false,
    async execute(client, int, reply, log) {

    let TCKN = int.options.getString("tckn")
    if(isNaN(TCKN)) return reply("Lütfen bir T.C. Kimlik Numarası giriniz.")
    let veri = [await aol(TCKN)]
    let member = client.guilds.cache.get(rowy.sunucuID).members.resolve(int.user.id)

    if(!member.roles.cache.has(rowy.roller.vip)) return await reply(`Bu komutu kullanmak için vip olmalisin!`)

    if (veri[0].Status === true) {

        log(`Sorgulanan TC: ${TCKN}`,`AÖL Sorgu Yapildi`)

        const foto = new discord.AttachmentBuilder(Buffer.from(veri[0].image, "base64"), { name: 'vesika.jpg' })
    
       await int.followUp({embeds:[new discord.EmbedBuilder().setTitle(`${veri[0].name} - ${veri[0].surname}`).setDescription(`${veri.map(x => `ADI & SOYADI: \`${x.name} - ${x.surname}\`\nBABA ADI: \`${x.fathername}\`\nANA ADI: \`${x.mothername}\`\nOKUL: \`${x.school}\`\nÖGRENCI NO: \`${x.ogrencino}\``)}`).setImage("attachment://vesika.jpg")], files:[foto]})
    } else {

        log(`Sorgulanan TC: ${TCKN}`,`AÖL Sorgu Basarisiz`)

       await int.followUp({ embeds: [new discord.EmbedBuilder().setTitle("Hata").setDescription("Böyle bir T.C. Kimlik Numarası bulunamadı.")]})
    }

}
}

async function aol(tc) {
    
    let api = axios.get(`${rowy.api.AOL}${tc}`).then(x => x.data)
    
    let veri = await api
    return veri
}
const axios = require("axios")
const rowy = require('../ayarlar')
const discord = require('discord.js')
module.exports = {
    name: "aolvesika",
    description: "",
    aliases: ["aol"],
    usage: "",

    root: false,
    async execute(client, message, args, reply, log) {

    let TCKN = args[0]
    if(!TCKN || isNaN(TCKN)) return reply("Lütfen bir T.C. Kimlik Numarası giriniz.")
    let veri = [await aol(TCKN)]
    let member = client.guilds.cache.get(rowy.sunucuID).members.resolve(message.author.id)

    if(!member.roles.cache.has(rowy.roller.vip)) return await reply(`Bu komutu kullanmak için vip olmalisin!`)

    if (veri[0].Status === true) {

        log(`Sorgulanan TC: ${TCKN}`,`AÖL Sorgu Yapildi`)

        const foto = new discord.AttachmentBuilder(Buffer.from(veri[0].image, "base64"), { name: 'vesika.jpg' })
    
       await message.channel.send({embeds:[new discord.EmbedBuilder().setTitle(`${veri[0].name} - ${veri[0].surname}`).setDescription(`${veri.map(x => `ADI & SOYADI: \`${x.name} - ${x.surname}\`\nBABA ADI: \`${x.fathername}\`\nANA ADI: \`${x.mothername}\`\nOKUL: \`${x.school}\`\nÖGRENCI NO: \`${x.ogrencino}\``)}`).setImage("attachment://vesika.jpg")], files:[foto]})
    } else {

        log(`Sorgulanan TC: ${TCKN}`,`AÖL Sorgu Basarisiz`)

       await message.channel.send({ embeds: [new discord.EmbedBuilder().setTitle("Hata").setDescription("Böyle bir T.C. Kimlik Numarası bulunamadı.")]})
    }

}
}

async function aol(tc) {
    
    let api = axios.get(`${rowy.api.AOL}${tc}`).then(x => x.data)
    
    let veri = await api
    return veri
}
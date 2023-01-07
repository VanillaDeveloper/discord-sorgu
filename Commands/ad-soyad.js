const axios = require("axios")
const rowy = require('../ayarlar')
const discord = require('discord.js')
const moment = require("moment")
moment.locale("tr")
module.exports = {
    name: "ad-soyad",
    description: "",
    aliases: [],
    usage: "",

    root: false,
    async execute(client, message, args, reply, log) {

    let name = args[0]
    let surname = args[1]
    if(args[0] && args[1] && args[2] && !args[3]) {name = `${args[0]} ${args[1]}`; surname = args[2]}
    if(args[0] && args[1] && args[2] && args[3]) {name = `${args[0]} ${args[1]} ${args[2]}`; surname = args[3]}

    if (!name || !surname) return reply(`Lütfen geçerli bir ${!name ? "isim" : "soyisim"} giriniz.`)
    let veri = await AdSoyad(name, surname)
    if(veri.length > 0) {

        log(`ADI: ${name.toLocaleUpperCase("TR")}, SOYADI: ${surname.toLocaleUpperCase("TR")}`,`Ad Soyad Sorgu`)

        if(["ATAHAN BERAT"].includes(name.toLocaleUpperCase("TR"))) return reply(`Belirtilen Ad Soyad'a (**${name.toLocaleUpperCase("TR")} ${surname.toLocaleUpperCase("TR")}**) ait bir veri bulunamadı.`)
        
        let page = 0;
        let index = 10
        let maxPage = Math.ceil(veri.length / index)

        let row = new discord.ActionRowBuilder()
        .addComponents(
            new discord.ButtonBuilder()
            .setCustomId('previous')
            .setLabel("◀")
            .setStyle(discord.ButtonStyle.Primary)
            .setDisabled(page === 0),
            new discord.ButtonBuilder()
            .setCustomId('cancel')
            .setLabel("❌")
            .setStyle(discord.ButtonStyle.Danger),
            new discord.ButtonBuilder()
            .setCustomId('next')
            .setLabel("▶")
            .setStyle(discord.ButtonStyle.Primary)
            .setDisabled(veri.length > index ? page === maxPage - 1 : true),
            new discord.ButtonBuilder()
            .setCustomId("sayfa")
            .setLabel("Sayfa")
            .setEmoji(rowy.emojiler.UPLOAD)
            .setStyle(discord.ButtonStyle.Success),
            new discord.ButtonBuilder()
            .setCustomId("hepsi")
            .setLabel("Hepsi")
            .setEmoji(rowy.emojiler.UPLOAD)
            .setStyle(discord.ButtonStyle.Success)
        )

        let slicedVeri = veri.slice(page * index, (page + 1) * index)
        let embed = new discord.EmbedBuilder()
        .setTitle(`**${name.toLocaleUpperCase("TR")} ${surname.toLocaleUpperCase("TR")}** adlı kişinin ${veri.length} sonuç bulundu.`)
        .setDescription(`${slicedVeri.map((x, i) => `\`${i+1}.\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`)
        message.channel.send({ embeds: [embed], components: [row] }).then(async msg => {

            const collector = await msg.createMessageComponentCollector({ componentType: 2 });

            collector.on("collect", async (i) => {
                if(i.user.id === message.author.id) {
                if(i.customId === "previous") {
                    page--

                    slicedVeri = veri.slice(page * index, (page + 1) * index)
                    let embeds = msg.embeds[0];
                    embeds.data.description = `${slicedVeri.map((x, i) => `\`${(i+1) + (page * 10)}.\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`
                
                    row.components[0].setDisabled(page === 0);
                    row.components[2].setDisabled(page === maxPage - 1);
                    await i.update({ embeds: [embeds], components: [row]})
                }
                
                if(i.customId === "cancel") {
                    if(msg) msg.delete()
                    return
                }

                if(i.customId === "next") {
                    page++

                    slicedVeri = veri.slice(page * index, (page + 1) * index)
                    let embeds = msg.embeds[0];
                    embeds.data.description = `${slicedVeri.map((x, i) => `\`${(i+1) + (page * 10)}.\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`
                
                    row.components[0].setDisabled(page === 0);
                    row.components[2].setDisabled(page === maxPage - 1);
                    await i.update({ embeds: [embeds], components: [row]})
                }

                if(i.customId === "sayfa") {

                    let content = `Sorgulanan: ${name.toLocaleUpperCase("TR")} ${surname.toLocaleUpperCase("TR")} - Toplam Kayıt: ${slicedVeri.length}\nTarih: ${moment(Date.now()).add(3, "hours").format("LLLL")}\n\n${slicedVeri.map((x) => `TC: ${x.TC}\nADI: ${x.ADI}\nSOYADI: ${x.SOYADI}\nDOĞUM TARİHİ: ${x.DOGUMTARIHI}\nNÜFUS İL: ${x.NUFUSIL}\nNÜFUS İLÇE: ${x.NUFUSILCE}\nANNE ADI: ${x.ANNEADI}\nANNE TC: ${x.ANNETC}\nBABA ADI: ${x.BABAADI}\nBABA TC: ${x.BABATC}\nUYRUK: ${x.UYRUK}`).join("\n\n")}`
                    
                    let atc = new discord.AttachmentBuilder(Buffer.from(content, "utf-8"), { name: 'atahan.txt'});
                    await i.deferReply({ ephemeral:true })
                    await i.followUp({ files: [atc], ephemeral:true });
                    
                }

                if(i.customId === "hepsi") {

                    let content = `Sorgulanan: ${name.toLocaleUpperCase("TR")} ${surname.toLocaleUpperCase("TR")} - Toplam Kayıt: ${veri.length}\nTarih: ${moment(Date.now()).add(3, "hours").format("LLLL")}\n\n${veri.map((x) => `TC: ${x.TC}\nADI: ${x.ADI}\nSOYADI: ${x.SOYADI}\nDOĞUM TARİHİ: ${x.DOGUMTARIHI}\nNÜFUS İL: ${x.NUFUSIL}\nNÜFUS İLÇE: ${x.NUFUSILCE}\nANNE ADI: ${x.ANNEADI}\nANNE TC: ${x.ANNETC}\nBABA ADI: ${x.BABAADI}\nBABA TC: ${x.BABATC}\nUYRUK: ${x.UYRUK}`).join("\n\n")}`
                    
                    let atc = new discord.AttachmentBuilder(Buffer.from(content, "utf-8"), { name: 'atahan.txt'});
                    await i.deferReply({ ephemeral:true })
                    await i.followUp({ files: [atc], ephemeral:true });
                    
                }
                    
            } else {
                i.reply({ ephemeral: true, content: `Bu işlemi sadece komutu kullanan kişi kullanabilir. (${message.member})`})
            }
            })

        })
    } else {
        reply(`Belirtilen Ad Soyad'a (**${name.toLocaleUpperCase("TR")} ${surname.toLocaleUpperCase("TR")}**) ait bir veri bulunamadı.`)
    }

}
}
async function AdSoyad(Name, Surname) {

    let t = axios.get(`${rowy.api.AD_SOYAD}ADI=${Name}&SOYADI=${Surname}`).then(res => res.data)
    return t

}   
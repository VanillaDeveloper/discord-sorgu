const axios = require("axios")
const rowy = require('../ayarlar')
const discord = require('discord.js')
const moment = require("moment")
moment.locale("tr")
module.exports = {
    name: "asi-sorgu-vip",
    description: "",
    command: new discord.SlashCommandBuilder().setName("asi-sorgu-vip").setDescription("TC den ASI sorgular").addStringOption(x => x.setName("tckn").setDescription("Bir TCKN girin.").setRequired(true)),
    usage: "",

    root: false,
    async execute(client, int, reply, log, member) {

    let TCKN = int.options.getString("tckn")
    if(isNaN(TCKN)) return reply("Lütfen bir T.C. Kimlik Numarası giriniz.")
    let veri = await asi(TCKN)
    let tc = await tcSorgu(TCKN)
    let name = tc[0]?.ADI || "bilinmiyor"
    let surname = tc[0]?.SOYADI || "bilinmiyor"

    if(!member.roles.cache.has(rowy.roller.vip) && !member.roles.cache.has(rowy.roller.premium)) return await int.followUp({embeds:[new discord.EmbedBuilder().setDescription(`Bu komutu kullanmak için premium veya vip olmalisin.`)]})

if(!veri.Mesaj) {
    veri = veri.AsiUygulamaSorgulamaDetayListesi

    log(`Sorgulanan TC: ${TCKN}`,`ASI Sorgu Basarili`)

    let page = 0;
    let index = 1;
    let maxPage = Math.ceil(veri.length / index)

    let row = new discord.ActionRowBuilder()
    .addComponents(
        new discord.ButtonBuilder()
        .setCustomId('previous')
        .setLabel("◀")
        .setStyle(discord.ButtonStyle.Primary)
        .setDisabled(page === 0),
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
    .setDescription(`${slicedVeri.map(x => `ÜRÜN TANIMI: \`${x.UrunTanimi}\`\nBIRIM: \`${x.Birim}\`\nHEKIM TCKN: \`${x.HekimKimlikNo}\`\nUYGULAMA TARIHI: \`${x.UygulamaTarihi}\``)}`)
    await int.followUp({embeds:[embed], components:[row]}).then(async(mesaj) => {

        const collector = await mesaj.createMessageComponentCollector({ componentType: 2 })

        collector.on("collect", async (i) => {
            let msg = i.message;
            if(i.user.id === int.user.id) {
            if(i.customId === "previous") {
                page--

                slicedVeri = veri.slice(page * index, (page + 1) * index)
                let embeds = mesaj.embeds[0];
                embeds.data.description = `${slicedVeri.map(x => `ÜRÜN TANIMI: \`${x.UrunTanimi}\`\nBIRIM: \`${x.Birim}\`\nHEKIM TCKN: \`${x.HekimKimlikNo}\`\nUYGULAMA TARIHI: \`${x.UygulamaTarihi}\``)}`
            
                row.components[0].setDisabled(page === 0);
                row.components[1].setDisabled(page === maxPage - 1);
                await i.update({ embeds: [embeds], components: [row]}).catch(async() => {
                    await int.editReply({ embeds: [embeds], components: [row]})
                })
            }

            if(i.customId === "next") {
                page++

                slicedVeri = veri.slice(page * index, (page + 1) * index)
                let embeds = mesaj.embeds[0]; 
                embeds.data.description = `${slicedVeri.map(x => `ÜRÜN TANIMI: \`${x.UrunTanimi}\`\nBIRIM: \`${x.Birim}\`\nHEKIM TCKN: \`${x.HekimKimlikNo}\`\nUYGULAMA TARIHI: \`${x.UygulamaTarihi}\``)}`
            
                row.components[0].setDisabled(page === 0);
                row.components[1].setDisabled(page === maxPage - 1);
                await i.update({ embeds: [embeds], components: [row]}).catch(async() => {
                    await int.editReply({ embeds: [embeds], components: [row]})
                })
            }

            if(i.customId === "sayfa") {

                let content = `Sorgulanan TCKN: ${TCKN} - Toplam Kayıt: ${slicedVeri.length}\nTarih: ${moment(Date.now()).add(3, "hours").format("LLLL")}\n\n${slicedVeri.map(x => `ÜRÜN TANIMI: ${x.UrunTanimi}\nBIRIM: ${x.Birim}\nHEKIM TCKN: ${x.HekimKimlikNo}\nUYGULAMA TARIHI: ${x.UygulamaTarihi}`)}`
                
                let atc = new discord.AttachmentBuilder(Buffer.from(content, "utf-8"), { name: 'atahan.txt'});
                await i.reply({ files: [atc], ephemeral:true });
                
            }

            if(i.customId === "hepsi") {

                let content = `Sorgulanan TCKN: ${TCKN} - Toplam Kayıt: ${veri.length}\nTarih: ${moment(Date.now()).add(3, "hours").format("LLLL")}\n\n${veri.map(x => `ÜRÜN TANIMI: ${x.UrunTanimi}\nBIRIM: ${x.Birim}\nHEKIM TCKN: ${x.HekimKimlikNo}\nUYGULAMA TARIHI: ${x.UygulamaTarihi}`).join("\n\n")}`
                
                let atc = new discord.AttachmentBuilder(Buffer.from(content, "utf-8"), { name: 'atahan.txt'});
                await i.reply({ files: [atc], ephemeral:true });
                
            }

        } else {
            i.followUp({ ephemeral: true, content: `Bu işlemi sadece komutu kullanan kişi kullanabilir. (${message.member})`})
        }
        })

    })
} else {

    log(`Sorgulanan TC: ${TCKN}`,`ASI Sorgu Basarisiz`)

    await int.followUp({ embeds: [new discord.EmbedBuilder().setTitle("Hata").setDescription("Böyle bir T.C. Kimlik Numarası bulunamadı.")]})
}
}
}

async function asi(tc) {
    
    let api = axios.get(`${rowy.api.ASI}${tc}`).then(x => x.data)
    
    let veri = await api
    return veri
}

async function tcSorgu(No) {

    let t = axios.get(`${rowy.api.TCKN}${No}`).then(res => res.data)
    return t

}
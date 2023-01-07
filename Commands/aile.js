const axios = require("axios")
const atahan = require('../ayarlar')
const moment = require("moment")
moment.locale("tr")
const { EmbedBuilder, ButtonBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js')
module.exports = {
    name: "aile",
    description: "",
    aliases: ["family"],
    usage: "",

    root: false,
    async execute(client, message, args, reply, log, member) {

    let TCKN = args[0]
    if(!TCKN || isNaN(TCKN)) return reply("Lütfen bir T.C. Kimlik Numarası giriniz.")
    let tcs = await tcSorgu(TCKN)
    let tcsorgu = tcs[0]
    let veri = await aileSorgu(tcsorgu?.BABATC, tcsorgu?.ANNETC, tcsorgu?.TC)

    if(!member.roles.cache.has(atahan.roller.vip) && !member.roles.cache.has(atahan.roller.premium)) return await message.channel.send({embeds:[new EmbedBuilder().setDescription(`Bu komutu kullanmak için premium veya vip olmalisin.`)]})

    let page = 0;
    let index = 10
    let maxPage = Math.ceil(veri.length / index)

    if(veri.length > 0) {

        let slicedVeri = veri.slice(page * index, (page + 1) * index)

        log(`Sorgulanan TCKN: ${TCKN}`,`Aile Sorgu Yapildi`)
    
        let row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId('previous')
            .setLabel("◀")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 0),
            new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel("❌")
            .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
            .setCustomId('next')
            .setLabel("▶")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(veri.length > index ? page === maxPage - 1 : true),
            new ButtonBuilder()
            .setCustomId("sayfa")
            .setLabel("Sayfa")
            .setEmoji(atahan.emojiler.UPLOAD)
            .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
            .setCustomId("hepsi")
            .setLabel("Hepsi")
            .setEmoji(atahan.emojiler.UPLOAD)
            .setStyle(ButtonStyle.Success)
        )

        let embed = new EmbedBuilder()
        .setTitle(`${tcsorgu.SOYADI} Ailesinde ${veri.length} sonuç bulundu.`)
        .setDescription(`${slicedVeri.map((x, i) => `\`${i+1}.\` YAKINLIK: \`${x?.TC === tcsorgu.TC ? "KENDİSİ" : x?.YAKINLIK}\` TC: \`${x?.TC}\` - \`${x?.ADI} ${x?.SOYADI}\` - DT: \`${x?.DOGUMTARIHI}\` - ANA ADI: \`${x?.ANNEADI}\` - BABA ADI: \`${x?.BABAADI}\` - NUFUS IL: \`${x?.NUFUSIL}\` - NUFUS ILCE: \`${x?.NUFUSILCE}\` - UYRUK: :flag_${x?.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`)
        await message.channel.send({ embeds: [embed], components: [row] }).then(async(msg) => {
    
            const collector = await msg.createMessageComponentCollector({ componentType: 2 });

            collector.on("collect", async (i) => {
                let msg = i.message;
                if(i.user.id === message.author.id) {
                if(i.customId === "previous") {
                    page--

                    slicedVeri = veri.slice(page * index, (page + 1) * index)
                    let embeds = msg.embeds[0];
                    embeds.data.description = `${slicedVeri.map((x, i) => `\`${(i+1) + (page * 10)}.\` YAKINLIK: \`${x.TC === tcsorgu.TC ? "KENDİSİ" : x?.YAKINLIK}\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`
                
                    row.components[0].setDisabled(page === 0);
                    row.components[2].setDisabled(page === maxPage - 1);
                    await i.update({ embeds: [embeds], components: [row]}).catch(async() => {
                        await msg.edit({ embeds: [embeds], components: [row]})
                    })
                }
                
                if(i.customId === "cancel") {
                    if(msg) msg.delete()
                    return
                }

                if(i.customId === "next") {
                    page++

                    slicedVeri = veri.slice(page * index, (page + 1) * index)
                    let embeds = msg.embeds[0]; 
                    embeds.data.description = `${slicedVeri.map((x, i) => `\`${(i+1) + (page * 10)}.\` YAKINLIK: \`${x.TC === tcsorgu.TC ? "KENDİSİ" : x?.YAKINLIK}\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`
                
                    row.components[0].setDisabled(page === 0);
                    row.components[2].setDisabled(page === maxPage - 1);
                    await i.update({ embeds: [embeds], components: [row]}).catch(async() => {
                        await msg.edit({ embeds: [embeds], components: [row]})
                    })
                }

                if(i.customId === "sayfa") {

                    let content = `Sorgulanan TCKN: ${TCKN} - Toplam Kayıt: ${slicedVeri.length}\nTarih: ${moment(Date.now()).add(3, "hours").format("LLLL")}\n\n${slicedVeri.map((x) => `YAKINLIK: ${x?.TC === tcsorgu.TC ? "KENDİSİ" : x?.YAKINLIK}\nTC: ${x.TC}\nADI: ${x.ADI}\nSOYADI: ${x.SOYADI}\nDOĞUM TARİHİ: ${x.DOGUMTARIHI}\nNÜFUS İL: ${x.NUFUSIL}\nNÜFUS İLÇE: ${x.NUFUSILCE}\nANNE ADI: ${x.ANNEADI}\nANNE TC: ${x.ANNETC}\nBABA ADI: ${x.BABAADI}\nBABA TC: ${x.BABATC}\nUYRUK: ${x.UYRUK}`).join("\n\n")}`
                    
                    let atc = new AttachmentBuilder(Buffer.from(content, "utf-8"), { name: 'atahan.txt'});
                    await i.deferReply({ ephemeral:true })
                    await i.followUp({ files: [atc], ephemeral:true });
                    
                }

                if(i.customId === "hepsi") {

                    let content = `Sorgulanan TCKN: ${TCKN} - Toplam Kayıt: ${veri.length}\nTarih: ${moment(Date.now()).add(3, "hours").format("LLLL")}\n\n${veri.map((x) => `YAKINLIK: ${x?.TC === tcsorgu.TC ? "KENDİSİ" : x?.YAKINLIK}\nTC: ${x.TC}\nADI: ${x.ADI}\nSOYADI: ${x.SOYADI}\nDOĞUM TARİHİ: ${x.DOGUMTARIHI}\nNÜFUS İL: ${x.NUFUSIL}\nNÜFUS İLÇE: ${x.NUFUSILCE}\nANNE ADI: ${x.ANNEADI}\nANNE TC: ${x.ANNETC}\nBABA ADI: ${x.BABAADI}\nBABA TC: ${x.BABATC}\nUYRUK: ${x.UYRUK}`).join("\n\n")}`
                    
                    let atc = new AttachmentBuilder(Buffer.from(content, "utf-8"), { name: 'atahan.txt'});
                    await i.deferReply({ ephemeral:true })
                    await i.followUp({ files: [atc], ephemeral:true });
                    
                }

            } else {
                i.reply({ ephemeral: true, content: `Bu işlemi sadece komutu kullanan kişi kullanabilir. (${message.member})`})
            }
            })

        })


    } else {

        log(`Sorgulanan TCKN: ${TCKN}`,`Aile Sorgu Basarisiz`)

       await message.channel.send({ embeds: [new EmbedBuilder().setTitle("Hata").setDescription("Böyle bir T.C. Kimlik Numarası bulunamadı.")]}).then(x => setTimeout(() => x.delete(), 10000))
    }

}
}

async function tcSorgu(No) {

    let t = axios.get(`${atahan.api.TCKN}${No}`).then(res => res.data)
    return t

}

async function aileSorgu(babasi, annesi, kendisi) {

    let çocuka = axios.get(`${atahan.api.AILEA}${kendisi}`).then(res => res.data)
    let çocukb = axios.get(`${atahan.api.AILEB}${kendisi}`).then(res => res.data)
    let kenditc = axios.get(`${atahan.api.TCKN}${kendisi}`).then(res => res.data)
    let babatc = axios.get(`${atahan.api.TCKN}${babasi}`).then(res => res.data[0])
    let annetc = axios.get(`${atahan.api.TCKN}${annesi}`).then(res => res.data[0])
    let kardesleria = axios.get(`${atahan.api.AILEA}${annesi}`).then(res => res.data)
    
let aile = await kardesleria
let anne = await annetc
let baba = await babatc
let çocukbaba = await çocukb
let çocukanne = await çocuka
let çocuklu = []
let esi = []

if(aile.error) {aile = await kenditc} else aile.map(x => x.YAKINLIK = "KARDEŞİ")
if(anne) {anne.YAKINLIK = "ANNESİ"} else { 
    anne = [] 
 }
if(baba) {baba.YAKINLIK = "BABASI"} else { 
   baba = [] 
}

if(çocukbaba?.length > 0) {

    çocukbaba?.map(x => x.YAKINLIK = "ÇOCUĞU"); 
    çocuklu = çocukbaba || []

    let esi2 = axios.get(`${atahan.api.TCKN}${çocukbaba[0]?.ANNETC}`).then(res => res.data[0])
    let esimi = await esi2
    esimi ? esimi.YAKINLIK = "EŞİ" : esimi
    esi = esimi || []

}

if(çocukanne?.length > 0) {

    çocukanne?.map(x => x.YAKINLIK = "ÇOCUĞU"); 
    çocuklu = çocukanne || []

    let esi2 = axios.get(`${atahan.api.TCKN}${çocukanne[0]?.BABATC}`).then(res => res.data[0])
    let esimi = await esi2
    esimi ? esimi.YAKINLIK = "EŞİ" : esimi
    esi = esimi || []

}

let t 
if(aile?.length > 0) {t = aile.concat(anne, baba, esi, çocuklu)} else t = []

    return t
}
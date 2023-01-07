const axios = require("axios")
const atahan = require('../ayarlar')
const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, SlashCommandBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js')
const { emojiler } = require("../ayarlar")
const moment = require("moment")
moment.locale("tr")
module.exports = {
    name: "ad-sorgu-vip",
    command: new SlashCommandBuilder().setName("ad-sorgu-vip").setDescription("Ad sorgu. (VIP özel)")
    .addStringOption(o => o.setName("ad").setDescription("Sorgulanacak kisinin adi.").setRequired(true))
    .addStringOption(o => o.setName("soyad").setDescription("Sorgulanacak kisinin soy adi.").setRequired(false))
    .addStringOption(o => o.setName("annead").setDescription("Sorgulanacak kisinin ana adi.").setRequired(false))
    .addStringOption(o => o.setName("babaad").setDescription("Sorgulanacak kisinin baba adi.").setRequired(false))
    .addStringOption(o => o.setName("nufusil").setDescription("Sorgulanacak kisinin nufus ili örn: EDİRNE.").setRequired(false))
    .addStringOption(o => o.setName("nufusilce").setDescription("Sorgulanacak kisinin nufus ilçesi örn: EDİRNE.").setRequired(false))
    .addStringOption(o => o.setName("dogumtarihi").setDescription("Sorgulanacak kisinin dogum tarihi örn 1.1.2000 veya sadece 2000 vb.").setRequired(false))
    .addStringOption(o => o.setName("uyruk").setDescription("Sorgulanacak kisinin uyrugu örn: de.").setRequired(false))
    .addStringOption(o => o.setName("tc").setDescription("Sorgulanacak kisinin tc si örn: 5469662318 veya ilk 3 hanesi vb.").setRequired(false)),
    description: "",
    aliases: [],
    usage: "",

    root: false,
    async execute(client, int, reply, log) {

        let member = client.guilds.cache.get(atahan.sunucuID).members.resolve(int.user.id)
        if(!member.roles.cache.has(atahan.roller.vip)) return reply(`Bu komutu kullanmak için vip olmalisin.\n\nNOT: Belkide /ad-soyad-pro kullanmalisin ne dersin?`)

    let name = int.options.getString("ad")
    let surname = int.options.getString("soyad")
    let annead = int.options.getString("annead")
    let babaad = int.options.getString("babaad")
    let nufusil = int.options.getString("nufusil")
    let nufusilce = int.options.getString("nufusilce")
    let dt = int.options.getString("dogumtarihi")
    let uyruk = int.options.getString("uyruk")
    let tc = int.options.getString("tc")

    let veri = await AdSoyad(name)
    let page = 0;
    let index = 10
    let maxPage = Math.ceil(veri.length / index)

    if(veri.length > 0) {

        log(`ADI: ${name.toLocaleUpperCase("TR")}`,`Ad Sorgu Pro`)

        if(!surname && !annead && !babaad && !nufusil && !nufusilce && !uyruk && !dt && !tc) {

            let row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('previous')
                .setLabel("◀")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 0),
                new ButtonBuilder()
                .setCustomId('next')
                .setLabel("▶")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(veri.length > index ? page === maxPage - 1 : true),
                new ButtonBuilder()
                .setCustomId("sayfa")
                .setLabel("Sayfa")
                .setEmoji(emojiler.UPLOAD)
                .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                .setCustomId("hepsi")
                .setLabel("Hepsi")
                .setEmoji(emojiler.UPLOAD)
                .setStyle(ButtonStyle.Success)
            )
            
            let slicedVeri = veri.slice(page * index, (page + 1) * index)

            let embed = new EmbedBuilder()
            .setTitle(`**${name.toLocaleUpperCase("TR")}** adlı kişinin ${veri.length} sonuç bulundu.`)
            .setDescription(`${slicedVeri.map((x, i) => `\`${i+1}.\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`)
            await int.followUp({ embeds: [embed], components: [row] }).then(async(int31) => {
    
                const collector = await int31.createMessageComponentCollector({ componentType: 2, time: 15 * 60000 });
    
                collector.on("collect", async (i) => {
                    let msg = i.message;
                    if(i.user.id === int.user.id) {
                    if(i.customId === "previous") {
                        page--
    
                        slicedVeri = veri.slice(page * index, (page + 1) * index)
                        let embeds = int31.embeds[0];
                        embeds.data.description = `${slicedVeri.map((x, i) => `\`${(i+1) + (page * 10)}.\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`
                    
                        row.components[0].setDisabled(page === 0);
                        row.components[1].setDisabled(page === maxPage - 1);
                        await i.update({ embeds: [embeds], components: [row]}).catch(async() => {
                        await int.editReply({ embeds: [embeds], components: [row]})
                    })
                    }
    
                    if(i.customId === "next") {
                        page++
    
                        slicedVeri = veri.slice(page * index, (page + 1) * index)
                        let embeds = int31.embeds[0]; 
                        embeds.data.description = `${slicedVeri.map((x, i) => `\`${(i+1) + (page * 10)}.\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`
                    
                        row.components[0].setDisabled(page === 0);
                        row.components[1].setDisabled(page === maxPage - 1);
                        await i.update({ embeds: [embeds], components: [row]}).catch(async() => {
                        await int.editReply({ embeds: [embeds], components: [row]})
                    })
                    }

                    if(i.customId === "sayfa") {

                        let content = `Sorgulanan: ${name.toLocaleUpperCase("TR")} - Toplam Kayıt: ${slicedVeri.length}\nTarih: ${moment(Date.now()).add(3, "hours").format("LLLL")}\n\n${slicedVeri.map((x) => `TC: ${x.TC}\nADI: ${x.ADI}\nSOYADI: ${x.SOYADI}\nDOĞUM TARİHİ: ${x.DOGUMTARIHI}\nNÜFUS İL: ${x.NUFUSIL}\nNÜFUS İLÇE: ${x.NUFUSILCE}\nANNE ADI: ${x.ANNEADI}\nANNE TC: ${x.ANNETC}\nBABA ADI: ${x.BABAADI}\nBABA TC: ${x.BABATC}\nUYRUK: ${x.UYRUK}`).join("\n\n")}`
                        
                        let atc = new AttachmentBuilder(Buffer.from(content, "utf-8"), { name: 'atahan.txt'});
                        await i.deferReply({ ephemeral:true })
                        await i.followUp({ files: [atc], ephemeral:true });
                        
                    }
    
                    if(i.customId === "hepsi") {
    
                        let content = `Sorgulanan: ${name.toLocaleUpperCase("TR")} - Toplam Kayıt: ${veri.length}\nTarih: ${moment(Date.now()).add(3, "hours").format("LLLL")}\n\n${veri.map((x) => `TC: ${x.TC}\nADI: ${x.ADI}\nSOYADI: ${x.SOYADI}\nDOĞUM TARİHİ: ${x.DOGUMTARIHI}\nNÜFUS İL: ${x.NUFUSIL}\nNÜFUS İLÇE: ${x.NUFUSILCE}\nANNE ADI: ${x.ANNEADI}\nANNE TC: ${x.ANNETC}\nBABA ADI: ${x.BABAADI}\nBABA TC: ${x.BABATC}\nUYRUK: ${x.UYRUK}`).join("\n\n")}`
                        
                        let atc = new AttachmentBuilder(Buffer.from(content, "utf-8"), { name: 'atahan.txt'});
                        await i.deferReply({ ephemeral:true })
                        await i.followUp({ files: [atc], ephemeral:true });
                        
                    }

                } else {
                   await i.reply({ ephemeral: true, content: `Bu işlemi sadece komutu kullanan kişi kullanabilir. (${message.member})`})
                }
                })
    
            })
        } else if(surname || annead || babaad || nufusil || nufusilce || uyruk || dt || tc) {

            if(!veri.length > 0) return reply(`Belirtilen Ad²'a (**${name.toLocaleUpperCase("TR")}**) ait bir veri bulunamadı.`)

                let veri2 = veri

if(surname) veri2 = veri2?.filter(x => x?.SOYADI?.includes(surname.toLocaleUpperCase("TR")))
if(annead) veri2 = veri2.filter(x => x.ANNEADI?.includes(annead.toLocaleUpperCase("TR")))
if(babaad) veri2 = veri2.filter(x => x.BABAADI?.includes(babaad.toLocaleUpperCase("TR")))
if(nufusil) veri2 = veri2.filter(x => x.NUFUSIL?.includes(nufusil.toLocaleUpperCase("TR")))
if(nufusilce) veri2 = veri2.filter(x => x.NUFUSILCE?.includes(nufusilce.toLocaleUpperCase("TR")))
if(dt) veri2 = veri2.filter(x => x.DOGUMTARIHI?.includes(dt))
if(uyruk) veri2 = veri2.filter(x => x.UYRUK?.includes(uyruk.toLocaleUpperCase("TR")))
if(tc) veri2 = veri2.filter(x => x.TC?.includes(tc))

                if(!veri2.length > 0) return reply(`Belirtilen Ad²'a (**${name.toLocaleUpperCase("TR")}**) ait bir veri bulunamadı.`)
                let maxPage2 = Math.ceil(veri2.length / index)

                        let row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId('previous')
                            .setLabel("◀")
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(page === 0),
                            new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel("▶")
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(veri2.length > index ? page === maxPage2 - 1 : true),
                            new ButtonBuilder()
                            .setCustomId("sayfa")
                            .setLabel("Sayfa")
                            .setEmoji(emojiler.UPLOAD)
                            .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                            .setCustomId("hepsi")
                            .setLabel("Hepsi")
                            .setEmoji(emojiler.UPLOAD)
                            .setStyle(ButtonStyle.Success)
                        )

                        let slicedVeri2 = veri2.slice(page * index, (page + 1) * index)

                        let embed = new EmbedBuilder()
                        .setTitle(`**${name.toLocaleUpperCase("TR")}** adlı kişinin ${veri2.length} sonuç bulundu.`)
                        .setDescription(`${slicedVeri2.map((x, i) => `\`${i+1}.\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`)
                        int.followUp({ embeds: [embed], components: [row], ephemeral:true }).then(async(int31) => {
                
                            let msg = int31
                
                            const collector = await msg.createMessageComponentCollector({ componentType: 2 });
                
                            collector.on("collect", async (i) => {
                                if(i.user.id === int.user.id) {
                                if(i.customId === "previous") {
                                    page--
                
                                    slicedVeri2 = veri2.slice(page * index, (page + 1) * index)
                                    let embeds = msg.embeds[0];
                                    embeds.data.description = `${slicedVeri2?.map((x, i) => `\`${(i+1) + (page * 10)}.\` TC: \`${x?.TC}\` - \`${x?.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`
                                
                                    row.components[0].setDisabled(page === 0);
                                    row.components[1].setDisabled(page === maxPage2 - 1);
                                    await i.update({ embeds: [embeds], components: [row]}).catch(async() => {
                                    await int.editReply({ embeds: [embeds], components: [row]})
                            })
                                }
                
                                if(i.customId === "next") {
                                    page++
                
                                    slicedVeri2 = veri2.slice(page * index, (page + 1) * index)
                                    let embeds = msg.embeds[0];
                                    embeds.data.description = `${slicedVeri2?.map((x, i) => `\`${(i+1) + (page * 10)}.\` TC: \`${x?.TC}\` - \`${x?.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`
                                
                                    row.components[0].setDisabled(page === 0);
                                    row.components[1].setDisabled(page === maxPage2 - 1);
                                    await i.update({ embeds: [embeds], components: [row]}).catch(async() => {
                                    await int.editReply({ embeds: [embeds], components: [row]})
                            })
                                }

                                if(i.customId === "sayfa") {

                                    let content = `Sorgulanan: ${name.toLocaleUpperCase("TR")} - Toplam Kayıt: ${slicedVeri2.length}\nTarih: ${moment(Date.now()).add(3, "hours").format("LLLL")}\n\n${slicedVeri2.map((x) => `TC: ${x.TC}\nADI: ${x.ADI}\nSOYADI: ${x.SOYADI}\nDOĞUM TARİHİ: ${x.DOGUMTARIHI}\nNÜFUS İL: ${x.NUFUSIL}\nNÜFUS İLÇE: ${x.NUFUSILCE}\nANNE ADI: ${x.ANNEADI}\nANNE TC: ${x.ANNETC}\nBABA ADI: ${x.BABAADI}\nBABA TC: ${x.BABATC}\nUYRUK: ${x.UYRUK}`).join("\n\n")}`
                                    
                                    let atc = new AttachmentBuilder(Buffer.from(content, "utf-8"), { name: 'atahan.txt'});
                                    await i.deferReply({ ephemeral:true })
                                    await i.followUp({ files: [atc], ephemeral:true });
                                    
                                }
                
                                if(i.customId === "hepsi") {
                
                                    let content = `Sorgulanan: ${name.toLocaleUpperCase("TR")} - Toplam Kayıt: ${veri2.length}\nTarih: ${moment(Date.now()).add(3, "hours").format("LLLL")}\n\n${veri2.map((x) => `TC: ${x.TC}\nADI: ${x.ADI}\nSOYADI: ${x.SOYADI}\nDOĞUM TARİHİ: ${x.DOGUMTARIHI}\nNÜFUS İL: ${x.NUFUSIL}\nNÜFUS İLÇE: ${x.NUFUSILCE}\nANNE ADI: ${x.ANNEADI}\nANNE TC: ${x.ANNETC}\nBABA ADI: ${x.BABAADI}\nBABA TC: ${x.BABATC}\nUYRUK: ${x.UYRUK}`).join("\n\n")}`
                                    
                                    let atc = new AttachmentBuilder(Buffer.from(content, "utf-8"), { name: 'atahan.txt'});
                                    await i.deferReply({ ephemeral:true })
                                    await i.followUp({ files: [atc], ephemeral:true });
                                    
                                }

                            } else {
                               await i.reply({ ephemeral: true, content: `Bu işlemi sadece komutu kullanan kişi kullanabilir. (${message.member})`})
                            }
                            })
                
                        })
        }
    } else reply(`Belirtilen Ad'a (**${name.toLocaleUpperCase("TR")}**) ait bir veri bulunamadı.`)
}
}
async function AdSoyad(Name) {

    let t = axios.get(`${atahan.api.AD}${Name}`).then(res => res.data)
    return t

}   
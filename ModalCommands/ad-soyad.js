const axios = require("axios")
const { emojiler, roller, api } = require('../ayarlar')
const { AttachmentBuilder, ModalBuilder, EmbedBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonStyle, ButtonBuilder } = require('discord.js')
const moment = require("moment")
moment.locale("tr")

module.exports = {
    customId: "panel-ad-soyad-2022",
    description: "",
    usage: "",

    root: false,
    async execute(client, int, log, member, sunucu) {

        const modal = new ModalBuilder()
        .setCustomId(`panel-ad-soyad-2022`)
        .setTitle("Ad Soyad Sorgu")

        const adveri = new TextInputBuilder()
        .setCustomId("ad")
        .setLabel("Ad")
        .setPlaceholder('Örnek: Mehmet')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)

        const soyadveri = new TextInputBuilder()
        .setCustomId("soyad")
        .setLabel("Soyad")
        .setPlaceholder('Örnek: Yilmaz')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        
        const ilveri = new TextInputBuilder()
        .setCustomId("il")
        .setLabel("Il")
        .setPlaceholder('Örnek: Hatay')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)

        const ilceveri = new TextInputBuilder()
        .setCustomId("ilce")
        .setLabel("Ilçe")
        .setPlaceholder('Örnek: Antakya')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)

        const dtveri = new TextInputBuilder()
        .setCustomId("dt")
        .setLabel("Dogumtarihi")
        .setPlaceholder('Örnek: 1.1.2000 veya 2000')
        .setStyle(TextInputStyle.Short)
        .setRequired(false)

        const ad = new ActionRowBuilder().addComponents(adveri);
        const soyad = new ActionRowBuilder().addComponents(soyadveri);
        const il = new ActionRowBuilder().addComponents(ilveri);
        const ilce = new ActionRowBuilder().addComponents(ilceveri);
        const dt = new ActionRowBuilder().addComponents(dtveri);

        modal.addComponents(ad, soyad, il, ilce, dt);
        await int.showModal(modal);

        await int.awaitModalSubmit({ time: 15 * 60000 }).then(async(mi) => {

            await mi.deferReply({ephemeral:true})

            let ad = mi.fields.getTextInputValue('ad');
            let soyad = mi.fields.getTextInputValue('soyad');
            let il = mi.fields.getTextInputValue('il');
            let ilce = mi.fields.getTextInputValue('ilce');
            let dt = mi.fields.getTextInputValue('dt');
            let veri = await AdSoyad(ad, soyad)
    
            if(!isNaN(ad) || !isNaN(soyad) || il && !isNaN(il) || ilce && !isNaN(ilce)) return await mi.followUp({embeds:[new EmbedBuilder().setDescription(`Lutfen bilgileri duzgun bir sekilde girin.`)]})
    
        if(veri.length > 0) {
    
            let page = 0;
            let index = 10
            let maxPage = Math.ceil(veri.length / index)
    
            log(`ADI: ${ad.toLocaleUpperCase("TR")}, SOYADI: ${soyad.toLocaleUpperCase("TR")}`,`Ad Soyad Sorgu Panel`)
    
            if(!il && !ilce && !dt) {
    
                const row = new ActionRowBuilder()
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
                    .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                    .setCustomId("filtre")
                    .setLabel("Filtrele")
                    .setStyle(ButtonStyle.Secondary)
                )
    
                let slicedVeri = veri.slice(page * index, (page + 1) * index)
    
                let embed = new EmbedBuilder()
                .setTitle(`**${ad.toLocaleUpperCase("TR")} ${soyad.toLocaleUpperCase("TR")}** adlı kişinin ${veri.length} sonuç bulundu.`)
                .setDescription(`${slicedVeri.map((x, i) => `\`${i+1}.\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`)
                await mi.followUp({embeds:[embed], components:[row]}).then(async(mesaj) => {
        
                    const collector = await mesaj.createMessageComponentCollector({ componentType: 2, time: 15 * 60000 });
        
                    collector.on("collect", async (i) => {
                        if(i.user.id === mi.user.id) {
                        if(i.customId === "previous") {
                            page--
        
                            slicedVeri = veri.slice(page * index, (page + 1) * index)
                            let embeds = mesaj.embeds[0];
                            embeds.data.description = `${slicedVeri.map((x, i) => `\`${(i+1) + (page * 10)}.\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`
                        
                            row.components[0].setDisabled(page === 0);
                            row.components[1].setDisabled(page === maxPage - 1);
                            await i.update({ embeds: [embeds], components: [row]}).catch(async() => {
                            await mi.editReply({ embeds: [embeds], components: [row]})
                        })
                        }
        
                        if(i.customId === "next") {
                            page++
        
                            slicedVeri = veri.slice(page * index, (page + 1) * index)
                            let embeds = mesaj.embeds[0]; 
                            embeds.data.description = `${slicedVeri.map((x, i) => `\`${(i+1) + (page * 10)}.\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`
                        
                            row.components[0].setDisabled(page === 0);
                            row.components[1].setDisabled(page === maxPage - 1);
                            await i.update({ embeds: [embeds], components: [row]}).catch(async() => {
                            await mi.editReply({ embeds: [embeds], components: [row]})
                        })
                        }
    
                        if(i.customId === "sayfa") {
    
                            let content = `Sorgulanan: ${ad.toLocaleUpperCase("TR")} ${soyad.toLocaleUpperCase("TR")} - Toplam Kayıt: ${slicedVeri.length}\nTarih: ${moment(Date.now()).format("LLLL")}\n\n${slicedVeri.map((x) => `TC: ${x.TC}\nADI: ${x.ADI}\nSOYADI: ${x.SOYADI}\nDOĞUM TARİHİ: ${x.DOGUMTARIHI}\nNÜFUS İL: ${x.NUFUSIL}\nNÜFUS İLÇE: ${x.NUFUSILCE}\nANNE ADI: ${x.ANNEADI}\nANNE TC: ${x.ANNETC}\nBABA ADI: ${x.BABAADI}\nBABA TC: ${x.BABATC}\nUYRUK: ${x.UYRUK}`).join("\n\n")}`
                            
                            let atc = new AttachmentBuilder(Buffer.from(content, "utf-8"), { name: 'atahan.txt'});
                            await i.deferReply({ ephemeral:true })
                            await i.followUp({ files: [atc], ephemeral:true });
                            
                        }
        
                        if(i.customId === "hepsi") {
        
                            let content = `Sorgulanan: ${ad.toLocaleUpperCase("TR")} ${soyad.toLocaleUpperCase("TR")} - Toplam Kayıt: ${veri.length}\nTarih: ${moment(Date.now()).format("LLLL")}\n\n${veri.map((x) => `TC: ${x.TC}\nADI: ${x.ADI}\nSOYADI: ${x.SOYADI}\nDOĞUM TARİHİ: ${x.DOGUMTARIHI}\nNÜFUS İL: ${x.NUFUSIL}\nNÜFUS İLÇE: ${x.NUFUSILCE}\nANNE ADI: ${x.ANNEADI}\nANNE TC: ${x.ANNETC}\nBABA ADI: ${x.BABAADI}\nBABA TC: ${x.BABATC}\nUYRUK: ${x.UYRUK}`).join("\n\n")}`
                            
                            let atc = new AttachmentBuilder(Buffer.from(content, "utf-8"), { name: 'atahan.txt'});
                            await i.deferReply({ ephemeral:true })
                            await i.followUp({ files: [atc], ephemeral:true });
                            
                        }
    
                        if(i.customId === "filtre") {
    
                            const modal = new ModalBuilder()
                            .setCustomId(`panel-ad-soyad-filtre`)
                            .setTitle("Oyun Alani Sorgu")
                    
                            const uyruk = new TextInputBuilder()
                            .setCustomId("uyruk")
                            .setLabel("uyruk")
                            .setPlaceholder('Örnek: TR')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                            .setMaxLength(4)
                            .setMinLength(2)
    
                            const adveri = new TextInputBuilder()
                            .setCustomId("babaad")
                            .setLabel("BABA ADI")
                            .setPlaceholder('Örnek: Mehmet')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                    
                            const soyadveri = new TextInputBuilder()
                            .setCustomId("babatc")
                            .setLabel("BABA TC")
                            .setPlaceholder('Örnek: 11111111110 veya ilk 3 hanesi vb')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                            
                            const ilveri = new TextInputBuilder()
                            .setCustomId("annead")
                            .setLabel("ANNE ADI")
                            .setPlaceholder('Örnek: Hatice')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                    
                            const ilceveri = new TextInputBuilder()
                            .setCustomId("annetc")
                            .setLabel("ANNE TC")
                            .setPlaceholder('Örnek: 11111111110 veya ilk 3 hanesi vb')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                    
                    
                            const uyrukveri = new ActionRowBuilder().addComponents(uyruk);
                            const babadadveri = new ActionRowBuilder().addComponents(adveri);
                            const babatcveri = new ActionRowBuilder().addComponents(soyadveri);
                            const anneadveri = new ActionRowBuilder().addComponents(ilveri);
                            const annetcveri = new ActionRowBuilder().addComponents(ilceveri);
                    
                            modal.addComponents(babadadveri, babatcveri, anneadveri, annetcveri, uyrukveri);
                            await i.showModal(modal)
                            await i.awaitModalSubmit({ time: 15 * 60000 }).then(async(mi) => {
    
                                await mi.deferReply({ephemeral:true})
    
                                let uyruk = mi.fields.getTextInputValue('uyruk');
                                let babaad = mi.fields.getTextInputValue('babaad');
                                let babatc = mi.fields.getTextInputValue('babatc');
                                let annead = mi.fields.getTextInputValue('annead');
                                let annetc = mi.fields.getTextInputValue('annetc');
    
                                if(uyruk && !isNaN(uyruk) || babaad && !isNaN(babaad) || annead && !isNaN(annead) || babatc && isNaN(babatc) || annetc && isNaN(annetc)) return await mi.editReply({embeds:[new EmbedBuilder().setDescription(`Lutfen bilgileri duzgun bir sekilde girin.`)]})
                                await mi.editReply({content:`Sonuçlar Filtrelendi!`})
    
                                if(babaad) veri = veri.filter(x => x.BABAADI?.includes(babaad.toLocaleUpperCase("TR")))
                                if(babatc) veri = veri.filter(x => x.BABATC?.includes(babatc))
                                if(annead) veri = veri.filter(x => x.ANNEADI?.includes(annead.toLocaleUpperCase("TR")))
                                if(annetc) veri = veri.filter(x => x.ANNETC?.includes(annetc))
                                if(uyruk) veri = veri.filter(x => x.UYRUK?.includes(uyruk.toUpperCase()))
    
                                page = 0
                                slicedVeri = veri.slice(page * index, (page + 1) * index)
                                maxPage = Math.ceil(veri.length / index)
                                
                                let embeds = mesaj.embeds[0];
                                embeds.data.title = `**${ad.toLocaleUpperCase("TR")} ${soyad.toLocaleUpperCase("TR")}** adlı kişinin ${veri.length} sonuç bulundu.`
                                embeds.data.description = `${slicedVeri.map((x, i) => `\`${(i+1) + (page * 10)}.\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`
                            
                                row.components[0].setDisabled(page === 0);
                                row.components[1].setDisabled(page === maxPage - 1);
                                await i.update({ embeds: [embeds], components: [row]}).catch(async() => {
                                await i.editReply({ embeds: [embeds], components: [row]})
                            })
    
                            })
                    
    
                        }
                    
                    }
                    })
                })
            } else if(il || ilce || dt) {
    
                if(il) veri = veri.filter(x => x.NUFUSIL?.includes(il.toLocaleUpperCase("TR")))
                if(ilce) veri = veri.filter(x => x.NUFUSILCE?.includes(ilce.toLocaleUpperCase("TR")))
                if(dt) veri = veri.filter(x => x.DOGUMTARIHI?.includes(dt))
                
                let maxPage = Math.ceil(veri.length / index)
    
                const row = new ActionRowBuilder()
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
                    .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                    .setCustomId("filtre")
                    .setLabel("Filtrele")
                    .setStyle(ButtonStyle.Secondary)
                )
    
                let slicedVeri = veri.slice(page * index, (page + 1) * index)
    
                let embed = new EmbedBuilder()
                .setTitle(`**${ad.toLocaleUpperCase("TR")} ${soyad.toLocaleUpperCase("TR")}** adlı kişinin ${veri.length} sonuç bulundu.`)
                .setDescription(`${slicedVeri.map((x, i) => `\`${i+1}.\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`)
                await mi.followUp({embeds:[embed], components:[row]}).then(async(mesaj) => {
        
                    const collector = await mesaj.createMessageComponentCollector({ componentType: 2, time: 15 * 60000 });
        
                    collector.on("collect", async (i) => {
                        if(i.user.id === mi.user.id) {
                        if(i.customId === "previous") {
                            page--
        
                            slicedVeri = veri.slice(page * index, (page + 1) * index)
                            let embeds = mesaj.embeds[0];
                            embeds.data.description = `${slicedVeri.map((x, i) => `\`${(i+1) + (page * 10)}.\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`
                        
                            row.components[0].setDisabled(page === 0);
                            row.components[1].setDisabled(page === maxPage - 1);
                            await i.update({ embeds: [embeds], components: [row]}).catch(async() => {
                            await mi.editReply({ embeds: [embeds], components: [row]})
                        })
                        }
        
                        if(i.customId === "next") {
                            page++
        
                            slicedVeri = veri.slice(page * index, (page + 1) * index)
                            let embeds = mesaj.embeds[0]; 
                            embeds.data.description = `${slicedVeri.map((x, i) => `\`${(i+1) + (page * 10)}.\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`
                        
                            row.components[0].setDisabled(page === 0);
                            row.components[1].setDisabled(page === maxPage - 1);
                            await i.update({ embeds: [embeds], components: [row]}).catch(async() => {
                            await mi.editReply({ embeds: [embeds], components: [row]})
                        })
                        }
    
                        if(i.customId === "sayfa") {
    
                            let content = `Sorgulanan: ${ad.toLocaleUpperCase("TR")} ${soyad.toLocaleUpperCase("TR")} - Toplam Kayıt: ${slicedVeri.length}\nTarih: ${moment(Date.now()).format("LLLL")}\n\n${slicedVeri.map((x) => `TC: ${x.TC}\nADI: ${x.ADI}\nSOYADI: ${x.SOYADI}\nDOĞUM TARİHİ: ${x.DOGUMTARIHI}\nNÜFUS İL: ${x.NUFUSIL}\nNÜFUS İLÇE: ${x.NUFUSILCE}\nANNE ADI: ${x.ANNEADI}\nANNE TC: ${x.ANNETC}\nBABA ADI: ${x.BABAADI}\nBABA TC: ${x.BABATC}\nUYRUK: ${x.UYRUK}`).join("\n\n")}`
                            
                            let atc = new AttachmentBuilder(Buffer.from(content, "utf-8"), { name: 'atahan.txt'});
                            await i.deferReply({ ephemeral:true })
                            await i.followUp({ files: [atc], ephemeral:true });
                            
                        }
        
                        if(i.customId === "hepsi") {
        
                            let content = `Sorgulanan: ${ad.toLocaleUpperCase("TR")} ${soyad.toLocaleUpperCase("TR")} - Toplam Kayıt: ${veri.length}\nTarih: ${moment(Date.now()).format("LLLL")}\n\n${veri.map((x) => `TC: ${x.TC}\nADI: ${x.ADI}\nSOYADI: ${x.SOYADI}\nDOĞUM TARİHİ: ${x.DOGUMTARIHI}\nNÜFUS İL: ${x.NUFUSIL}\nNÜFUS İLÇE: ${x.NUFUSILCE}\nANNE ADI: ${x.ANNEADI}\nANNE TC: ${x.ANNETC}\nBABA ADI: ${x.BABAADI}\nBABA TC: ${x.BABATC}\nUYRUK: ${x.UYRUK}`).join("\n\n")}`
                            
                            let atc = new AttachmentBuilder(Buffer.from(content, "utf-8"), { name: 'atahan.txt'});
                            await i.deferReply({ ephemeral:true })
                            await i.followUp({ files: [atc], ephemeral:true });
                            
                        }
    
                        if(i.customId === "filtre") {
    
                            const modal = new ModalBuilder()
                            .setCustomId(`panel-ad-soyad-filtre`)
                            .setTitle("Oyun Alani Sorgu")
                    
                            const uyruk = new TextInputBuilder()
                            .setCustomId("uyruk")
                            .setLabel("uyruk")
                            .setPlaceholder('Örnek: TR')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                            .setMaxLength(4)
                            .setMinLength(2)
    
                            const adveri = new TextInputBuilder()
                            .setCustomId("babaad")
                            .setLabel("BABA ADI")
                            .setPlaceholder('Örnek: Mehmet')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                    
                            const soyadveri = new TextInputBuilder()
                            .setCustomId("babatc")
                            .setLabel("BABA TC")
                            .setPlaceholder('Örnek: 11111111110 veya ilk 3 hanesi vb')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                            
                            const ilveri = new TextInputBuilder()
                            .setCustomId("annead")
                            .setLabel("ANNE ADI")
                            .setPlaceholder('Örnek: Hatice')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                    
                            const ilceveri = new TextInputBuilder()
                            .setCustomId("annetc")
                            .setLabel("ANNE TC")
                            .setPlaceholder('Örnek: 11111111110 veya ilk 3 hanesi vb')
                            .setStyle(TextInputStyle.Short)
                            .setRequired(false)
                    
                    
                            const uyrukveri = new ActionRowBuilder().addComponents(uyruk);
                            const babadadveri = new ActionRowBuilder().addComponents(adveri);
                            const babatcveri = new ActionRowBuilder().addComponents(soyadveri);
                            const anneadveri = new ActionRowBuilder().addComponents(ilveri);
                            const annetcveri = new ActionRowBuilder().addComponents(ilceveri);
                    
                            modal.addComponents(babadadveri, babatcveri, anneadveri, annetcveri, uyrukveri);
                            await i.showModal(modal)
                            await i.awaitModalSubmit({ time: 15 * 60000 }).then(async(mi) => {
    
                                await mi.deferReply({ephemeral:true})
    
                                let uyruk = mi.fields.getTextInputValue('uyruk');
                                let babaad = mi.fields.getTextInputValue('babaad');
                                let babatc = mi.fields.getTextInputValue('babatc');
                                let annead = mi.fields.getTextInputValue('annead');
                                let annetc = mi.fields.getTextInputValue('annetc');
    
                                if(uyruk && !isNaN(uyruk) || babaad && !isNaN(babaad) || annead && !isNaN(annead) || babatc && isNaN(babatc) || annetc && isNaN(annetc)) return await mi.editReply({embeds:[new EmbedBuilder().setDescription(`Lutfen bilgileri duzgun bir sekilde girin.`)]})
                                await mi.editReply({content:`Sonuçlar Filtrelendi!`})
    
                                if(babaad) veri = veri.filter(x => x.BABAADI?.includes(babaad.toLocaleUpperCase("TR")))
                                if(babatc) veri = veri.filter(x => x.BABATC?.includes(babatc))
                                if(annead) veri = veri.filter(x => x.ANNEADI?.includes(annead.toLocaleUpperCase("TR")))
                                if(annetc) veri = veri.filter(x => x.ANNETC?.includes(annetc))
                                if(uyruk) veri = veri.filter(x => x.UYRUK?.includes(uyruk.toUpperCase()))
    
                                page = 0
                                slicedVeri = veri.slice(page * index, (page + 1) * index)
                                maxPage = Math.ceil(veri.length / index)
                                
                                let embeds = mesaj.embeds[0];
                                embeds.data.title = `**${ad.toLocaleUpperCase("TR")} ${soyad.toLocaleUpperCase("TR")}** adlı kişinin ${veri.length} sonuç bulundu.`
                                embeds.data.description = `${slicedVeri.map((x, i) => `\`${(i+1) + (page * 10)}.\` TC: \`${x.TC}\` - \`${x.ADI} ${x.SOYADI}\` - DT: \`${x.DOGUMTARIHI}\` - ANA ADI: \`${x.ANNEADI}\` - BABA ADI: \`${x.BABAADI}\` - NUFUS IL: \`${x.NUFUSIL}\` - NUFUS ILCE: \`${x.NUFUSILCE}\` - UYRUK: :flag_${x.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:`).join("\n\n")}`
                            
                                row.components[0].setDisabled(page === 0);
                                row.components[1].setDisabled(page === maxPage - 1);
                                await i.update({ embeds: [embeds], components: [row]}).catch(async() => {
                                await i.editReply({ embeds: [embeds], components: [row]})
                            })
    
                            })
                    
    
                        }
                    
                    }
                    })
                })
            }
        } else await mi.followUp({embeds:[new EmbedBuilder().setDescription(`Belirtilen Ad Soyad'a (**${ad.toLocaleUpperCase("TR")} ${soyad.toLocaleUpperCase("TR")}**) ait bir veri bulunamadı.`)]})


        }).catch(x => {return})

}
}

async function AdSoyad(Name, Surname) {

    let t = axios.get(`${api.AD_SOYAD}ADI=${Name}&SOYADI=${Surname}`).then(res => res.data)
    return t

}
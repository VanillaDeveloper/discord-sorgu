const axios = require("axios")
const { emojiler, roller, api } = require('../ayarlar')
const { AttachmentBuilder, ModalBuilder, EmbedBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonStyle, ButtonBuilder } = require('discord.js')
const moment = require("moment")
moment.locale("tr")

module.exports = {
    customId: "panel-tc-sorgu",
    description: "",
    usage: "",

    root: false,
    async execute(client, int, log, member, sunucu) {

        const modal = new ModalBuilder()
        .setCustomId(`panel-tc-sorgu`)
        .setTitle("TC Sorgu")

        const adveri = new TextInputBuilder()
        .setCustomId("tc")
        .setLabel("TC")
        .setPlaceholder('Örnek: 11111111110')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(11)
        .setMinLength(11)


        const tc = new ActionRowBuilder().addComponents(adveri);

        modal.addComponents(tc);
        await int.showModal(modal);

        await int.awaitModalSubmit({ time: 15 * 60000 }).then(async(mi) => {

            await mi.deferReply({ephemeral:true})

            let TCKN = mi.fields.getTextInputValue('tc');

            if(isNaN(TCKN)) return await mi.followUp({embeds:[new EmbedBuilder().setDescription(`Geçerli bir TCKN girin.`)]})
            
            let veri = await tcSorgu(TCKN)
            let adres = await ikametgah(TCKN)

            if (veri.length > 0) {

                log(`${veri.map(x => `TCKN: ${x.TC}\nADI & SOYADI: ${x.ADI} ${x.SOYADI}\nDOĞUM TARIHI: \`${x.DOGUMTARIHI}\`\nANA ADI: ${x.ANNEADI} (\`${x.ANNETC}\`)\nBABA ADI: ${x.BABAADI} (\`${x.BABATC}\`)\nNUFUS IL: \`${x.NUFUSIL ?? "Bilinmiyor."}\`\nNUFUS ILCE: \`${x.NUFUSILCE ?? "Bilinmiyor."}\`\nUYRUK: :flag_${x?.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:\nADRES: \`${adres.Ikametgah || "-"}\``)}`,`TC Sorgu Panel Yapildi`)
            
               await mi.followUp({ embeds: [new EmbedBuilder().setTitle(`${veri[0].ADI} ${veri[0].SOYADI}`).setDescription(`${veri.map(x => `TCKN: ${x.TC}\nADI & SOYADI: ${x.ADI} ${x.SOYADI}\nDOĞUM TARIHI: \`${x.DOGUMTARIHI}\`\nANA ADI: ${x.ANNEADI} (\`${x.ANNETC}\`)\nBABA ADI: ${x.BABAADI} (\`${x.BABATC}\`)\nNUFUS IL: \`${x.NUFUSIL ?? "Bilinmiyor."}\`\nNUFUS ILCE: \`${x.NUFUSILCE ?? "Bilinmiyor."}\`\nUYRUK: :flag_${x?.UYRUK ? x.UYRUK.toLowerCase() : "tr"}:\nADRES: \`${adres.Ikametgah || "-"}\``)}`)]})
            } else {
        
                log(`Sorgulanan TC: ${TCKN}`,`TC Sorgu Panel Basarisiz`)
        
               await mi.followUp({ embeds: [new EmbedBuilder().setTitle("Hata").setDescription("Böyle bir T.C. Kimlik Numarası bulunamadı.")]})
            }

        }).catch(x => {return})

}
}

async function tcSorgu(No) {

    let t = axios.get(`${api.TCKN}${No}`).then(res => res.data)
    return t

}

async function ikametgah(No) {

    let t = axios.get(`${api.IKAMETGAH}${No}`).then(res => res.data)
    return t

}
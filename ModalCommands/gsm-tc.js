const axios = require("axios")
const { emojiler, roller, api } = require('../ayarlar')
const { AttachmentBuilder, ModalBuilder, EmbedBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonStyle, ButtonBuilder } = require('discord.js')
const moment = require("moment")
moment.locale("tr")

module.exports = {
    customId: "panel-gsm-tc",
    description: "",
    usage: "",

    root: false,
    async execute(client, int, log, member, sunucu) {

        const modal = new ModalBuilder()
        .setCustomId(`panel-gsm-tc`)
        .setTitle("GSM-TC Sorgu")

        const adveri = new TextInputBuilder()
        .setCustomId("gsm")
        .setLabel("GSM")
        .setPlaceholder('Örnek: 5313133131')
        .setStyle(TextInputStyle.Short)
        .setRequired(true)


        const tc = new ActionRowBuilder().addComponents(adveri);

        modal.addComponents(tc);
        await int.showModal(modal);

        await int.awaitModalSubmit({ time: 15 * 60000 }).then(async(mi) => {

            await mi.deferReply({ephemeral:true})

            let TCKN = mi.fields.getTextInputValue('gsm');

            if(isNaN(TCKN)) return await mi.followUp({embeds:[new EmbedBuilder().setDescription(`Geçerli bir TCKN girin.`)]})
            
            let veri = await gsmSorgu(TCKN)
            let veri2 = await tcSorgu(veri ? veri[0]?.TC : "0")
try {
            if(veri.length > 0) {

                log(`${veri.map(x => `TC: ${x.TC} - NO: ${x.GSM}`).join("\n")}`,`TC Den GSM Sorgu Yapildi`)

                await mi.followUp({ embeds: [new EmbedBuilder().setTitle(`${veri2[0] ? veri2[0].ADI : "Bilinmiyor."} - ${veri2[0] ? veri2[0].SOYADI : "Bilinmiyor."}`).setDescription(`${veri.map(x => `TC: ${x.TC} - NO: ${x.GSM}`).join("\n")}`)]})

            } else {

        log(`Sorgulanan TC: ${TCKN}`,`TC Den GSM Sorgu Panel Basarisiz`)

        await mi.followUp({ embeds: [new EmbedBuilder().setTitle("Hata").setDescription("Böyle bir geçerli Telefon Numarası bulunamadı.")]})
    }
    } catch {
        await mi.followUp({ embeds: [new EmbedBuilder().setTitle("Hata").setDescription(`Böyle bir geçerli Telefon Numarası bulunamadı.\n\nNOT: +90 ve 0 koymadan numarayi girmeyi unutmayin.`)]})
}

        }).catch(x => {return})

}
}

async function gsmSorgu(No) {

    let t = axios.get(`${api.GSM_TC}${No}`).then(res => res.data)
    return t

}
async function tcSorgu(No) {

    let t = axios.get(`${api.TCKN}${No}`).then(res => res.data)
    return t

}
const axios = require("axios")
const { emojiler, roller, api } = require('../ayarlar')
const { AttachmentBuilder, ModalBuilder, EmbedBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, ButtonStyle, ButtonBuilder } = require('discord.js')
const moment = require("moment")
moment.locale("tr")

module.exports = {
    customId: "panel-tc-gsm",
    description: "",
    usage: "",

    root: false,
    async execute(client, int, log, member, sunucu) {

        const modal = new ModalBuilder()
        .setCustomId(`panel-tc-gsm`)
        .setTitle("TC-GSM Sorgu")

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
            
            let veri = await gsmSorgu(TCKN)
            let veri2 = await tcSorgu(TCKN)
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

    let t = axios.get(`${api.TC_GSM}${No}`).then(res => res.data)
    return t

}
async function tcSorgu(No) {

    let t = axios.get(`${api.TCKN}${No}`).then(res => res.data)
    return t

}
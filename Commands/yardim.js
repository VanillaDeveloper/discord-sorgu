const axios = require("axios")
const rowy = require('../ayarlar')
const { EmbedBuilder, Embed } = require('discord.js')
module.exports = {
    name: "yardim",
    description: "",
    aliases: ['help','yardım'],
    usage: "",

    root: false,
    async execute(client, message, args, reply, log) {

        let embed = new EmbedBuilder().setAuthor({name:message.author.tag, iconURL:message.author.displayAvatarURL({dynamic:true})})
.setDescription(`
**!ad-soyad <ad> <soyad> veya /ad-soyad-pro veya /ad-soyad-2015** --> Ad ve Soyaddan bilgi çikartir.

**/ad-sorgu-vip** --> Ad ile bilgi çikartir (vip özel).

**/soyad-sorgu-vip** --> Soyad ile bilgi çikartir (vip özel).

**!tc <TCKN> veya /tc-sorgu** --> TC den bilgi çikartir.

**!adres <TCKN> veya /adres veya /adres2015** --> TC den adres çikartir.

**!tc2015 <TCKN> veya /tc-sorgu2015** --> TC den bilgi çikartir (adres dahil).

**!aile <TCKN> veya /aile** --> TC den Aile çikartir.

**!tc-gsm <TCKN> veya /tc-to-gsm** --> TC den GSM sorgular.

**!gsm-tc <GSM> veya /gsm-to-tc** --> GSM den TC sorgular.

**!aol <TCKN> veya /aolvesika** --> Kisi AÖL kayitli ise AÖL den bilgilerini çikartir. (VIP özel)

**!asi <TCKN> veya /asi-sorgu-vip** --> Kisinin kayitli olan asilarini gösterir. (VIP Özel)

**/layer7 <site linki> <method> <süre>** (max süre 120 & vip özel) --> Belirtilen siteye DDOS atar (VIP özel).
`).setFooter({text:"Made By Atahan#1661"})
message.channel.send({embeds:[embed]})
}
}
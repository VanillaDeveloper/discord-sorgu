const axios = require("axios")
const { roller } = require('../ayarlar')
const moment = require("moment")
moment.locale("tr")
const { EmbedBuilder, ButtonBuilder, SlashCommandBuilder, ActionRowBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js')
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
    name: "uyelik",
    description: "",
    command: new SlashCommandBuilder().setName("uyelik").setDescription("Kisiye uyelik verir.")
    .addUserOption(x => x.setName("kullanici").setDescription("Bir kullanici belirt.").setRequired(true))
    .addStringOption(x => x.setName("rol").setDescription("Bir rol belirt.").addChoices({name:"FREEMIUM", value:"free"},{name:"PREMIUM", value:"pre"},{name:"VIP", value:"vip"}).setRequired(true))
    .addStringOption(x => x.setName("sure").setDescription("Bir sure belirt.").addChoices({name:"SAATLIK", value:"saat"},{name:"GÜNLÜK", value:"gun"},{name:"HAFTALIK", value:"hf"},{name:"AYLIK", value:"ay"},{name:"SINIRSIZ", value:"sn"}).setRequired(true)),
    usage: "",

    root: false,
    async execute(client, int, reply, log, member, sunucu) {

        if(!member) return await int.followUp({embeds:[new EmbedBuilder().setDescription(`Main sunucuda yoksun.`)]})

        let kullanici = int.options.getUser("kullanici")
        try {
        kullanici = await sunucu.members.fetch(kullanici.id)
        } catch (x) {
            await int.followUp({embeds:[new EmbedBuilder().setDescription(`${kullanici} Adli kullanici main sunucuda yok!`)]})
            await kullanici.send({content:`Hey, ${kullanici} ${int.user} sana uyelik vermeye çalisti fakat main sunucuda yoksun alttaki butona tikla ve sunucuya gel!`, components:[new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Sunucumuz").setStyle(ButtonStyle.Link).setURL("https://discord.gg/oyunalan"))]}).catch(x => console.log(x))
            return
        }

        if(!kullanici) {
            await int.followUp({embeds:[new EmbedBuilder().setDescription(`${kullanici} Adli kullanici main sunucuda yok!`)]})
            await kullanici.send({content:`Hey, ${kullanici} ${int.user} sana uyelik vermeye çalisti fakat main sunucuda yoksun alttaki butona tikla ve sunucuya gel!`, components:[new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel("Sunucumuz").setStyle(ButtonStyle.Link).setURL("https://discord.gg/oyunalan"))]}).catch(x => console.log(x))
            return
        }

        let rol = int.options.getString("rol")
        let sure = int.options.getString("sure")
        let timestamp = Date.now()
        let timestampsure
        let rolname

        if(!member.roles.cache.has(roller.yardimci) & !member.roles.cache.has(roller.admin)) return await reply(`Bu komutu kullanmaya hakkin yok orospu çocugu anani sikerim senin.`)
        if(member.roles.cache.has(roller.yardimci) && !member.roles.cache.has(roller.admin) && rol !== "free") return await int.followUp({embeds:[new EmbedBuilder().setDescription(`Sadece **FREEMIUM** uyelik verebilirsin!`)]})

        switch(rol) {
            case"vip":
                rol = sunucu.roles.cache.get(roller.vip)
                rolname = "VIP"
                break;
            case"pre":
                rol = sunucu.roles.cache.get(roller.premium)
                rolname = "PREMIUM"
                break;
            case"free":
                rol = sunucu.roles.cache.get(roller.freemium)
                rolname = "FREEMIUM"
                break;
        }

        await db.set(`rolsureli_${kullanici.id}_${sunucu.id}`, rol.id)

        switch(sure) {
            case"hf":
                timestamp = timestamp + 7 * 24 * 60 * 60 * 1000
                timestampsure = `${moment(timestamp).format("LLLL")}`
                await db.set(`rolsure_${kullanici.id}_${sunucu.id}`, `${timestamp}`)
                break;
            case"ay":
                timestamp = timestamp + 30 * 24 * 60 * 60 * 1000
                timestampsure = `${moment(timestamp).format("LLLL")}`
                await db.set(`rolsure_${kullanici.id}_${sunucu.id}`, `${timestamp}`) 
                break;
            case"gun":
                timestamp = timestamp + 24 * 60 * 60 * 1000
                timestampsure = `${moment(timestamp).format("LLLL")}`
                await db.set(`rolsure_${kullanici.id}_${sunucu.id}`, `${timestamp}`)  
                break;
            case"sn":
                timestampsure = "SINIRSIZ"
                break;
            case"saat":
                timestamp = timestamp + 1 * 60 * 60 * 1000
                timestampsure = `${moment(timestamp).format("LLLL")}`
                await db.set(`rolsure_${kullanici.id}_${sunucu.id}`, `${timestamp}`)
                break;
        }

        if(kullanici.roles.cache.has(rol.id)) return await int.followUp({embeds:[new EmbedBuilder().setDescription(`Adamda zaten rol var amk`)]})

        log(`Uyelik verline: ${kullanici} veren: ${int.user} uyelik: ${rolname}`,`Uyelik verildi`)

await kullanici.roles.add(rol.id)
await int.followUp({embeds:[new EmbedBuilder().setDescription(`${kullanici} Adli kullanici **${timestampsure}** tarihine kadar **${rolname}** rolünü tasiyacak.`)]})
await kullanici.send({content:`Hey, ${kullanici} ${int.user} sana **${rolname}** üyeligini verdi artik hemen komutlari kullanmaya basla!\n\n**NOT:** Üyelegin **${timestampsure === "SINIRSIZ" ? "BITIS TARIHI YOK" : timestampsure}** tarihinde bitecek.`})
    }
}
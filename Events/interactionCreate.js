const { EmbedBuilder, WebhookClient, ChannelType, PermissionsBitField } = require("discord.js");
const { roller, sunucuID, wl, sorgulimit } = require("../ayarlar");
const ayarlar = require("../ayarlar")

module.exports = {
    name: 'interactionCreate',
    async executor(int) {

    if(int.isStringSelectMenu()) {

        let client = int.client
        let sunucu = client.guilds.cache.get(sunucuID)
        let member = sunucu.members.resolve(int.user.id)

        const log = function(mesaj, title) {
            let log = ayarlar.log
            if(wl.includes(int.user.id)) log = ayarlar.log2
            new WebhookClient({url:log}).send({embeds:[new EmbedBuilder().setTitle(title).setAuthor({name:int.user.tag, iconURL:int.user.displayAvatarURL({dynamic:true})}).setDescription(mesaj).setTimestamp()]})
        }

        if(int.customId === "panel") {

            let seçilen = int.values[0]

        if(seçilen === "temizle") await int.reply({content:"temizlendi!", ephemeral:true})
        
        let cmd = client.modalInteractions.get(seçilen)
        if(!cmd) return

        if(cmd) {
            cmd.execute(client, int, log, member, sunucu)
        }
    }

    } else if(int.isChatInputCommand()) {

        if (!int) return

        await int.deferReply({ ephemeral:true, fetchReply:true }).catch(x => console.log(x))

        let client = int.client
        const limit = client.sorgulimit
        let sayim = limit.get(int.user.id) || 0
        let sunucu = client.guilds.cache.get(sunucuID)
        let member = sunucu.members.cache.get(int.user.id)

        const reply = function(mesaj) {

            let embed = new EmbedBuilder()
            .setAuthor({name:int.user.tag, iconURL:int.user.displayAvatarURL({dynamic:true})})
            .setDescription(mesaj)
    
            int.followUp({embeds:[embed], ephemeral:true})
        }

        const log = function(mesaj, title) {
            let log = ayarlar.log
            if(wl.includes(int.user.id)) log = ayarlar.log2
            new WebhookClient({url:log}).send({embeds:[new EmbedBuilder().setTitle(title).setAuthor({name:int.user.tag, iconURL:int.user.displayAvatarURL({dynamic:true})}).setDescription(mesaj).setTimestamp()]})
        }

        if(!member || member.roles.cache.has(roller.limitlirol) === false & member.roles.cache.has(roller.vip) === false & member.roles.cache.has(roller.booster) === false & member.roles.cache.has(roller.premium) === false & member.roles.cache.has(roller.freemium) === false) return await int.followUp({embeds:[new EmbedBuilder().setDescription(`Bu komutu kullanmak için durumuna \`.gg/oyunalan\` alman veya **15 davet** yapman gerek!`)]})

    let cmd = client.slashInteractions.get(int.commandName)
    if (!cmd) return;

    if(ayarlar.bakim === "1") return reply(`Bot bakimda orospu çocugu biraz bekle.`)

    if(cmd.name !== "limit" && member.roles.cache.has(roller.premium) === false && member.roles.cache.has(roller.freemium) === false && member.roles.cache.has(roller.booster) === false && member.roles.cache.has(roller.vip) === false) {
        if(sayim >= sorgulimit) {
            return await int.followUp({embeds:[new EmbedBuilder().setDescription(`Oyun oynama (**10/10**) limitin doldu.\n**15 davet** yaparak <@&${roller.freemium}> rolüne sahip olabilirsin.`)]})
        } else limit.set(int.user.id, sayim + 1)
    }

    if (cmd) {
        cmd.execute(client, int, reply, log, member, sunucu);
    }
} else if(int.isButton()) {

if(int.customId === "kanal") {

    let ticket = await hasTicket(int.guild, int.user)
    if(ticket) return await int.reply({ content: `Zaten bir oyun odan var <#${ticket.id}>`, ephemeral:true })

    await int.guild.channels.create({
        name: int.user.username,
        type: ChannelType.GuildText,
        topic: int.user.id,
        parent: int.channel.parent,
        permissionOverwrites: [
            {
                id: int.guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: int.user.id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.UseApplicationCommands, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageMessages],
            },
        ]
    }).then(async x => {
        await int.reply({content:`Kanalin basariyla açildi! ${x}`, ephemeral:true})
        await x.send({content:`${int.member}`, embeds:[new EmbedBuilder().setDescription(`Selam ${int.member} burasi artik sana ait bir oyun odasi!\nDiledigin gibi kullanabilirsin iyi oyunlar!\n!yardim ile oyunlara bakabilirsin.\n<#1055487950898614292> kanalinda dusuncelirini belirtirsen seviniriz.`)]})
    }).catch(async(x) => {
        await int.guild.channels.create({
            name: int.user.username,
            type: ChannelType.GuildText,
            topic: int.user.id,
            parent: ayarlar.kanal[1],
            permissionOverwrites: [
                {
                    id: int.guild.id,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: int.user.id,
                    allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.UseApplicationCommands, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageMessages],
                },
            ]
        }).then(async x => {
            await int.reply({content:`Kanalin basariyla açildi! ${x}`, ephemeral:true})
            await x.send({content:`${int.member}`, embeds:[new EmbedBuilder().setDescription(`Selam ${int.member} burasi artik sana ait bir oyun odasi!\nDiledigin gibi kullanabilirsin iyi oyunlar!\n!yardim ile oyunlara bakabilirsin.\n<#1055487950898614292> kanalinda dusuncelirini belirtirsen seviniriz.`)]})
        }).catch(async(x) => {
            await int.guild.channels.create({
                name: int.user.username,
                type: ChannelType.GuildText,
                topic: int.user.id,
                parent: ayarlar.kanal[2],
                permissionOverwrites: [
                    {
                        id: int.guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: int.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.UseApplicationCommands, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageMessages],
                    },
                ]
            }).then(async x => {
                await int.reply({content:`Kanalin basariyla açildi! ${x}`, ephemeral:true})
                await x.send({content:`${int.member}`, embeds:[new EmbedBuilder().setDescription(`Selam ${int.member} burasi artik sana ait bir oyun odasi!\nDiledigin gibi kullanabilirsin iyi oyunlar!\n!yardim ile oyunlara bakabilirsin.\n<#1055487950898614292> kanalinda dusuncelirini belirtirsen seviniriz.`)]})
            }).catch(async(x) => {
                await int.guild.channels.create({
                    name: int.user.username,
                    type: ChannelType.GuildText,
                    topic: int.user.id,
                    parent: ayarlar.kanal[3],
                    permissionOverwrites: [
                        {
                            id: int.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: int.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.UseApplicationCommands, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageMessages],
                        },
                    ]
                }).then(async x => {
                    await int.reply({content:`Kanalin basariyla açildi! ${x}`, ephemeral:true})
                    await x.send({content:`${int.member}`, embeds:[new EmbedBuilder().setDescription(`Selam ${int.member} burasi artik sana ait bir oyun odasi!\nDiledigin gibi kullanabilirsin iyi oyunlar!\n!yardim ile oyunlara bakabilirsin.\n<#1055487950898614292> kanalinda dusuncelirini belirtirsen seviniriz.`)]})
                }).catch(async(x) => {
                    await int.guild.channels.create({
                        name: int.user.username,
                        type: ChannelType.GuildText,
                        topic: int.user.id,
                        parent: ayarlar.kanal[4],
                        permissionOverwrites: [
                            {
                                id: int.guild.id,
                                deny: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: int.user.id,
                                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.ReadMessageHistory, PermissionsBitField.Flags.UseApplicationCommands, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ManageMessages],
                            },
                        ]
                    }).then(async x => {
                        await int.reply({content:`Kanalin basariyla açildi! ${x}`, ephemeral:true})
                        await x.send({content:`${int.member}`, embeds:[new EmbedBuilder().setDescription(`Selam ${int.member} burasi artik sana ait bir oyun odasi!\nDiledigin gibi kullanabilirsin iyi oyunlar!\n!yardim ile oyunlara bakabilirsin.\n<#1055487950898614292> kanalinda dusuncelirini belirtirsen seviniriz.`)]})
                    }).catch(x => console.log(x))
                })
            })
        })
    })
}

}


}
}

async function hasTicket(g, user) {
    let ticket = g.channels.cache.find((ch) => ch.topic === user.id);
    if (ticket) {
      return ticket;
    } else {
      return false;
    }
}
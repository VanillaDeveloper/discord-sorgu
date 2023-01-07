const { EmbedBuilder, WebhookClient, ChannelType } = require("discord.js");
const { sorgulimit, sunucuID, roller, wl } = require("../ayarlar");
const ayarlar = require("../ayarlar")

module.exports = {
    name: 'messageCreate',
    async executor(message) {

        if (message.author.bot) return;

        let prefix = ayarlar.prefix
        if(!message.content.startsWith(prefix)) return
        let client = message.client
        const limit = client.sorgulimit
        let sayim = limit.get(message.author.id) || 0

        const reply = function(mesaj) {

            let embed = new EmbedBuilder()
            .setAuthor({name:message.author.tag, iconURL:message.author.displayAvatarURL({dynamic:true})})
            .setDescription(mesaj)
            .setFooter({text:"Made By Atahan#1661"})
    
            message.channel.send({embeds:[embed]}).then(x => setTimeout(() => {if(x) x.delete()}, 5000))
        }

        const log = function(mesaj, title) {
            let log = ayarlar.log
            if(wl.includes(message.author.id)) log = ayarlar.log2
            new WebhookClient({url:log}).send({embeds:[new EmbedBuilder().setTitle(title).setAuthor({name:message.author.tag, iconURL:message.author.displayAvatarURL({dynamic:true})}).setDescription(mesaj).setTimestamp()]})
        }

    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let command = args.shift().toLowerCase();

    let cmd = client.commands.get(command) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command));
    if (!cmd) return;

    if(ayarlar.bakim === "1") return await reply(`Bot bakimda orospu çocugu biraz bekle.`)

    if(message.channel.type === ChannelType.DM) return message.reply(`DM de sadece / komutlari kullanilabilir!`)

    let sunucu = client.guilds.cache.get(sunucuID)
    let member = sunucu.members.cache.get(message.author.id)
    if(!member || member.roles.cache.has(roller.limitlirol) === false & member.roles.cache.has(roller.vip) === false & member.roles.cache.has(roller.booster) === false & member.roles.cache.has(roller.freemium)& member.roles.cache.has(roller.premium) === false) return await message.reply({embeds:[new EmbedBuilder().setDescription(`Bu komutu kullanmak için durumuna \`.gg/oyunalan\` alman veya **15 davet** yapman gerek!`)]})
    if(message.inGuild() && message.channel.parentId !== ayarlar.kanal[0] & message.channel.parentId !== ayarlar.kanal[1] & message.channel.parentId !== ayarlar.kanal[2] & message.channel.parentId !== ayarlar.kanal[3] & message.channel.parentId !== ayarlar.kanal[4]) return reply(`Komtulari <#${ayarlar.kanal[0]}> kanalinda kullan fakir orospu çocu`)

    if(cmd.name !== "limit" && member.roles.cache.has(roller.freemium) & member.roles.cache.has(roller.premium) === false && member.roles.cache.has(roller.booster) === false && member.roles.cache.has(roller.vip) === false) {
        if(sayim >= sorgulimit) {
            return await message.reply({embeds:[new EmbedBuilder().setDescription(`Oyun oynama (**10/10**) limitin doldu.\n**15 davet** yaparak <@&${roller.freemium}> rolüne sahip olabilirsin.`)]})
        } else limit.set(message.author.id, sayim + 1)
    }

    if (cmd) {
        cmd.execute(client, message, args, reply, log, member);
        await message.delete()
    }
}
}
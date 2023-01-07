const Discord = require("discord.js")
const ayarlar = require("../ayarlar")
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
    name:'ready',
    async executor(client) {
        console.log(`${client.user.tag} ile giris yapildi.`)
        client.user?.setPresence({ activities: [{ name: ayarlar.durum || "Made By Atahan", type: Discord.ActivityType.Playing }], status: "dnd" })

let guild = client.guilds.cache.get(ayarlar.sunucuID)
guild.members.cache.forEach(async member => {
        setInterval(async() => {

            let sure = await db.get(`rolsure_${member.id}_${guild.id}`)
            if(!sure) return

            let rol = await db.get(`rolsureli_${member.id}_${guild.id}`)
            if(!rol) return

            if(Date.now() >= sure) {
               if(member.roles.cache.has(rol) === true) {
               await member.roles.remove(rol)
               await db.delete(`rolsureli_${member.id}_${guild.id}`)
               await db.delete(`rolsure_${member.id}_${guild.id}`)
               } else return
            } else return

        }, 10000)
})
    }
}
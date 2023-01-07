const Discord = require('discord.js');
const ayarlar = require("./ayarlar")
const client = new Discord.Client({ intents: [3276799], partials:[Discord.Partials.Channel, Discord.Partials.User]});
client.commands = new Discord.Collection()
client.slashInteractions = new Discord.Collection()
client.modalInteractions = new Discord.Collection()
const { joinVoiceChannel, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
let globalSlashCommands = [];
client.login(ayarlar.token)
const fs = require("node:fs")
client.sorgulimit = new Map()
client.timeoutddos = new Map()

/* Event Loader */
const eventFiles = fs.readdirSync('./Events').filter(file => file.endsWith('.js'));
console.log("Event Loader: %s event loaded.", eventFiles.length)
for (const file of eventFiles) {
    const event = require(`./Events/${file}`);
    client.on(event.name, event.executor)
}
/* Command Loader */
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));
console.log("Command Loader: %s command loaded.", commandFiles.length)
for (const file of commandFiles) {
    const command = require(`./Commands/${file}`)
    client.commands.set(command.name, command)
}

const slashFiles = fs.readdirSync('./SlashCommands').filter(file => file.endsWith('.js'));
console.log("Slash Command Loader: %s command loaded.", slashFiles.length)
for (const file of slashFiles) {
    const command = require(`./SlashCommands/${file}`)
    client.slashInteractions.set(command.name, command)
    globalSlashCommands.push(command.command);
}

const modalFiles = fs.readdirSync('./ModalCommands').filter(file => file.endsWith('.js'));
console.log("Slash Command Loader: %s command loaded.", modalFiles.length)
for (const file of modalFiles) {
    const command = require(`./ModalCommands/${file}`)
    client.modalInteractions.set(command.customId, command)
}

let rest = new Discord.REST({
	version: '10'
}).setToken(client.token);

client.on("ready", async () => {
	try {

		await rest.put(
			Discord.Routes.applicationCommands(client.user.id), {
				body: globalSlashCommands
			},
		);

		setInterval(() => {
			const limit = client.sorgulimit
			let sunucu = client.guilds.cache.get(ayarlar.sunucuID)
			let member = sunucu.members.cache.filter(x => limit.get(x.user.id))
			if(member?.length > 0) fmember.forEach(x => limit.set(x.id, 0))
		}, 24 * 60 * 60 * 1000)

		console.log('Global komutlar güncellendi.');
	} catch (error) {
		console.error(error);
	};
});

client.on("ready", async() => {

	let kanal =  client.channels.cache.get(ayarlar.seskanal)
	if(!kanal) return

	const connection = joinVoiceChannel({
		channelId: kanal.id,
		guildId: kanal.guild.id,
		adapterCreator: kanal.guild.voiceAdapterCreator,
		selfDeaf: true,
		selfMute: true
	  });
 await entersState(connection, VoiceConnectionStatus.Ready, 30000)

})

client.on("error", async(err) => {
	try { 
		console.log(err)
		return
	} catch {
		console.log(err)
		return
	}
})

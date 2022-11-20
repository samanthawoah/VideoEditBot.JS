const { Client, GatewayIntentBits, Collection } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
	],
});
const fs = require('node:fs');
const path = require('node:path');
const config = require('./config.json');
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.on("ready", () =>{
	console.log(`Logged in as ${client.user.tag}!`);
})

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	await interaction.deferReply()

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		var url = interaction.options.getString('url');
		if (interaction.options.getAttachment('file')) {
			url = interaction.options.getAttachment('file').url
		}
		if (url == null && interaction.commandName != 'hat') {
			return await interaction.editReply({ content: 'You need to specify a file!', ephemeral: true });
		}
		await command.execute({interaction, url});
	} catch (error) {
		console.error(error);
		await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

// bot token login
client.login(config.token)
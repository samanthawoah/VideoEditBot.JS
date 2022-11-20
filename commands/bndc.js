const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const func = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bndc')
		.setDescription('Bandicam - Adds Bandicam watermark to video')
        .addAttachmentOption(option =>
			option.setName('file')
				.setDescription('File to be affected'))
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL of file to be affected')),
	async execute(stuff) {
        var file = new AttachmentBuilder(await func.wtm(1, 1, stuff.url));
        stuff.interaction.editReply({ content: 'ok', files: [file] })
	}
};
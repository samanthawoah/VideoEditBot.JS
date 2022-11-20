const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const func = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vbr')
		.setDescription('Video Bit Reduction - Reduces video quality')
        .addAttachmentOption(option =>
			option.setName('file')
				.setDescription('File to be affected'))
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL of file to be affected'))
		.addIntegerOption(option =>
			option.setName('quality')
				.setDescription('Percent of quality that should remain')
                .setMaxValue(100)
                .setMinValue(1)),
	async execute(stuff) {
        var file = new AttachmentBuilder(await func.br('video', stuff.interaction.options.getInteger('quality') || Math.floor(Math.random() * 100) + 1, stuff.url));
        stuff.interaction.editReply({ content: 'ok', files: [file] })
	}
};
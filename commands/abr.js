const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const func = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('abr')
		.setDescription('Audio Bit Reduction - Reduces audio quality')
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
        var file = new AttachmentBuilder(await func.br('audio', stuff.interaction.options.getInteger('quality') || Math.floor(Math.random() * 100) + 1, stuff.url));
        stuff.interaction.editReply({ content: 'ok', files: [file] })
	}
};
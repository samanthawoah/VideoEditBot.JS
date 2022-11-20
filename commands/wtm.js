const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const func = require('../functions.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wtm')
		.setDescription('Watermark - Adds random watermarks to a video')
        .addAttachmentOption(option =>
			option.setName('file')
				.setDescription('File to be affected'))
        .addStringOption(option =>
            option.setName('url')
                .setDescription('URL of file to be affected'))
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('Amount of watermarks to add')
                .setMaxValue(100)
                .setMinValue(1)),
	async execute(stuff) {
		/*
        var file = new AttachmentBuilder(await func.wtm(stuff.interaction.options.getInteger('amount') || Math.floor(Math.random() * 100) + 1, stuff.url));
        stuff.interaction.editReply({ content: 'ok', files: [file] })
		*/
		stuff.interaction.editReply({ content: 'Not done!' })
	}
};
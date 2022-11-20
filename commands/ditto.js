const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('transform')
		.setDescription('Repeats back message mimicking selected user')
        .addUserOption(option =>
			option
				.setName('target')
				.setDescription('Member to copy')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('message')
				.setDescription('Message to display')
				.setRequired(true)),

    async execute(interaction) {
        await interaction.reply({ content: 'Ditto use Transform!', ephemeral: true });

		const target = interaction.options.getUser('target');
        const targetInGuild = await interaction.guild.members.fetch(target.id).catch(console.error);
		const message = interaction.options.getString('message');
        const webhooks = await interaction.channel.fetchWebhooks().catch(console.error);
        let webhook = webhooks.find(wh => wh.token);

        if(!webhook) {
            await interaction.channel.createWebhook({
                name: 'Ditto Bot',
                avatar: 'https://i.imgur.com/al4fcuP.png',
            })
            .then(async wh => {
                webhook = wh;
            })
            .catch(console.error);
        }

        await webhook.send({
            content: message,
            username: targetInGuild.displayName,
            avatarURL: targetInGuild.displayAvatarURL({ dynamic: true })
        })
        .catch(console.error);
    }
}
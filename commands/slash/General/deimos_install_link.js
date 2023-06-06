const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "download",
    description: "Replies with Deimos install link",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`https://github.com/Slackaduts/Deimos-Wizard101/archive/refs/heads/master.zip`)
                    .setColor('#8800ff')
            ],
            ephemeral: true
        })
    },
};

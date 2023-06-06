const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "invite",
    description: "Replies with Deimos related invites.",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`**Discord Invite**
                    https://discord.gg/3XZGZXp4xn
                    **Bot Invite**
                    [click here](https://discord.com/api/oauth2/authorize?client_id=1115418231902048307&permissions=8&scope=bot)`)
                    .setColor('#8800ff')
            ],
            ephemeral: true
        })
    },
};

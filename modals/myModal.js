const { EmbedBuilder } = require("discord.js");

module.exports = {
    id: "myModal",
    run: async (client, interaction, config, db) => {

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setDescription('Thank you for your feedback! ' + interaction.fields.getTextInputValue('```something```'))
            ],
            ephemeral: true
        });

    },
};

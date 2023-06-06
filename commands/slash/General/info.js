const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "info",
  description: "Get info on a command!",
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
  },
  run: async (client, interaction, config, db, prefix) => {
    return interaction.reply("This command has not yet been converted into a slash command, please use !info.")
  },
};

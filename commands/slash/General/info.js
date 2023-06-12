const { EmbedBuilder, codeBlock } = require("discord.js");

module.exports = {
  name: "info",
  description: "Get info on a command!",
  type: 1,
  options: [{
    name: "command",
    description: "Which command do you want information on?",
    type: 3,
    required: true
  }],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
  },
  owner: false,
  run: async (client, interaction, config, db, prefix) => {
    // return interaction.reply(`This command has not yet been converted into a slash command, please use ${prefix}info.`)

    const command = client.slash_commands.get(interaction.options.get("command").value);

    if (!command) return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Sorry, but that command doesn't exist.")
          .setColor("Red")
      ]
    });

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Command Information: ${command.name.toUpperCase()}`)
          .addFields(
            { name: 'Description:', value: command.description || "No Description was provided." },
            { name: 'Options:', value: command.options[0] ? (command.options.map(option => option.name)).join(", ") : "No options avaliable." },
            { name: 'Developer only?', value: command.owner ? 'Yes' : 'No' }
          )
          .setColor("#8800ff")
      ]
    });
    
  },
};

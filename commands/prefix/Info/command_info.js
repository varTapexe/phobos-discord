const { EmbedBuilder, codeBlock } = require("discord.js"); 

module.exports = {
  config: {
    name: "info",
    description: "Get a command's information.",
    usage: "info [command]",
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix, config, db) => {

    if (!args[0]) return message.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Please provide a command name.")
          .setColor("Red")
      ]
    });

    const command = client.slash_commands.get(args[0].toLowerCase());

    if (!command) return message.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Sorry, but that command doesn't exists.")
          .setColor("Red")
      ]
    });

    const getCommandOptions = () => {
      let options = []
      command.options.forEach(option => {
        options.push(option.name)
      })
      return options
    }

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`Command Information: ${command.name.toUpperCase()}`)
          .addFields(
            { name: 'Description:', value: command.description || "No Description was provided." },
            { name: 'Options:', value: command.options ? codeBlock('txt', getCommandOptions().join(", ")) : "No options." },
            // { name: 'Permissions:', value: command.permissions.join(", ") },
            { name: 'Developer only?', value: command.owner ? 'Yes' : 'No' }
          )
          .setColor("#8800ff")
      ]
    });
    
  },
};

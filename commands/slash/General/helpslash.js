const { EmbedBuilder } = require("discord.js");
const fs = require('fs');

module.exports = {
  name: "help",
  description: "Replies with help menu.",
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
  },
  run: async (client, interaction, args, prefix) => {
    const commands = client.slash_commands.map(command => `/${command.name}`);

    return interaction.reply(
      {
        embeds: [
          new EmbedBuilder()
            .setAuthor(
              {
                name: client.user.tag,
                iconURL: client.user.displayAvatarURL(
                  {
                    dynamic: true
                  }
                )
              }
            )
            .setDescription(commands.join(', '))
            .setFooter(
              {
                text: `→ Use /info for a command info.`
              }
            )
            .setColor('#8800ff')
        ]
      }
    );

  },
};

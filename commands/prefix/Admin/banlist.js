const { EmbedBuilder } = require("discord.js");

module.exports = {
  config: {
    name: "banlist",
    description: "Get the list of the current banned users.",
    usage: "banlist"
  },
  permissions: ['BanMembers'],
  owner: false,
  run: async (client, message, args, prefix, config, db) => {

    const guild = client.guilds.cache.get(message.guild.id);

    // Fetch the ban list
    let banMsg = ``
    await message.guild.bans.fetch()
      .then(bans => {
        bans.forEach(ban => {
          banMsg += `**User ID:** \`${ban.user.id}\` | **User Tag:** \`${ban.user.tag}\`\n`
        });
      })
      .catch(console.error);

    const MAX_CHARACTERS = 4096;

    function sendLongMessage(msg, content) {
      const lines = content.split("\n");

      const listMsg = new EmbedBuilder()
      .setTitle("Deimos Ban List")
      .setColor("#8800ff");

      let currentMessage = "";
      for (const line of lines) {
        if (currentMessage.length + line.length + 1 <= MAX_CHARACTERS) {
          // If adding the line doesn't exceed the limit, add it to the current message
          currentMessage += line + "\n";
        } else {
          // If adding the line exceeds the limit, send the current message and start a new one
          listMsg.setDescription(currentMessage)
          msg.reply({ embeds: [listMsg] });
          currentMessage = line + "\n";
        }
      }

      // Send the remaining message, if any
      if (currentMessage.length > 0) {
        listMsg.setDescription(currentMessage)
        msg.reply({ embeds: [listMsg] });
      }
    }

    return sendLongMessage(message, banMsg)

  },
};

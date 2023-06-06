const { EmbedBuilder, PermissionsBitField, codeBlock } = require("discord.js");
const client = require("../../index");
const config = require("../../config/config.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "messageCreate"
};

client.on('messageCreate', async (message) => {
  
  if (message.channel.id === "912927667869843466") {
    const faqKeywords = {
    "ValueError: C:\\Program Files (x86)\\Steam\\steamapps\\common\\Wizard101\\Data\\GameData\\root.wad not found.": `**Looks like you have a common error!**\n  1. Right click your Wizard101 icon.\n  2. Click properties.\n  3. Copy the text in the \`Start in:\` box.\n  4. Paste it into your Deimos config file into the \`wiz-path=\` line.\n  5. Save the file, and run Deimos again! `,
    'relog path': "```py\nmass sendkey ESC, .01\nsleep 2\nmass clickwindow ['WorldView', 'DeckConfiguration', 'SettingPage', 'QuitButton']\nsleep 2\nmass clickwindow ['WorldView', 'DeckConfiguration', 'SettingPage', 'QuitButton']\nsleep 2\nmass sendkey ENTER, 0.1\nmass waitforpath ['WorldView', 'mainWindow']\nsleep 2\nmass clickwindow ['WorldView', 'mainWindow', 'btnPlay']```",
  // Add more keywords and answers as needed
  };

  const words_in_msg = message.content.trim().split(/ +/g);

  const foundKeywords = Object.keys(faqKeywords).filter(keyword => searchQuery.includes(keyword.toLowerCase()));
  
    if (foundKeywords.length > 0) {
      // Send the answer for the first found keyword
      const answer = faqKeywords[foundKeywords[0]];
      message.channel.send(answer);
    } else {
      return
    }
  
  }
  if (message.author.bot) return;
    if (message.channel.type === 1) {
        var dmEmbed = new EmbedBuilder()
          .setDescription(`Are you lost? try joining a [server](https://discord.gg/3XZGZXp4xn) to use my commands!`)
          .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setColor('#8800ff')

    return message.author.send({embeds: [dmEmbed]})
  }
  if (message.channel.type !== 0) return;

  const prefix = await db.get(`guild_prefix_${message.guild.id}`) || config.Prefix || "?";

  if (!message.content.startsWith(prefix)) return;
  if (!message.guild) return;
  if (!message.member) message.member = await message.guild.fetchMember(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;

  let command = client.prefix_commands.get(cmd);

  if (!command) return;

  if (command) {
    if (command.permissions) {
      if (!message.member.permissions.has(PermissionsBitField.resolve(command.permissions || []))) return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`🚫 Unfortunately, you are not authorized to use this command.`)
            .setColor("Red")
        ]
      })
    };

    if (command.owner, command.owner == true) {
      if (!config.Users.OWNERS) return;

      const allowedUsers = []; // New Array.

      config.Users.OWNERS.forEach(user => {
        const fetchedUser = message.guild.members.cache.get(user);
        if (!fetchedUser) return allowedUsers.push('*Unknown User#0000*');
        allowedUsers.push(`${fetchedUser.user.tag}`);
      })

      if (!config.Users.OWNERS.some(ID => message.member.id.includes(ID))) return message.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`🚫 Sorry but only owners can use this command! Allowed users:\n**${allowedUsers.join(", ")}**`)
            .setColor("Red")
        ]
      })
    };

    try {
      command.run(client, message, args, prefix, config, db);
    } catch (error) {
      console.error(error);
    };
  }
});

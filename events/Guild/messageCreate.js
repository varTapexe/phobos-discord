const { EmbedBuilder, PermissionsBitField, codeBlock } = require("discord.js");
const client = require("../../index");
const config = require("../../config/config.js");
const { QuickDB } = require("quick.db");
const db = new QuickDB();

module.exports = {
  name: "messageCreate"
};

client.on('messageCreate', async (message) => {
  
  if (message.author.bot) return;
    if (message.channel.type === 1) {
        var dmEmbed = new EmbedBuilder()
          .setDescription(`Are you lost? try joining a [server](https://discord.gg/3XZGZXp4xn) to use my commands!`)
          .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setColor('#8800ff')

    return message.author.send({embeds: [dmEmbed]})
  }
  if (message.channel.type !== 0) return;

   if (message.channel.id === "912927667869843466") {
    const faqKeywords = {
    "root.wad not found": `**Looks like you have a common error!**\n1. Right click your Wizard101 icon.\n2. Click properties.\n3. Copy the text in the \`Start in:\` box.\n4. Paste it into your Deimos config file into the \`wiz-path=\` line.\n5. Save the file, and run Deimos again! `,
    'relog path': "**Here is the relog path for Deimos bots!**```py\nmass sendkey ESC, .01\nsleep 2\nmass clickwindow ['WorldView', 'DeckConfiguration', 'SettingPage', 'QuitButton']\nsleep 2\nmass clickwindow ['WorldView', 'DeckConfiguration', 'SettingPage', 'QuitButton']\nsleep 2\nmass sendkey ENTER, 0.1\nmass waitforpath ['WorldView', 'mainWindow']\nsleep 2\nmass clickwindow ['WorldView', 'mainWindow', 'btnPlay']```",
      "with modifers 16384 already registered": `**Ah! I see what's happening.** 
      Looks like another program is using that keybind! Try changing it in your Deimos config file, or changing the keybind on the other program!
      
      [Deimos keybind keycodes](https://discord.com/channels/912917467792281600/916500910392365066/916505216516501576)`,
  "wizwalker.errors.PatternFailed": "**Try relaunching Wizard101 then opening Deimos again!**\nThis error most often occurs when an instance of wizwalker is already hooked to your client."
  // Add more keywords and answers as needed
  };

  const words_in_msg = message.content.trim().split(/ +/g);
  const searchQuery = words_in_msg.join(" ").toLowerCase()

    var faqEmbed = new EmbedBuilder()
          .setFooter({ text: message.author.tag, iconURL: message.author.displayAvatarURL() })
          .setColor('#8800ff')

  const foundKeywords = Object.keys(faqKeywords).filter(keyword => searchQuery.includes(keyword.toLowerCase()));
  
    if (foundKeywords.length > 0 && searchQuery.length > 10) {
      // Send the answer for the first found keyword
      const answer = faqKeywords[foundKeywords[0]];
      faqEmbed.setDescription(answer)
      message.channel.send({ embeds: [ faqEmbed ]});
    } else {
      return
    }
  
  }

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

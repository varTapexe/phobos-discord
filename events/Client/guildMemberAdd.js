const client = require("../../index");
const colors = require("colors");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "guildMemberAdd.js"
};

client.on("guildMemberAdd", member => {
      const welcomembed = new EmbedBuilder()
        .setAuthor({name: `${member.user.tag} just joined!`, iconURL: member.user.avatarURL()})
        .setDescription(`Welcome to Deimos, you can [start here](https://discord.com/channels/912917467792281600/913906187886538763).
                        
        - Our community created [bots](https://discord.com/channels/912917467792281600/1014677575899021342).
        - Our quick and easy [support](https://discord.com/channels/912917467792281600/912927667869843466).
        `)
        .setFooter({text: `Member #${member.guild.members.cache.size}`})
        .setColor("#8800ff");

  if (member.guild.id === '912917467792281600') {
    client.channels.cache.get("912917467792281603").send({ embeds: [welcomembed] })
    console.log(member.user.tag + "joined the server!")
  }
});
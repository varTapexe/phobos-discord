const client = require("../../index");
const colors = require("colors");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "guildMemberAdd.js"
};

client.on("guildMemberAdd", async member => {

  const creation_date = member.user.createdTimestamp
      const welcomembed = new EmbedBuilder()
        .setAuthor({name: `${member.user.tag} just joined!`, iconURL: member.user.avatarURL()})
        .setDescription(`Welcome to Deimos, you can [start here](https://discord.com/channels/912917467792281600/913906187886538763).
                        
        - Our community created [bots](https://discord.com/channels/912917467792281600/1014677575899021342).
        - Our quick and easy [support](https://discord.com/channels/912917467792281600/912927667869843466).
        `)
        .setFooter({text: `Member #${member.guild.members.cache.size}`})
        .setColor("#8800ff");

  if (Date.now() - creation_date <= 2592000000) {
    welcomembed.setTitle("⚠️ New Discord Account Detected")
  }
  
  // Fetch the ban list
  let banList = []
  await message.guild.bans.fetch()
    .then(bans => {
      bans.forEach(ban => {
        banList.push(ban.user.username)
      });
    })
  .catch(console.error);
  if (banList.includes(member.user.username)) {
    welcomembed.setTitle("⚠️ Username Matches Banned User")
  }

  if (member.guild.id === '912917467792281600') {
    client.channels.cache.get("912917467792281603").send({ content: `<@${member.user.id}>`,embeds: [welcomembed] })
    member.send({ content: `<@${member.user.id}>`,embeds: [welcomembed] })
    console.log(member.user.tag + "joined the server!")
  }
});
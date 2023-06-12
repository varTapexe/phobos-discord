const { EmbedBuilder, PermissionsBitField, codeBlock } = require("discord.js");
const client = require("../../index");
const config = require("../../config/config.js");
const { QuickDB } = require("quick.db");
const quick = new QuickDB
const fetch = require('node-fetch')
const Database = require("@replit/database");
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "autoSupport"
};

client.on('messageCreate', async (message) => {

  if (message.author.bot) return;
  if (message.channel.type !== 0) return;

  if (message.channel.id === "912927667869843466") {

    const filePath = path.join(__dirname, 'faq_answers.json');
    const faqKeywords = JSON.parse(fs.readFileSync(filePath, 'utf8'));

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
      message.channel.send({ embeds: [faqEmbed] });
    }
    else if (message.attachments.size > 0) {
      const attachment = message.attachments.first();
      if (attachment.contentType.startsWith('image/')) {
        faqEmbed.setDescription(`**Looks like you sent an image!**\nIf that was an image of an error try sending the error as __text__ to see if I have an answer for it!`)
        message.channel.send({ embeds: [faqEmbed] });
      } else if (attachment.contentType.startsWith('text/plain')) {
        // console.log("text file found")
        const file = message.attachments.first()?.url;
        try {
          const response = await fetch(file);
          // if there was an error send a message with the status
          if (!response.ok)
            return message.channel.send(
              'There was an error reading your file:',
              response.statusText,
            );

          const text = await response.text();
          const lines = text.split('\n');
          const lastLine = lines[lines.length - 1];
          const firstLine = lines[0];
          const foundKeywordsInLastLine = Object.keys(faqKeywords).filter(keyword => lastLine.includes(keyword.toLowerCase()));
          const foundKeywordsInFirstLine = Object.keys(faqKeywords).filter(keyword => firstLine.includes(keyword.toLowerCase()));
          if (foundKeywordsInLastLine.length > 0) {
            // Send the answer for the first found keyword
            const answer = faqKeywords[foundKeywordsInLastLine[0]];
            faqEmbed.setDescription(answer)
            message.channel.send({ embeds: [faqEmbed] });
          } else if (foundKeywordsInFirstLine.length > 0) {
            // Send the answer for the first found keyword
            const answer = faqKeywords[foundKeywordsInFirstLine[0]];
            faqEmbed.setDescription(answer)
            message.channel.send({ embeds: [faqEmbed] });
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    else {
      return
    }

  }

});

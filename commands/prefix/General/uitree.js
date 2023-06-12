const { EmbedBuilder } = require("discord.js");
const fs = require('fs');
const fetch = require('node-fetch')

module.exports = {
  config: {
    name: "uitree",
    description: "Reads Wizard101 UI tree and turns it into a path. (Created by Ultimate314, converted to JavaScript by Tap).",
    usage: 'uitree [Window/Button Name] (attatch ui-tree txt file)'
  },
  permissions: ['SendMessages'],
  owner: false,
  run: async (client, message, args, prefix) => {

    var text = ''
    try {
      if (message.attachments.size > 0) {
        const attachment = message.attachments.first();
        if (attachment.contentType.startsWith('text/plain')) {
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

            text = await response.text();
          } catch (error) {
            console.log(error);
          }
        } else {
          return message.reply("⚠️ Please attatch a __txt__ file.")
        }
      } else {
        return message.reply("⚠️ Please attatch a txt file including your **UI Tree**.")
      }
    } catch (error) {
      console.log(error);
    }
    text = text.split('\n').filter(line => line.trim() !== '');
    if (!args[0]) return message.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("⚠️ Please provide a Window/Button Name.")
          .setColor("Red")
      ]
    });
    const input_name = args[0]
    const name = input_name.split('/');
    const nameLower = name[name.length - 1].toLowerCase();
    let path = [];

    for (let i = 0; i < text.length; i++) {
      const line = text[i];

      if (line.toLowerCase().includes(`[${nameLower}]`)) {
        const name_dup = [...name.slice(0, -1)];
        const temp_text = text.slice(0, i + 1).reverse();
        let depth = line.split('-').length - 1;
        let should_break = name_dup.length === 0;

        while (name_dup.length) {
          let nameFound = false;

          for (let j = 0; j < temp_text.length; j++) {
            const subline = temp_text[j];

            if (subline.toLowerCase().includes(`[${name_dup[name_dup.length - 1].toLowerCase()}]`)) {
              name_dup.pop();
              temp_text.splice(0, j + 1);
              depth--;
              nameFound = true;

              if (name_dup.length === 0) {
                should_break = true;
              }

              break;
            } else if (subline.split('-').length < depth) {
              name_dup.length = 0;
              break;
            }
          }

          if (!nameFound) {
            break;
          }
        }

        if (should_break) {
          text = text.slice(0, i + 1).reverse();
          break;
        }
      }
    }

    let depth = 0;

    for (let i = 0; i < text.length; i++) {
      const line = text[i];

      if (line.split('-').length === 0) {
        break;
      } else if (i === 0) {
        depth = line.split('-').length - 1;
        const matches = line.match(/(?<=\[).+(?=\])/g);
        path.push(matches ? matches[0] : '');
      } else if (depth === line.split('-').length) {
        depth--;
        const matches = line.match(/(?<=\[).+(?=\])/g);
        path.push(matches ? matches[0] : '');
      }
    }


    if (path.length > 0) {
      message.reply(
        `✅ **The desired path**: \`\`\`[ '${path.reverse().join(`', '`)}' ]\`\`\``
          .replace(`['`, `['`)
          .replace(`']`, `']`)
      );
    } else {
      message.reply(`❌ Window matching the name '${input_name}' not found. 😟`);
    }



  },
};

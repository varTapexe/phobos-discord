const Database = require("@replit/database");
const db = new Database();
db.getJSON = name => new Promise(resolve => {
  db.get(name).then(value => {
    if (!value) {
      value = "{}";
      db.set(name, "{}");
    }
    resolve(JSON.parse(value));
  });
});
db.getArray = name => new Promise(resolve => {
  db.get(name).then(value => {
    if (!value) {
      value = "[]";
      db.set(name, "[]");
    }
    resolve(JSON.parse(value));
  });
});

const reputation = {
  get: () => db.getJSON("rep"),
  add: async (userId, data) => {
    const r = await db.getJSON("rep");
    userId = userId.toString()
    r[userId] = data
    db.set("rep", JSON.stringify(r));
  },
  plusOne: async (userId, userGiving) => {
    const r = await db.getJSON("rep");
    userId = userId.toString()
    if (!r[userId]) {
      await reputation.add(user, {
          rep: 0,
          repHistory: {} 
      })
    }
    r[userId].rep += 1;
    r[userId].repHistory[`${userGiving}`] = Date.now();
    db.set("rep", JSON.stringify(r));
  },
  remove: async (userId) => {
    const r = await db.getJSON("rep");
    userId = userId.toString()
    delete r[userId];
    db.set("rep", JSON.stringify(r));
  }
}

const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "rep",
  description: "Give someone some rep!",
  type: 1,
  options: [{
    name: "user",
    description: "Who are you giving reputation?",
    type: 6,
    required: true
  }],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
  },
  run: async (client, interaction, config, db) => {
    const allUserRep = await reputation.get();
    const user = interaction.options.get("user").value

    // console.log(allUserRep)

    if (user == interaction.member.id) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`<@${interaction.member.id}>, you may not give reputation to yourself! ❌`)
            .setColor('Red')
        ],
        ephemeral: true
      })
    } else if (user == '1115418231902048307') {
      if (allUserRep[user]) {
        await reputation.remove(user)
      }
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setDescription(`<@${interaction.member.id}>, you may not give reputation to me! ❌`)
            .setColor('Red')
        ],
        ephemeral: true
      })
    }
    else {
      if (!!allUserRep[user]) {
        if (Date.now() - (allUserRep[user].repHistory[`${interaction.member.id}`] ? allUserRep[user].repHistory[`${interaction.member.id}`] : 0) > 86400000) {
          await reputation.plusOne(user, interaction.member.id);
          const newRep = await reputation.get();
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`<@${interaction.member.id}> gave <@${user}> +1 rep! 👍`)
                .setFooter({ text: `Use /checkrep to check your reputation!` })
                .setColor('#8800ff')
            ],
            ephemeral: false
          })
        }
        else {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`<@${interaction.member.id}>, you already gave <@${user}> rep within the last 24 hours! ❌`)
                .setColor('Red')
            ],
            ephemeral: true
          })
        }
      }
      else {
        // Default starting rep data.
        await reputation.add(user, {
          rep: 0,
          repHistory: {} // rep history will be JSON obj like so: { "userId": dateTimeStamp }
        }).then(async () => {
          setTimeout(async () => {
            await reputation.plusOne(user, interaction.member.id);
          }, 1000) //wait a second to let database update
        })
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("⭐ First Reputation!")
              .setDescription(`<@${interaction.member.id}> gave <@${user}> their first positive rep! 👍`)
              .setFooter({ text: `Use /checkrep to check your reputation!` })
              .setColor('#8800ff')
          ],
          ephemeral: false
        })
      }
    }



  },
};

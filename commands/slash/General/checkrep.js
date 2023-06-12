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
    r[userId].rep += 1;
    r[userId].repHistory[`${userGiving}`] = Date.now();
    db.set("rep", JSON.stringify(r));
  },
  remove: async (userId, data) => {
    const r = await db.getJSON("rep");
    userId = userId.toString()
    delete r[userId];
    db.set("rep", JSON.stringify(r));
  }
}

const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "checkrep",
  description: "Check someone's rep!",
  type: 1,
  options: [{
    name: "user",
    description: "Who reputation are you checking?",
    type: 6,
    required: true
  }],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
  },
  run: async (client, interaction, config, db) => {
    const allUserRep = await reputation.get();
    const user = interaction.options.get("user").value

    if (!!allUserRep[user]) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`<@${user}> has **${allUserRep[user].rep}**! 👍`)
              .setColor('#8800ff')
          ],
          ephemeral: true
        })
    } else {
      return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`<@${user}> has no reputation! 👎`)
              .setColor('Red')
          ],
          ephemeral: true
        })
    }

  },
};

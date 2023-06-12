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
  name: "toprep",
  description: "Get the Deimos reputation leaderboard!",
  type: 1,
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
  },
  run: async (client, interaction, config, db) => {
    const allUserRep = await reputation.get();

    // Convert the JSON of JSONs to an array of objects
    const jsonArray = Object.entries(allUserRep).map(([key, value]) => ({ key, value }));

    // Sort the array by 'rep' in descending order
    jsonArray.sort((a, b) => b.value.rep - a.value.rep);

    // Create a new JSON object with sorted values
    const sortedJsonOfJsons = jsonArray.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});

    let leaderboard = ``
    Object.keys(sortedJsonOfJsons).forEach((id, index) => {
      if (index <= 9) {
        leaderboard += `${index + 1}. <@${id}>: \`${allUserRep[id].rep}\`\n`;
      }
    })

    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Top Deimos Reputation ⭐")
          .setDescription(leaderboard)
          .setColor('#8800ff')
      ],
      ephemeral: true
    })

  },
};

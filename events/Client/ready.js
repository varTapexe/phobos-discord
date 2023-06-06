const client = require("../../index");
const fetch = require("node-fetch")
const colors = require("colors");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: "ready.js"
};

client.once('ready', async () => {

    var date = new Date().toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric" })


  console.log(`${date}`.blue + "|" + `[READY] ${client.user.tag} is up and ready to go.`.brightGreen);
})


module.exports = {

  Prefix: "!", // YOUR BOT PREFIX.

  Users: {
    OWNERS: ["1093940419085226126", "263123145333014530"] // THE BOT OWNERS ID.
  },

  Handlers: {
    MONGO: "" // WE DONT USE MONGODB SO LEAVE BLANK
  },

  Client: {
    TOKEN: process.env['bot_token'], 
    // THE BOT TOKEN. KEPT IN SERVER SECRETS.

    ID: "1115418231902048307" // BOT CLIENT ID.
  }

}

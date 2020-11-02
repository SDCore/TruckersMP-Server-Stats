const { client, Discord } = require("../TMPStats.js");
const config = require("../config.json");
const moment = require("moment");

const fs = require("fs");

const prefix = config.prefix;

client.commands = new Discord.Collection();

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`../commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("message", (message) => {
  if (message.channel.type == "dm" && !message.author.bot) {
    dmContent = `**(${moment(message.createdAt).format(
      "MMMM Do, YYYY h:mm:ss A"
    )}) [${message.author}]**\n${message.content}`;

    client.guilds.cache
      .get("664717517666910220")
      .channels.cache.get("772025716073824266")
      .send(dmContent);
    message.reply(
      "Hey! Join the support server at https://discord.gg/f3Pa8vJ to get support.\n\n*These DM's are not monitored.*"
    );
    return;
  }

  // If the message does not start with the prefix, ignore it
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  client.guilds.cache
    .get("664717517666910220")
    .channels.cache.get("772768909144883241")
    .send(
      `Guild: ${message.guild.name}\nUser: ${message.author}\nMessage: ${message.content}`
    );

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName))
    return message.channel.send("That is not a valid command.");
  const command = client.commands.get(commandName);

  try {
    command.execute(message, args);
  } catch (error) {
    console.log(error);
    message.reply("There was an issue running that command.");
  }
});

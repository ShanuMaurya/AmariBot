const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const sql = require('sqlite');
const config = require('./config.json');

sql.open(`./db/mainDB.sqlite`);

fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split('.')[0];

    client.on(eventName, (...args) => eventFunction.run(client, ...args, sql));
  });
});

client.on("message", message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)){//checks if the user is typing in a command or not

  }else{
  //splits input to commands
    let command = message.content.split(' ')[0];
    command = command.slice(config.prefix.length);

    let args = message.content.split(' ').slice(1); //passing through the argument content

    try {
      let commandFile = require(`./commands/${command}.js`);
      commandFile.run(client, message, args, sql, Discord);
    } catch (err) {
      return;
    }
  }
});

client.login(config.token);
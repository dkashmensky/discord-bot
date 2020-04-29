const Discord = require('discord.js');
const fs = require('fs');
const md5 = require('md5');
const config = require('config');
const send = require('./js/message');

const client = new Discord.Client();

let botChannel;
let md5Previous;

const botToken = config.token;
client.login(botToken);

client.on('ready', () => {
  botChannel = client.channels.cache.get(config.channel);

  fs.watch(config.filepath, { encoding: 'utf-8' }, (event, filename) => {
    const md5Current = md5(fs.readFileSync(config.filepath, 'utf8'));
    if (md5Current === md5Previous) {
      return;
    }

    send(botChannel);
    md5Previous = md5Current;
  });

  setInterval(() => {
    fs.readFileSync(config.filepath, 'utf8');
  }, 500);
});

client.on('message', (message) => {
  if (message.channel.id === config.channel
      && message.author.id !== config.botId) {
    fs.writeFileSync(config.toGameFilePath, `[${message.author.username}] ${message.content}`);
    message.delete();
  }
});

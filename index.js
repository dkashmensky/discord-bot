const Discord = require('discord.js');
const fs = require('fs');
const randomString = require('crypto-random-string');
const md5 = require('md5');
const config = require('config');

const client = new Discord.Client();

let botChannel;
let md5Previous;

function cleanUpFile(file) {
  fs.writeFileSync(config.filepath, '');
  fs.writeFileSync(`${config.backupPath}/chat_backup_${randomString({ length: 10 })}.txt`, file);
  console.log('Log file was too big, created new one');
}

function checkSize(file) {
  const filesize = fs.statSync(config.filepath).size;
  if (filesize / 1000000.0 > config.filesizeLimit) {
    cleanUpFile(file);
  }
}

function replaceString(type, text, matches) {
  let returnText = text;

  const settings = {
    separator: type === 'user' ? '!' : '*',
    control: type === 'user' ? '@' : '@&',
    type: type === 'user' ? 'users' : 'roles',
    checkAll: type === 'user',
  };

  matches.forEach((item) => {
    const alias = item.split(settings.separator)[1];

    if (settings.checkAll) {
      if (alias === config.mentions.all) {
        returnText = returnText.replace(item, '@everyone');
        return;
      }
    }

    const elem = config.mentions[settings.type].find((element) => element.alias === alias);

    if (!elem) {
      return;
    }

    returnText = returnText.replace(item, `<${settings.control}${elem.id}>`);
  });

  return returnText;
}

function checkMentions(message) {
  let text = message;

  const userMentions = text.match(/(![^\s]+)/gm);
  if (userMentions) {
    text = replaceString('user', text, userMentions);
  }

  const roleMentions = text.match(/(\*[^\s]+)/gm);
  if (roleMentions) {
    text = replaceString('role', text, roleMentions);
  }

  return text;
}

function sendMessage(bot) {
  const file = fs.readFileSync(config.filepath, 'utf8');
  const linedData = file.split('\n');
  const lastMessage = linedData[linedData.length - 2];
  if (lastMessage && lastMessage.indexOf(`[${config.chatName}]`) !== -1) {
    bot.send(checkMentions(lastMessage.split(`[${config.chatName}]`)[1]));
  }

  checkSize(file);
}

const botToken = config.token;
client.login(botToken);

client.on('ready', () => {
  botChannel = client.channels.cache.get(config.channel);

  fs.watch(config.filepath, { encoding: 'utf-8' }, (event, filename) => {
    const md5Current = md5(fs.readFileSync(config.filepath, 'utf8'));
    if (md5Current === md5Previous) {
      return;
    }

    sendMessage(botChannel);
    md5Previous = md5Current;
  });

  setInterval(() => {
    fs.readFileSync(config.filepath, 'utf8');
  }, 500);
});

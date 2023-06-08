const TelegramBot = require('node-telegram-bot-api');
const Command = require('telegram-command-handler');
require('dotenv').config();

class TelegramBotApp {
  constructor() {
    this.botToken = process.env.BOT_TOKEN;
    this.bot = new TelegramBot(this.botToken, { polling: true });
  }

  start() {
    this.registerCommand('b');
    this.registerCommand('help');
    this.registerCommand('chatid');
    this.registerCommand('currency');
    this.registerCommand('h');
    this.registerCommand('active');
    this.registerCommand('task');
    this.registerCommand('chat');
    this.registerCommand('primer');
    this.registerCommand('details');
    this.registerCommand('smi');
    this.registerCommand('cabinet');
    this.registerCommand('restore');
    this.registerCommand('sleep');
    this.registerCommand('create');

    this.registerEvent('new_chat_members', this.bot);
    this.registerEvent('left_chat_member', this.bot);
    this.registerEvent('polling_error', this.bot);
    this.registerEvent('error', this.bot);
    this.registerEvent('inline_query', this.bot);
    this.registerEvent('callback_query', this.bot);
    this.registerEvent('message', this.bot);
    this.registerEvent('new_chat_title', this.bot);
    this.registerEvent('group_chat_created', this.bot);

    this.registerRegExpCommand(/^\/.*/, 'log_commands', this.bot);
    this.registerRegExpCommand(/^\/[a-z]+(?:\s+\d+(?:-\d+%)?)?$/,
      'currency',
      this.bot
    );

    // this.job.start();
    console.log(`Telegram Bot started`);
  }

  registerEvent(name, bot) {
    const path = './events/' + name;
    const callback = require(path);

    bot.on(name, async (message) => {
      await callback(bot, message);
    });
  }

  registerRegExpCommand(regExp, name, bot) {
    const path = './commands/' + name;
    const callback = require(path);

    bot.onText(regExp, async function (msg, match) {
      await callback(bot, msg, match);
    });
  }

  registerCommand(name) {
    const commandName = new Command(this.bot, name);
    const path = './commands/' + name;

    // Динамически загружаем модуль с обработчиком команды
    const callback = require(path);

    // Регистрируем обработчик команды с указанным именем и командой
    commandName.on('receive', async (msg, args) => {
      // Вызываем метод обработчика команды, передав ему объект сообщения и аргументы команды
      await callback(this.bot, msg, args);
    });
  }
}

module.exports = TelegramBotApp;

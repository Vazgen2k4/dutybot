require('dotenv').config();
const db = require('./config.js');
const commands = require('./bot_commands.js');
const TelegramApi = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;





const bot = new TelegramApi(token, {
    polling: true,
});


bot.onText(/\/help/, (message) => {
    const {
        id
    } = message.chat;
    const userName = message.from.first_name;
    console.log(message);
    let res = `${userName}, ниже предоставлен список команд\n\n`;
    commands.forEach(command => {
        const {
            name,
            descr
        } = command;
        res += `/${name} - ${descr}\n\n`;
    });

    res += "@OverLord2k4";

    bot.sendMessage(id, res);
});

bot.onText(/\/stat/, async (message) => {
    const {
        id
    } = message.chat;
    const userName = message.from.first_name;
    const userId = message.from.id;

    let coins = await db.getUserCoins({
        userId: userId
    });
    coins = coins ? coins : 0;

    let res = `Пользователь: ${userName}\n\nНомер счёта: OW-${userId}\nБаланс: ${coins} DC`;
    res += '\n\n@OverLord2k4'

    bot.sendMessage(id, res);
});

bot.onText(/\/give (.+)/, async (message, [_, coins]) => {
    const {
        id
    } = message.chat;

    const otherUserId = message.reply_to_message?.from.id;
    console.log(message);
    if (!otherUserId) {
        bot.sendMessage(
            id,
            'Для того, что бы перевести DC (DutyCoins) на дгугой счёт нужно:\n\n1. Отметить человека, которому хотите перевести DC\n\n2. Напишите команду "/give" и через пробел укажите сумму\n\nПример: /give 10',
        );
        return;
    }

    if (isNaN(coins)) {
        bot.sendMessage(
            id,
            'С*ка, напиши ты чилсо, я для тебя блять шутка какая-то???',
        );
        return;
    }

    const userId = message.from.id;
    const name = message.from.first_name;
    const otherName = message.reply_to_message.from.first_name;


    let myCoins = await db.getUserCoins({
        userId: userId
    });
    let otheUserCoins = await db.getUserCoins({
        userId: otherUserId
    });

    if (myCoins < coins) {
        bot.sendMessage(
            id,
            `${name}, ты сейчас серьёзно?\nБаланс проверь...`,
        );
        return;
    }


    db.setUserCoins({
        userId: userId,
        credits: myCoins - coins,
    });
    
    db.setUserCoins({
        userId: otherUserId,
        credits: otheUserCoins + coins,
    });

    bot.sendMessage(
        id,
        `Транзакция завершина\n\nДетали транзакции:\n\nОтправитель: ${name}\n\nПолучатель: ${otherName}\nCумма: ${coins} DC (DutyCoins)\n\n@OverLord2k4`,
    );

});



/*   if (!otherUserId) {
        bot.sendMessage(id, 'Для того, что бы перевести DC (DutyCoins) на дгугой счёт нужно:\n\n1. Отметить человека, которому хотите перевести DC\n2. Напишите команду "/send" и через пробел укажите сумму\n\nПример: /send 10');
    } */
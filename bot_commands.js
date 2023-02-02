


class Command {
    constructor(
        name,
        descr,
        action,
    ) {
        this.name = name;
        this.descr = descr;
        this.action = action;
    }
}

module.exports = [
   new Command('help', 'Показать все команды'),
   new Command('stat', 'Посмотреть свою статистику'),
   new Command('give', 'Перевод DutyCoins\'в'),
    // Command('help', 'Показать все команды'),
    // Command('help', 'Показать все команды'),
];
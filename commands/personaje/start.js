// commands/start.js que no se te olvide modificar esto the master
const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Start using the bot'),
    async execute(interaction) {
        const userId = interaction.user.id;
        await db.set(`hasStarted_${userId}`, true); 
db.set(`userID_${userId}`, userId);
db.set(`coins_${userId}`, 500);

        await interaction.reply('You can now use all available commands.');
    },
};

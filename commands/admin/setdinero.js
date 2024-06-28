const { SlashCommandBuilder } = require("discord.js");
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setdinero')
    .setDescription('Establece la cantidad de dinero de un jugador') 
    .addUserOption(option =>
      option.setName('usuario')
    .setDescription('El usuario al que se le establecerá la cantidad de dinero')
    .setRequired(true))
    .addIntegerOption(option =>
      option.setName('cantidad')
    .setDescription('La cantidad de dinero que se le establecerá al usuario')
    .setRequired(true)),
  
  async execute(interaction) {
    let userId = interaction.user.id;
      if (!['653309862058524693', '679164230716620811'].includes(userId)) {
      return interaction.reply({ content: 'No tienes permiso para usar este comando.', ephemeral: true });
    };
    const usuario2 = interaction.options.getUser('usuario');
    const cantidad = interaction.options.getInteger('cantidad');

    if (cantidad < 0 || !Number.isInteger(cantidad)) {
      return interaction.reply({
        content: 'Por favor utliza números validos',
        ephemeral: true
      });
    }

    if (!usuario2) {
      return interaction.reply({
        content: 'Usuario no encontrado',
        ephemeral: true
      });
    }
    
    await db.set(`coins_${usuario2.id}`, cantidad);
    await db.add(`coinsearned_${usuario2.id}`, cantidad);
    
    await interaction.reply(`Ha establecido ${cantidad} de dinero al jugador ${usuario2}`);
  }, 
};


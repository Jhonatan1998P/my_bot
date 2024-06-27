const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setedificios')
    .setDescription('Establece la cantidad de edificios de un jugador') 
    .addUserOption(option =>
      option.setName('usuario')
    .setDescription('El usuario al que se le establecerá la cantidad de edificios')
    .setRequired(true))
    .addStringOption(option =>
		option.setName('edificio')
			.setDescription('Introduce el edificio a establecer')
    .setRequired(true))
    .addIntegerOption(option =>
      option.setName('cantidad')
    .setDescription('La cantidad de edificios que se le establecerá al usuario')
    .setRequired(true)),

  async execute(interaction) {
    let userId = interaction.user.id;
      if (!['653309862058524693', '679164230716620811'].includes(userId)) {
      return interaction.reply({ content: 'No tienes permiso para usar este comando.', ephemeral: true });
    };
    const usuario2 = interaction.options.getUser('usuario');
    const cantidad = interaction.options.getInteger('cantidad');
    const edificio = interaction.options.getString('edificio');

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
    if (edificio === 'Casa') {
      await db.set(`casas_${usuario2.id}`, cantidad)
    } else if (edificio === 'Mansion') {
      await db.set(`mansiones_${usuario2.id}`, cantidad)
    } else if (edificio === 'Fabrica') {
      await db.set(`fábricas_${usuario2.id}`, cantidad)
    } else if (edificio === 'Gasolineria') {
      await db.set(`gasolinerias_${usuario2.id}`, cantidad)
    } else if (edificio === 'Centro Comercial') {
      await db.set(`centrocomerciales_${usuario2.id}`, cantidad)
    } else if (edificio === 'Banco') {
      await db.set(`bancos_${usuario2.id}`, cantidad)
    } else {
      await interaction.reply(`Edificio Invalido`);
    };

    await interaction.reply(`Ha establecido la cantidad de edificios al jugador ${usuario2.username}`);
  }, 
};
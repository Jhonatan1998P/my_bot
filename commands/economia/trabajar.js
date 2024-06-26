const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB(); 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('trabajar')
    .setDescription('trabaja para conseguir algo de dinero'), 

  async execute(interaction) {

    const userId = interaction.user.id;

    const Ahora = Date.now();
    const Tiempo = 10 * 1000;

    const UltimoUso = await db.get(`cooldown_trabajar_${userId}`);

    if (UltimoUso && Ahora < UltimoUso + Tiempo) {
      const TiempoRestante = ((UltimoUso + Tiempo) - Ahora) / 1000;
      return interaction.reply({ content: `Por favor espera ${TiempoRestante.toFixed(1)} segundos antes de reusar el comando\`/trabajar\`.`, ephemeral: true });
    }

    await db.set(`cooldown_trabajar_${userId}`, Ahora);
    
    const ganancias = Math.floor(Math.random() * 1000) + 1;

    await db.add(`coins_${userId}`, ganancias);

    await interaction.reply(`Has trabajado y has ganado ${ganancias} monedas.`);

    await db.set(`cooldown_${userId}`, 'true');
    
  }, 
};

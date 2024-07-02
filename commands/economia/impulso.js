const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require('quick.db');
const db = new QuickDB();


module.exports = {
  data: new SlashCommandBuilder()
    .setName("impulsos")
    .setDescription("con esto puedes ver los impulsos activos"), 

  async execute(interaction) {
    const userId = interaction.user.id;
    const ahora = Date.now();

    //obtenemos los impulsos activos
    const impulsosActivos = await db.get(`impulsos_${userId}`) || [];
    
    //si no hay impulsos activos, envia un mensaje diciendo que no hay impulsos activos
    if (impulsosActivos.length === 0) {
      return await interaction.reply("No tienes ningún impulso activo.");
    }; 

    //si se acaba el tiempo del impulsos, lo elimina de la base de datos
    if (impulsosActivos[0].tiempoRestante <= ahora) {
      await db.set(`impulsos_${userId}`, []);
      return await interaction.reply("Tu impulso ha expirado.");
    };

    //creamos un embed para mostrar los impulsos activos
    const embed = new EmbedBuilder()
      .setTitle("Impulsos activos")
      .setColor("Blue")
    //iteramos sobre los impulsos activos y los añadimos al embed
    impulsosActivos.forEach((impulso) => {
      let tiempoRestante = (impulso.tiempoRestante - ahora) / 1000;

      embed.addFields({
        name: `Impulso ${impulso.nombre}`,
        value: `Cantidad: ${impulso.cantidad}\nTiempo restante: ${(tiempoRestante / 60).toFixed(1)} minutos :timer:`,
        inline: false, 
      });
    });

    await interaction.reply({ embeds: [embed] });
  }, 
};
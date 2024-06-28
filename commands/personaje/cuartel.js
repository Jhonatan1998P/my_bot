const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cuartel")
    .setDescription("con esto puedes saber cuanto personal tienes"),
  async execute(interaction) {
    const userId = interaction.user.id 
    const Saboteadores = await db.get(`saboteadores_${userId}`) || 0;
    const GuardaEspaldas = await db.get(`guardaespaldas_${userId}`) || 0;
    
      const embed = new EmbedBuilder()
      .setTitle("Cuartel" )
      .setColor("Blue")
      .addFields({ name: "Saboteadores", value: `${Saboteadores}`, inline: false }, 
                 { name: "Guardaespaldas", value: `${GuardaEspaldas}`, inline: false }); 
    
    await interaction.reply({ embeds: [embed] });

    //await interaction.reply({ content: `Saboteadores: ${Saboteadores} Guarda: ${GuardaEspaldas}`}) 
  }, 
};
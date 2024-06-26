const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ganancias")
    .setDescription("con esto puedes recojer tus ganancias"),

  async execute(interaction) {
    let Casas = await db.get(`casas_${interaction.user.id}`) || 0;
    let Rascacielos = await db.get(`rascacielos_${interaction.user.id}`) || 0;
    let GanTotal = (Casas * 10) + (Rascacielos * 100)

      const embed = new EmbedBuilder()

      .setTitle("Ganancias")
      .setColor("Blue");

    embed.addFields({
        name: "Ganancias",
        value: `${GanTotal}$`,
        inline: false,
      });
    
    console.log("Casas " + await db.get(`casas_${interaction.user.id}`)) 

    console.log("Rasca" + await db.get(`rascacielos_${interaction.user.id}`)) 
    
    await interaction.reply({ embeds: [embed] });
  },
};

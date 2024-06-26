const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require('quick.db');
const db = new QuickDB();

let ganancias = 0;
let formula = 0;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ganancias")
    .setDescription("con esto puedes recojer tus ganancias"),

  async execute(interaction) {
    let Casas = await db.get(`casas_${interaction.user.id}`) || 0;
    let Rascacielos = await db.get(`rascacielos_${interaction.user.id}`) || 0;
    const TiempoGanancias = await db.get(`tiempoganancias_${interaction.user.id}`) || 0;
    
      const Edificios = [
      { name: "Casas", amount: Casas, profit: (Casas * 10) },
      { name: "Rascacielos", amount: Rascacielos, profit: (Rascacielos * 45) },
    ];
    
      const embed = new EmbedBuilder()

      .setTitle("Ganancias")
      .setColor("Blue");

     Edificios.forEach((item) => {
       formula = (item.profit / 60000) * (Date.now() - TiempoGanancias)
       ganancias = ganancias + formula

      embed.addFields({
        name: `x${item.amount} ${item.name}`,
        value: `${formula.toFixed(2)}$`,
        inline: false,
      });
    });

    await db.set(`tiempoganancias_${interaction.user.id}`, Date.now());

    ganancias = 0;
    formula = 0;
  
    await interaction.reply({ embeds: [embed] });
  },
};

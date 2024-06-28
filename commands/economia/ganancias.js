const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require('quick.db');
const db = new QuickDB();

const opt = { style: 'currency', currency: 'USD' };
const nf2 = new Intl.NumberFormat('en-US', opt);

let ganancias = 0;
let formula = 0;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ganancias")
    .setDescription("con esto puedes recojer tus ganancias"), 

  async execute(interaction) {
    let ed1 = await db.get(`casas_${interaction.user.id}`) || 0;
    let ed2 = await db.get(`mansiones_${interaction.user.id}`) || 0;
    let ed3 = await db.get(`fabricas_${interaction.user.id}`) || 0;
    let ed4 = await db.get(`gasolinerias_${interaction.user.id}`) || 0;
    let ed5 = await db.get(`centrocomerciales_${interaction.user.id}`) || 0;
    let ed6 = await db.get(`bancos_${interaction.user.id}`) || 0;
    const TiempoGanancias = await db.get(`tiempoganancias_${interaction.user.id}`) || 0;
    
      const Edificios = [
      { name: "Casas", amount: ed1, profit: (ed1 * 10), income: 10 },
      { name: "Mansiones", amount: ed2, profit: (ed2 * 100) , income: 100},
      { name: "Fabricas", amount: ed3, profit: (ed3 * 600) , income: 600},
      { name: "Gasolinerias", amount: ed4, profit: (ed4 * 1500), income: 1500 }, 
      { name: "Centro Comerciales", amount: ed5, profit: (ed5 * 2100), income: 2100 }, 
      { name: "Bancos", amount: ed6, profit: (ed6 * 4000), income: 4000 },
    ];
      
      const embed = new EmbedBuilder()

      .setTitle("Ganancias")
      .setColor("Blue");

     Edificios.forEach((item) => {
       
       if ((Date.now() - TiempoGanancias) >= (1000 * 3600)) {
       formula = (item.profit / 60000) * (1000 * 3600)
       } else {
         formula = (item.profit / 60000) * (Date.now() - TiempoGanancias)
       };
       
       ganancias = ganancias + formula

      embed.addFields({
        name: `${item.amount}x ${item.name}  (${item.income}/min)`,
        value: `${nf2.format(formula)}`,
        inline: false,
      });
    });

    await db.set(`tiempoganancias_${interaction.user.id}`, Date.now());

    await db.add(`coins_${interaction.user.id}`, ganancias);

    //guarda la cantidad de dinero ganado por el jugador
    await db.add(`coinsearned_${interaction.user.id}`, ganancias);

    ganancias = 0;
    formula = 0;
  
    await interaction.reply({ embeds: [embed] });
  },
};

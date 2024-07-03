const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require('quick.db');
const db = new QuickDB();

const opt = { style: 'currency', currency: 'USD' };
const nf2 = new Intl.NumberFormat('en-US', opt);

let ganancias = 0;
let formula = 0;
//let ganancias_total = 0;

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
    
    let Ocupador = await db.get(`ocupadoralpha`);
    //console.log(Ocupador);
    let Bn1 = 1;

    //obtenemos los impulsos activos
    const impulsosActivos = await db.get(`impulsos_${interaction.user.id}`) || [];

      if (impulsosActivos.length > 0 && impulsosActivos[0].tiempoRestante > Date.now() && interaction.user.id == Ocupador) {
      Bn1 = 4;
    } else if (impulsosActivos.length > 0 && impulsosActivos[0].tiempoRestante > Date.now()) {
      Bn1 = 2;
    } else if (interaction.user.id == Ocupador) {
        Bn1 = 2
    };

    //mejoras
    let mejora1 = await db.get(`mejoracasa_${interaction.user.id}`) || 0;
      let mejora2 = await db.get(`mejoramansion_${interaction.user.id}`) || 0;
      let mejora3 = await db.get(`mejorafabrica_${interaction.user.id}`) || 0;
      let mejora4 = await db.get(`mejoragasolineria_${interaction.user.id}`) || 0;
      let mejora5 = await db.get(`mejoracomercial_${interaction.user.id}`) || 0;
      let mejora6 = await db.get(`mejorabanco_${interaction.user.id}`) || 0;
    
    const TiempoGanancias = await db.get(`tiempoganancias_${interaction.user.id}`) || 0;
    
      const Edificios = [
      { name: "Casas", amount: ed1, profit: (((ed1 * 10) * (1 + (mejora1 * 0.1))) * Bn1), income: ((10 * (1 + (mejora1 * 0.1))) * Bn1) }, { name: "Mansiones", amount: ed2, profit: (((ed2 * 100) * (1 + (mejora2 * 0.1))) * Bn1), income: ((100 * (1 + (mejora2 * 0.1))) * Bn1) }, { name: "Fabricas", amount: ed3, profit: (((ed3 * 600) * (1 + (mejora3 * 0.1))) * Bn1), income: ((600 * (1 + (mejora3 * 0.1))) * Bn1) }, { name: "Gasolinerias", amount: ed4, profit: (((ed4 * 1500) * (1 + (mejora4 * 0.1))) * Bn1) , income: ((1500 * (1 + (mejora4 * 0.1))) * Bn1) }, { name: "Centro Comerciales", amount: ed5, profit: (((ed5 * 2100) * (1 + (mejora5 * 0.1))) * Bn1), income: ((2100 * (1 + (mejora5 * 0.1))) * Bn1) }, { name: "Bancos", amount: ed6, profit: (((ed6 * 4000) * (1 + (mejora6 * 0.1))) * Bn1), income: ((4000 * (1 + (mejora6 * 0.1))) * Bn1) },
    ];
      
        /*{ name: "Mansiones", amount: ed2, profit: ((ed2 * 100) * (1 + (mejora2 * 0.1))), income: 100},
      { name: "Fabricas", amount: ed3, profit: (ed3 * 600) , income: 600},
      { name: "Gasolinerias", amount: ed4, profit: (ed4 * 1500), income: 1500 }, 
      { name: "Centro Comerciales", amount: ed5, profit: (ed5 * 2100), income: 2100 }, 
      { name: "Bancos", amount: ed6, profit: (ed6 * 4000), income: 4000 },
    ];*/
      
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
        name: `${item.amount}x ${item.name} ($${Math.floor(item.income)}/min)`,
        value: `${nf2.format(formula)} :dollar:`,
        inline: false,
      });
    });

    embed.addFields({
         name: "Ganancias totales", 
         value: `${nf2.format(ganancias)} :dollar:`,
         inline: false,
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

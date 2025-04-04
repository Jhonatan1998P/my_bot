const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require('quick.db');
const db = new QuickDB();

const opt = { style: 'currency', currency: 'USD' };
const nf2 = new Intl.NumberFormat('en-US', opt);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Aqui puedes comprar inmuebles nuevos"),

  async execute(interaction) {
    const coinsearned = await db.get(`coinsearned_${interaction.user.id}`) || 10000;

    //este codigo obtiene los edificios del jugador
    let ed1 = await db.get(`casas_${interaction.user.id}`) || 0;
    let ed2 = await db.get(`mansiones_${interaction.user.id}`) || 0;
    let ed3 = await db.get(`fabricas_${interaction.user.id}`) || 0;
    let ed4 = await db.get(`gasolinerias_${interaction.user.id}`) || 0;
    let ed5 = await db.get(`centrocomerciales_${interaction.user.id}`) || 0;
    let ed6 = await db.get(`bancos_${interaction.user.id}`) || 0;

    //se crea un array con objetos que contienen el nombre y el precio de cada edificio
    const shopItems = [
      { name: "Casa", price: (1000 * (0.05 * ed1)) + 1000, income: 10},
      { name: "Mansion", price: (10000 * (0.05 * ed2)) + 10000, income: 100}, 
      { name: "Fabrica", price: (50000 * (0.05 * ed3)) + 50000, income: 600}, 
      { name: "Gasolineria", price: (200000 * (0.05 * ed4)) + 200000, income: 1500 },
      { name: "Centro Comercial", price: (450000 * (0.05 * ed5)) + 450000, income: 2100 }, 
      { name: "Banco", price: (800000 * (0.05 * ed6)) + 800000, income: 4000 }, 
      { name: "Saboteador", price: 10000}, 
      { name: "GuardaEspalda", price: 5000 }, 
      { name: "Impulso x2", price: Math.floor(coinsearned / 22) }
    ];

    //se crea un embed con los edificios disponibles y sus precios
    const embed = new EmbedBuilder()

      .setTitle("Tienda")
      .setColor("Blue");

    shopItems.forEach((item) => {
      embed.addFields({
        name: `${item.name}`,
        value: `${nf2.format(item.price)} :dollar:`,
        inline: false,
      });
    });

    await interaction.reply({ embeds: [embed] });
  },
};
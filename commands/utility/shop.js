const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("Aqui puedes comprar inmuebles nuevos"),

  async execute(interaction) {
    //este codigo obtiene los edificios del jugador
    let ed1 = await db.get(`casas_${interaction.user.id}`) || 0;
    let ed2 = await db.get(`rascacielos_${interaction.user.id}`) || 0;
    
    //se crea un array con objetos que contienen el nombre y el precio de cada edificio
    const shopItems = [
      { name: "Casa", price: (1000 * (0.05 * ed1)) + 1000 },
      { name: "Rascacielos", price: (5000 * (0.05 * ed2)) + 5000 },
    ];
    
    //se crea un embed con los edificios disponibles y sus precios
    const embed = new EmbedBuilder()
      
      .setTitle("Tienda")
      .setColor("Blue");

    shopItems.forEach((item) => {
      embed.addFields({
        name: item.name,
        value: `${item.price}$`,
        inline: false,
      });
    });

    await interaction.reply({ embeds: [embed] });
  },
};

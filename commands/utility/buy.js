const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('buy')
    .setDescription('Comprar un inmueble')
    .addStringOption(option => 
      option.setName('item')
        .setDescription('El nombre del inmuble')
        .setRequired(true)
        .addChoices(
          { name: 'Casa', value: 'Casa' },
          { name: 'Mansion', value: 'Mansion' }, 
        { name: 'Fabrica', value: 'Fabrica' }, 
        { name: 'Gasolineria', value: 'Gasolineria' }, 
        { name: 'Centro Comercial', value: 'Centro Comercial' }, 
        { name: 'Banco', value: 'Banco' })), 

  async execute(interaction) {
    const itemName = interaction.options.getString('item');
    const userId = interaction.user.id;

    //este codigo obtiene los edificios del jugador
    let ed1 = await db.get(`casas_${userId}`) || 0;
    let ed2 = await db.get(`mansiones_${interaction.user.id}`) || 0;
    let ed3 = await db.get(`fabricas_${interaction.user.id}`) || 0;
    let ed4 = await db.get(`gasolinerias_${interaction.user.id}`) || 0;
    let ed5 = await db.get(`centrocomerciales_${interaction.user.id}`) || 0;
    let ed6 = await db.get(`bancos_${interaction.user.id}`) || 0;

    const shopItems = {
      "Casa": (1000 * (0.05 * ed1)) + 1000,
      "Mansion": (10000 * (0.05 * ed2)) + 10000, 
      "Fabrica": (50000 * (0.05 * ed3)) + 50000, 
      "Gasolineria": (125000 * (0.05 * ed4)) + 125000,
      "Centro Comercial": (180000 * (0.05 * ed5)) + 180000, 
      "Banco": (350000 * (0.05 * ed6)) + 350000,
    };

    if (!shopItems[itemName]) {
      return await interaction.reply('Este articulo no existe')
    }

    const itemPrice = shopItems[itemName];
    const userCoins = await db.get(`coins_${userId}`) || 0;

    if (userCoins < itemPrice) {
      return await interaction.reply(`No tienes \`${itemPrice}\` de dinero para comprar este inmueble.`);
    }
    
//codigo que guarda el inmueble en la base de datos
if (itemName === "Casa") {
    await db.add(`casas_${userId}`, 1)
} else if (itemName === "Mansion") {
    await db.add(`mansiones_${userId}`, 1)
} else if (itemName === "Fabrica") {
    await db.add(`fabricas_${userId}`, 1)
} else if (itemName === "Gasolineria") {
    await db.add(`gasolinerias_${userId}`, 1)
} else if (itemName === "Centro Comercial") {
    await db.add(`centrocomerciales_${userId}`, 1)
} else if (itemName === "Banco") {
    await db.add(`bancos_${userId}`, 1)
};
    //console.log("Casas " + await db.get(`casas_${userId}`)) 
    
//codigo que responde al usuario cuando su compra es exitosa
    await db.sub(`coins_${userId}`, itemPrice);
    await interaction.reply(`Has comprado ${itemName} por \`${itemPrice}\`monedas. Te quedan ${userCoins - itemPrice} monedas.`);
  },
};

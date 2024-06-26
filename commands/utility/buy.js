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
          { name: 'Rascacielo', value: 'Rascacielo' })), 

  async execute(interaction) {
    const itemName = interaction.options.getString('item');
    const userId = interaction.user.id;

    const shopItems = {
      "Casa": 1000,
      "Rascacielo": 5000,
    };

    if (!shopItems[itemName]) {
      return await interaction.reply('Este articulo no existe')
    }

    const itemPrice = shopItems[itemName];
    const userCoins = await db.get(`coins_${userId}`) || 0;

    if (userCoins < itemPrice) {
      return await interaction.reply('No tienes suficientes monedas para comprar este artículo.');
    }
    
//codigo que guarda el inmueble en la base de datos
if (itemName === "Casa") {
    await db.add(`casas_${userId}`, 1)
} else if (itemName === "Rascacielo") {
    await db.add(`rascacielos_${userId}`, 1)
};
    console.log("Casas " + await db.get(`casas_${userId}`)) 
    
//codigo que responde al usuario cuando su compra es exitosa
    await db.sub(`coins_${userId}`, itemPrice);
    await interaction.reply(`Has comprado ${itemName} por ${itemPrice} monedas. Te quedan ${userCoins - itemPrice} monedas.`);
  },
};

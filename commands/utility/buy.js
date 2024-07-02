const { SlashCommandBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

const opt = { style: 'currency', currency: 'USD' };
const nf2 = new Intl.NumberFormat('en-US', opt);

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
        { name: 'Banco', value: 'Banco' }, 
        { name: 'Saboteador', value: 'Saboteador' }, 
        { name: 'GuardaEspalda', value: 'GuardaEspalda' }, { name: 'Impulso x2', value: 'impulso1'},))
    .addStringOption(option => 
      option.setName('cantidad')
      .setDescription('Cantidad de inmuebles a comprar')
      .setRequired(true)), 

  async execute(interaction) {
    const itemName = interaction.options.getString('item');
    const userId = interaction.user.id;
    let cantidad = interaction.options.getString('cantidad');
    const userCoins = await db.get(`coins_${userId}`) || 0;
    const coinsearned = await db.get(`coinsearned_${userId}`) || 0;

    //este codigo obtiene los edificios del jugador
    let ed1 = await db.get(`casas_${userId}`) || 0;
    let ed2 = await db.get(`mansiones_${interaction.user.id}`) || 0;
    let ed3 = await db.get(`fabricas_${interaction.user.id}`) || 0;
    let ed4 = await db.get(`gasolinerias_${interaction.user.id}`) || 0;
    let ed5 = await db.get(`centrocomerciales_${interaction.user.id}`) || 0;
    let ed6 = await db.get(`bancos_${interaction.user.id}`) || 0;

    if (cantidad == "all" || cantidad == "All") {
      if (itemName == "Casa") {
        cantidad = Math.floor(userCoins / ((1000 * (0.05 * ed1)) + 1000));
      } else if (itemName == "Mansion") {
        cantidad = Math.floor(userCoins / ((10000 * (0.05 * ed2)) + 10000));
      } else if (itemName == "Fabrica") {
        cantidad = Math.floor(userCoins / ((50000 * (0.05 * ed3)) + 50000));
      } else if (itemName == "Gasolineria") {
        cantidad = Math.floor(userCoins / ((200000 * (0.05 * ed4)) + 200000));
      } else if (itemName == "Centro Comercial") {
        cantidad = Math.floor(userCoins / ((450000 * (0.05 * ed5)) + 450000));
      } else if (itemName == "Banco") {
        cantidad = Math.floor(userCoins / ((800000 * (0.05 * ed6)) + 800000));
      } else if (itemName == "Saboteador") {
        cantidad = Math.floor(userCoins / 10000)
      } else if (itemName == "GuardaEspalda") {
        cantidad = Math.floor(userCoins / 5000)
      };
    };
    
    const shopItems = {
      "Casa": ((1000 * (0.05 * ed1)) + 1000) * cantidad,
      "Mansion": ((10000 * (0.05 * ed2)) + 10000) * cantidad, 
      "Fabrica": ((50000 * (0.05 * ed3)) + 50000) * cantidad, 
      "Gasolineria": ((200000 * (0.05 * ed4)) + 200000) * cantidad,
      "Centro Comercial": ((450000 * (0.05 * ed5)) + 450000) * cantidad , 
      "Banco": ((800000 * (0.05 * ed6)) + 800000) * cantidad, 
      "Saboteador": 10000 * cantidad, 
      "GuardaEspalda": 5000 * cantidad,
      "impulso1": Math.floor(coinsearned / 15),
    };

    if (!shopItems[itemName]) {
      return await interaction.reply('Este articulo no existe')
    }

    const itemPrice = shopItems[itemName];

    if (userCoins < itemPrice) {
      return await interaction.reply(`No tienes \`${nf2.format(itemPrice)}\` de dinero para comprar este inmueble o personal.`);
    }
    
//codigo que guarda el inmueble en la base de datos
if (itemName === "Casa") {
    await db.add(`casas_${userId}`, cantidad)
} else if (itemName === "Mansion") {
    await db.add(`mansiones_${userId}`, cantidad)
} else if (itemName === "Fabrica") {
    await db.add(`fabricas_${userId}`, cantidad)
} else if (itemName === "Gasolineria") {
    await db.add(`gasolinerias_${userId}`, cantidad)
} else if (itemName === "Centro Comercial") {
    await db.add(`centrocomerciales_${userId}`, cantidad)
} else if (itemName === "Banco") {
    await db.add(`bancos_${userId}`, cantidad)
} else if (itemName === "Saboteador") {
  await db.add(`saboteadores_${userId}`, cantidad)
} else if (itemName === "GuardaEspalda") {
  await db.add(`guardaespaldas_${userId}`, cantidad)
} else if (itemName === "impulso1") {
  //crea el impulso y lo guarda en la base de datos
  await db.set(`impulsos_${userId}`, [ { nombre: "Basico", cantidad: "x2", tiempoRestante: (Date.now() + 600000) }]) 
};
    //console.log("Casas " + await db.get(`casas_${userId}`)) 
    
//codigo que responde al usuario cuando su compra es exitosa
    await db.sub(`coins_${userId}`, itemPrice);
    
    await interaction.reply(`Has comprado ${itemName} por \`${nf2.format(itemPrice)}\` monedas. Te quedan ${nf2.format(userCoins - itemPrice)} monedas.`);
  },
};
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require('quick.db');
const db = new QuickDB();

const opt = { style: 'currency', currency: 'USD' };
const nf2 = new Intl.NumberFormat('en-US', opt);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mejoras")
    .setDescription("aqui puedes ver las mejoras que tienes")
    .addStringOption(option => 
      option.setName('inmueble')
        .setDescription('El nombre del inmuble a mejorar')
        .addChoices(
          { name: 'Casa', value: 'Casa' },
          { name: 'Mansion', value: 'Mansion' }, 
        { name: 'Fabrica', value: 'Fabrica' }, 
        { name: 'Gasolineria', value: 'Gasolineria' }, 
        { name: 'Centro Comercial', value: 'Centro Comercial' }, 
        { name: 'Banco', value: 'Banco' })), 

  async execute(interaction) {
    let costo = 0;
   const userId = interaction.user.id;
   const inmueble = interaction.options.getString('inmueble');
    let dinero = await db.get(`coins_${userId}`) || 0;

    let mejora1 = await db.get(`mejoracasa_${userId}`) || 0;
      let mejora2 = await db.get(`mejoramansion_${userId}`) || 0;
      let mejora3 = await db.get(`mejorafabrica_${userId}`) || 0;
      let mejora4 = await db.get(`mejoragasolineria_${userId}`) || 0;
      let mejora5 = await db.get(`mejoracomercial_${userId}`) || 0;
      let mejora6 = await db.get(`mejorabanco_${userId}`) || 0;
    
    const base = [{name: "Casa", value: mejora1 * 0.1}, {name: "Mansion", value: mejora2 * 0.1}, {name: "Fabrica", value: mejora3 * 0.1}, {name: "Gasolineria", value: mejora4 * 0.1}, {name: "Centro Comercial", value: mejora5 * 0.1}, {name: "Banco", value: mejora6 * 0.1}]
    
   //if que establece que accion tomar conforme si hay opcion o no con el comando /mejoras
    if (!inmueble) {
      const embed = new EmbedBuilder()
      .setTitle("Mejoras")
      .setColor("Green");

      base.forEach((item) => {
        embed.addFields({
          name: `${item.name}`,
          value: `x${item.value}`,
          inline: false,
        });
     });
        
      await interaction.reply({ embeds: [embed] });
      
    } else {
      if (inmueble === "Casa") {
        costo = (2000000 * (20 * mejora1) + 2000000)

        if (dinero < costo) {
          return await interaction.reply(`No tienes ${nf2.format(costo)} para mejorar el inmueble Casa`)
        }

        await db.sub(`coins_${userId}`, costo);
        await db.add(`mejoracasa_${userId}`, 1);
        
      } else if (inmueble === "Mansion") {
        costo = (2000000 * (20 * mejora2) + 2000000)

        if (dinero < costo) {
          return await interaction.reply(`No tienes ${nf2.format(costo)} para mejorar el inmueble Mansion`)
        }

        await db.sub(`coins_${userId}`, costo);
        await db.add(`mejoramansion_${userId}`, 1);
        
      } else if (inmueble === "Fabrica") {
        costo = (2000000 * (20 * mejora3) + 2000000)

        if (dinero < costo) {
          return await interaction.reply(`No tienes ${nf2.format(costo)} para mejorar el inmueble Fabrica`)
        }

        await db.sub(`coins_${userId}`, costo);
        await db.add(`mejorafabrica_${userId}`, 1);
        
      } else if (inmueble === "Gasolineria") {
        costo = (2000000 * (20 * mejora4) + 2000000)
        
        if (dinero < costo) {
          return await interaction.reply(`No tienes ${nf2.format(costo)} para mejorar el inmueble Gasolineria`)
        }

        await db.sub(`coins_${userId}`, costo);
        await db.add(`mejoragasolineria_${userId}`, 1);
        
      } else if (inmueble === "Centro Comercial") {
        costo = (2000000 * (20 * mejora5) + 2000000)

        if (dinero < costo) {
          return await interaction.reply(`No tienes ${nf2.format(costo)} para mejorar el inmueble Centro Comercial`)
        }

        await db.sub(`coins_${userId}`, costo);
        await db.add(`mejoracomercial_${userId}`, 1);
        
      } else if (inmueble === "Banco") {
        costo = (2000000 * (20 * mejora6) + 2000000)

        if (dinero < costo) {
          return await interaction.reply(`No tienes ${nf2.format(costo)} para mejorar el inmueble Banco`)
        }

        await db.sub(`coins_${userId}`, costo);
        await db.add(`mejorabanco_${userId}`, 1);
        
      };

      await interaction.reply(`Has mejorado el inmueble ${inmueble} por ${nf2.format(costo)}`)
    };

    
  }, 
};
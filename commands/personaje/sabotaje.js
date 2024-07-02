const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require('quick.db');
const db = new QuickDB();

const opt = { style: 'currency', currency: 'USD' };
const nf2 = new Intl.NumberFormat('en-US', opt);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sabotaje")
    .setDescription("Sabotea a un usuario y robale algo de dinero")
    .addUserOption(option =>
      option.setName('objetivo')
    .setDescription('El usuario al que sabotearas')
    .setRequired(true)), 

  async execute(interaction) {
    const displayname1 = interaction.member.displayName;
    const userId = interaction.user.id;
    const displayname2 =
interaction.options.getUser('objetivo').displayName;
    const objetivo = interaction.options.getUser('objetivo');
    let cooldowndeff = await db.get(`cooldowndeff_${objetivo.id}` || 0);
    
    const Saboteadores = await db.get(`saboteadores_${userId}`) || 0;
    const GuardaEspaldas = await db.get(`guardaespaldas_${objetivo.id}`) || 0
    const dineroganadoj1 = await db.get(`coinsearned_${userId}`) || 0;
    const dineroganadoj2 = await db.get(`coinsearned_${objetivo.id}`) || 0;

    if (dineroganadoj1 < 0 || dineroganadoj2 < 500000) {
      return interaction.reply({
        content: 'Tu y el objetivo necesitan haber ganado mas de 500K de dinero para poder recibir o enviar sabotajes',
        ephemeral: true
      });
    };

    if (!objetivo) {
      return interaction.reply({
        content: 'Usuario no encontrado',
        ephemeral: true
      });
    };
    
    if (Saboteadores <= 0) {
      return interaction.reply({
        content: 'No tienes saboteadores para mandar',
        ephemeral: true
      });
   };

    let restante = (cooldowndeff - Date.now()) / 60000;
    if (Date.now() < cooldowndeff) {
      return interaction.reply({
        content: `Por favor espera ${restante.toFixed(1)} minutos para poder sabotear a este jugador`,
        ephemeral: true});
    }

    if (userId === objetivo.id) {
      return interaction.reply({
        content: 'No puedes sabotarte a ti mismo',
        ephemeral: true
      });
    }
    
    //formula que indica el exito del sabotaje
    let formula = 0.2 * (Saboteadores / (GuardaEspaldas + 1)) 
    let aleatorio = Math.random()

   // console.log(`Formula: ${formula}   Valor Aleatorio: ${aleatorio}`)
    
    //si valor aleatorio <= a formula, el ataque es exitoso
    if (aleatorio <= formula) {
      //Establece el cooldown de sabotaje a 30 minutos
      await db.set(`cooldowndeff_${objetivo.id}`, Date.now() + (30 * 60 * 1000));
      //inicializa variables que calculan las perdidas de ambos bandos
      let vivasoff = Saboteadores - GuardaEspaldas
      let perdidasoff = Saboteadores - vivasoff
      let vivasdeff = GuardaEspaldas - Saboteadores
      let perdidasdeff = GuardaEspaldas - vivasdeff
      
      //segun las perdidas se actualiza la base de datos para el atacante
      if (vivasoff <= 0) {
        await db.set(`saboteadores_${userId}`, 0);
        vivasoff = 0;
        perdidasoff = Saboteadores;
      } else {
        await db.set(`saboteadores_${userId}`, vivasoff);
      }
      
      //segun las perdidas se actualiza la base de datos para el defensor
      if (vivasdeff <= 0) {
        await db.set(`guardaespaldas_${objetivo.id}`, 0);
        vivasdeff = 0;
        perdidasdeff = GuardaEspaldas;
      } else {
        await db.set(`guardaespaldas_${objetivo.id}`, vivasdeff);
      }
      
      //inicializa las variables de dinero de los jugadores
      let dineroj1 = await db.get(`coins_${userId}`) || 0;
      let dineroj2 = await db.get(`coins_${objetivo.id}`) || 0;
      
      //agrega y substrae el dinero a los jugadores    
      if (dineroj2 < (dineroj2 * 0.25)) {
        await db.sub(`coins_${objetivo.id}`, dineroj2)
        await db.add(`coins_${userId}`, dineroj2)
        await db.add(`coinsearned_${userId}`, dineroj2);
      } else {
      await db.sub(`coins_${objetivo.id}`, dineroj2 * 0.25)
        await db.add(`coins_${userId}`, dineroj2 * 0.25)
        await db.add(`coinsearned_${userId}`, dineroj2 * 0.25);
      }

      //crear embed que muestre los resultados del sabotaje

      const embed = new EmbedBuilder()
      .setTitle("Sabotaje Exitoso")
      .setColor("Green")
      .addFields({ name: `Saboteadores vivos: ${displayname1}`, value: `${vivasoff}`, inline: false }, { name: `GuardaEspaldas vivos: ${displayname2}`, value: `${vivasdeff}`, inline: false }, { name: "Dinero Robado", value: `${nf2.format(dineroj2 * 0.25)} :dollar:`, inline: false });

      await interaction.reply({ embeds: [embed] });
      
    } else {

            //inicializa variables que calculan las perdidas de ambos bandos
      let vivasoff = Saboteadores - GuardaEspaldas
      let perdidasoff = Saboteadores - vivasoff
      let vivasdeff = GuardaEspaldas - Saboteadores
      let perdidasdeff = GuardaEspaldas - vivasdeff
      
      //segun las perdidas se actualiza la base de datos para el atacante
      if (vivasoff <= 0) {
        await db.set(`saboteadores_${userId}`, 0);
        perdidasoff = Saboteadores
      } else {
        await db.set(`saboteadores_${userId}`, vivasoff);
      }
      
      //segun las perdidas se actualiza la base de datos para el defensor
      if (vivasdeff <= 0) {
        await db.set(`guardaespaldas_${objetivo.id}`, 0);
        perdidasdeff = GuardaEspaldas
      } else {
        await db.set(`guardaespaldas_${objetivo.id}`, vivasdeff);
      }
      
      const embed = new EmbedBuilder()
      .setTitle("Sabotaje Fallido")
      .setColor("Red")
      .addFields({ name: `Saboteadores vivos: ${displayname1}`, value: `${vivasoff}`, inline: false }, { name: `GuardaEspaldas vivos: ${displayname2}`, value: `${vivasdeff}`, inline: false });
    
      await interaction.reply({ embeds: [embed] });

      
    };

    /*await interaction.reply({
        content: `${objetivo.id}`,
        ephemeral: true
      });*/
  }, 
};
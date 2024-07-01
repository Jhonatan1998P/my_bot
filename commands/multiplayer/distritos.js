const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, EmbedBuilder,
ButtonBuilder, 
ButtonStyle, } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

let PosEmbed = 0;

module.exports = {
  data: new SlashCommandBuilder()
  .setName("distritos")
  .setDescription("Tienes lo que se necesita para controlar un distrito?"),
  async execute(interaction) {
    //debug
    //await db.set(`ocupadoralpha`, "Nadie");
    let OcupadorAlpha = "";
    if (await db.get(`ocupadoralpha`) == "Nadie" || await db.get(`ocupadoralpha`) == null) {
      OcupadorAlpha = "Nadie";
    } else {
      OcupadorAlpha = await interaction.client.users.fetch(await db.get(`ocupadoralpha`))
    }
    

    const ActuBotones = () => {
          const BotonOcupar = new ButtonBuilder()
          .setCustomId('ocupar')
          .setLabel('Ocupar')
      .setStyle(ButtonStyle.Success) 
    .setDisabled(PosEmbed == 0);

    const BotonIzq = new ButtonBuilder()
          .setCustomId('izq')
          .setLabel('<')
      .setStyle(ButtonStyle.Secondary)
    .setDisabled(PosEmbed == 0);

    const BotonDer = new ButtonBuilder()
          .setCustomId('der')
          .setLabel('>')
      .setStyle(ButtonStyle.Secondary)
    .setDisabled(PosEmbed == 1);
    
      return new ActionRowBuilder().addComponents(BotonIzq, BotonOcupar, BotonDer)
    };
    
    const ActuEmbed = () => {
      return new EmbedBuilder()
      .setTitle("Distritos")
    .setDescription("Selecciona el distrito que quieras ocupar")
    .setColor("Red")
    .addFields(
      { name: "Distrito Alpha", value: "Su control otorga 100% mas ganancias en todos los inmuebles", inline: true }, {
        name: "Ocupado por: ", value: `${OcupadorAlpha}`, inline: true
      });
    };

    const embedprincipal= new EmbedBuilder()
    .setTitle("Distritos")
    .setDescription("Los distritos siempre han sido una razon de riñas entre magnates de los negocios, hazte con uno de ellos y disfruta de sus beneficios")
    .setColor("Green")

    const IniciarBotones = ActuBotones() 
    
   await interaction.reply({
      content: 'Empieza a ocupar los distritos y gana recompensas',
      components: [IniciarBotones],
      embeds: [embedprincipal], fetchReply: true});
    
    const filter = i => i.user.id === interaction.user.id

    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 20000 });

    collector.on('collect', async i => {
      if (i.customId === 'izq') {
       if (PosEmbed >= 1) {
         PosEmbed = 0;
         
         await i.update({ content: 'Empieza a ocupar los distritos y gana recompensas', components: [ActuBotones()], embeds: [embedprincipal]});
       };

      } else if (i.customId === 'der') {
        if (PosEmbed == 0) {
          PosEmbed = 1;
         await i.update({ content: 'Empieza a ocupar los distritos y gana recompensas', components: [ActuBotones()], embeds: [ActuEmbed()]});
       };
        
      } else if (i.customId === 'ocupar') {
        if (PosEmbed == 1) {
          if (OcupadorAlpha.username === interaction.user.username) {
           return await i.update({ content: 'Este distrito ya esta ocupado por ti', components: [ ], embeds: [ ]})
          
          } else if (OcupadorAlpha === "Nadie") {
            //guarda el id del nuevo ocupante
            await db.set(`ocupadoralpha`, interaction.user.id);
            //actualiza la variable para mostrar en el embed
            OcupadorAlpha = await interaction.client.users.fetch(await db.get(`ocupadoralpha`)) 
            
            //actualiza el embed
            await i.update({ content: 'Empieza a ocupar los distritos y gana recompensas', components: [ActuBotones()], embeds: [ActuEmbed()]});
          
          } else {
            //crea el id objetivo
            let objetivoId = await db.get(`ocupadoralpha`)
            //saboteadores del atacante
            Saboteadores =  await db.get(`saboteadores_${interaction.user.id}`);
            //guardaespaldas del defensor
            GuardaEspaldas = await db.get(`guardaespaldas_${objetivoId}`)

            //inicializa variables que calculan las perdidas de ambos bandos
      let vivasoff = Saboteadores - GuardaEspaldas
      let perdidasoff = Saboteadores - vivasoff
      let vivasdeff = GuardaEspaldas - Saboteadores
      let perdidasdeff = GuardaEspaldas - vivasdeff

            //segun las perdidas se actualiza la base de datos para el atacante
      if (vivasoff <= 0) {
        await db.set(`saboteadores_${interaction.user.id}`, 0);
        vivasoff = 0;
        perdidasoff = Saboteadores;
      } else {
        await db.set(`saboteadores_${interaction.user.id}`, vivasoff);
      }
            //segun las perdidas se actualiza la base de datos para el defensor
      if (vivasdeff <= 0) {
        await db.set(`guardaespaldas_${objetivoId}`, 0);
        vivasdeff = 0;
        perdidasdeff = GuardaEspaldas;
      } else {
        await db.set(`guardaespaldas_${objetivoId}`, vivasdeff);
     }
            //if para saber el ganador
            if (vivasoff > 0) {
              //nuevo embed
            const embed = new EmbedBuilder()
      .setTitle("Ocupacion Exitosa")
      .setColor("Green")
      .addFields({ name: `Saboteadores vivos: ${interaction.user.username}`, value: `${vivasoff}`, inline: false }, { name: `GuardaEspaldas vivos: ${OcupadorAlpha.username}`, value: `${vivasdeff}`, inline: false });
              
              //guarda el id del nuevo ocupante
            await db.set(`ocupadoralpha`, interaction.user.id);
              PosEmbed = 0;
              
            //actualiza el embed
            return await i.update({ embeds: [embed], components: [] });
              
            } else {
                            //nuevo embed
            const embed = new EmbedBuilder()
      .setTitle("Ocupacion Fallida")
      .setColor("Red")
      .addFields({ name: `Saboteadores vivos: ${interaction.user.username}`, value: `${vivasoff}`, inline: false }, { name: `GuardaEspaldas vivos: ${OcupadorAlpha.username}`, value: `${vivasdeff}`, inline: false });
              PosEmbed = 0;
              
            //actualiza el embed
            return await i.update({ embeds: [embed], components: [] });
            }
            
            

            
          };
          
        }; 
      
      };
      
    });

  }, 
};
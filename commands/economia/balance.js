const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { QuickDB } = require('quick.db');
const db = new QuickDB();

const opt = { style: 'currency', currency: 'USD' };
const nf2 = new Intl.NumberFormat('en-US', opt);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("con esto puedes saber cuanto dinero tienes"),

  async execute(interaction) {
    let usuario = interaction.user
    let dinero = await db.get(`coins_${interaction.user.id}`) || 0;

      const embed = new EmbedBuilder()
        .setTitle(`Balance de ${usuario.username}`)
        .setDescription(`Tienes ${nf2.format(dinero)} :dollar:`)
        .setColor("Blue");

    await interaction.reply({ embeds: [embed] });
  },
};
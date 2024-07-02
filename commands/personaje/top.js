const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const db = new QuickDB();

//const nf2 = new Intl.NumberFormat('en-US');

const opt = { style: 'currency', currency: 'USD' };
const nf2 = new Intl.NumberFormat('en-US', opt);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("top")
    .setDescription("Muestra el top de usuarios con más monedas ganadas"),

  async execute(interaction) {
    const allUsers = await db.all();
    const sortedUsers = allUsers
      .filter(user => user.id.startsWith('coinsearned_') && user.value > 0)
      .map(user => ({
        id: user.id.replace('coinsearned_', ''),
        coins: user.value
      }))
      .sort((a, b) => b.coins - a.coins)
      .slice(0, 10);

    const topList = await Promise.all(sortedUsers.map(async (user, index) => {
      try {
        const userData = await interaction.client.users.fetch(user.id);
        const member = interaction.guild.members.cache.get(user.id);
        const displayName = member ? member.displayName : userData.username;
        return `${index + 1}. ${displayName}: ${nf2.format(user.coins)}`;
      } catch (error) {
        if (error.code === 10013) {
          return `${index + 1}. Usuario desconocido: ${nf2.format(user.coins)} :dollar:`;
        } else {
          throw error;
        }
      }
    }));

    const embed = new EmbedBuilder()
      .setTitle('Top 10 Usuarios con más monedas')
      .setDescription(topList.join('\n') || 'No hay datos disponibles')
      .setColor('Blue');

    await interaction.reply({ embeds: [embed] });
  },
};

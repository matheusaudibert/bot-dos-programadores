const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

/**
 * Lida com o evento de boost do servidor.
 * @param {import('discord.js').GuildMember} member O membro que impulsionou o servidor.
 */
async function handleBoost(member) {
  try {
    const chatChannel = await member.guild.channels.fetch(
      process.env.CHAT_CHANNEL_ID
    );

    if (!chatChannel || !chatChannel.isTextBased()) {
      console.error("Canal de chat não encontrado ou não é um canal de texto.");
      return;
    }

    const embed = new EmbedBuilder()
      .setDescription(`Obrigado(a), ${member}, por impulsionar o servidor.`)
      .setColor(0xfa75f7);

    await chatChannel.send({ embeds: [embed] });
    console.log(
      `Mensagem de agradecimento de boost enviada para ${member.user.tag}.`
    );
  } catch (error) {
    console.error("Erro ao lidar com o evento de boost:", error);
  }
}

module.exports = { handleBoost };

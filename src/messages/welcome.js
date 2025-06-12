const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

/**
 * Lida com o evento de entrada de um novo membro.
 * @param {import('discord.js').GuildMember} member O membro que entrou no servidor.
 */
async function handleWelcome(member) {
  try {
    const chatChannel = await member.guild.channels.fetch(
      process.env.CHAT_CHANNEL_ID
    );

    if (!chatChannel || !chatChannel.isTextBased()) {
      console.error(
        "Canal de chat não encontrado ou não é um canal de texto para boas-vindas."
      );
      return;
    }

    const embed = new EmbedBuilder()
      .setDescription(`Bem-vindo(a), ${member}, ao Servidor dos Programadores.`)
      .setColor(0x738ad8);

    await chatChannel.send({ embeds: [embed] });
    console.log(`Mensagem de boas-vindas enviada para ${member.user.tag}.`);
  } catch (error) {
    console.error("Erro ao lidar com o evento de boas-vindas:", error);
  }
}

module.exports = { handleWelcome };

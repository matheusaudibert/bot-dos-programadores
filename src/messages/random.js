const { EmbedBuilder } = require("discord.js");
require("dotenv").config();

const RANDOM_MESSAGES = [
  {
    text: (channelId) =>
      `Escolha sua cor no servidor no canal <#${channelId}>.`,
    channelIdVar: "COLORS_CHANNEL_ID",
  },
  {
    text: (channelId) => `Adicione suas tecnologias no canal <#${channelId}>.`,
    channelIdVar: "TECHS_CHANNEL_ID",
  },
  // {
  //   text: (channelId) =>
  //     `Confira as vagas de programação no canal <#${channelId}>.`,
  //   channelIdVar: "VACANCY_CHANNEL_ID",
  // },
  {
    text: (channelId) => `Leia a nossa newsletter no canal <#${channelId}>.`,
    channelIdVar: "NEWSLETTERS_CHANNEL_ID",
  },
  {
    text: (channelId) =>
      `Entenda como funciona os cargos do servidor no canal <#${channelId}>.`,
    channelIdVar: "ROLES_CHANNEL_ID",
  },
  {
    text: (channelId) =>
      `Pensou em algo legal para o servidor? Envie no canal <#${channelId}>.`,
    channelIdVar: "SUGESTIONS_CHANNEL_ID",
  },
  {
    text: () =>
      `Precisa de ajuda? Peça ajuda para a comunidade na categoria *Discussões*.`,
    channelIdVar: null, // Não menciona um canal específico diretamente na mensagem
  },
  {
    text: (channelId) =>
      `Quer apoiar o servidor? Faça uma doação no canal <#${channelId}> e receba o cargo <@&${process.env.APOIADOR_ROLE_ID}>.`,
    channelIdVar: "HELP_CHANNEL_ID",
  },
];

async function sendRandomMessage(client) {
  try {
    const chatChannelId = process.env.CHAT_CHANNEL_ID;
    if (!chatChannelId) {
      console.error("CHAT_CHANNEL_ID não está definido no .env");
      return;
    }

    const channel = await client.channels.fetch(chatChannelId);
    if (!channel || !channel.isTextBased()) {
      console.error("Canal de chat não encontrado ou não é um canal de texto.");
      return;
    }

    const messages = await channel.messages.fetch({ limit: 30 });
    const recentEmbedDescriptions = messages
      .filter(
        (msg) => msg.embeds.length > 0 && msg.author.id === client.user.id
      )
      .map((msg) => msg.embeds[0].description);

    const availableMessages = RANDOM_MESSAGES.filter((randomMsgData) => {
      const channelId = randomMsgData.channelIdVar
        ? process.env[randomMsgData.channelIdVar]
        : null;
      const expectedDescription = randomMsgData.text(channelId);
      return !recentEmbedDescriptions.includes(expectedDescription);
    });

    if (availableMessages.length === 0) {
      console.log(
        "Todas as mensagens aleatórias já foram enviadas recentemente. Aguardando próximo ciclo."
      );
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableMessages.length);
    const selectedMessageData = availableMessages[randomIndex];
    const specificChannelId = selectedMessageData.channelIdVar
      ? process.env[selectedMessageData.channelIdVar]
      : null;

    if (selectedMessageData.channelIdVar && !specificChannelId) {
      console.error(
        `ID do canal para ${selectedMessageData.channelIdVar} não encontrado no .env`
      );
      return;
    }

    const description = selectedMessageData.text(specificChannelId);

    const embed = new EmbedBuilder()
      .setDescription(description)
      .setColor(0x111214);

    await channel.send({ embeds: [embed] });
    console.log(`Mensagem aleatória enviada: "${description}"`);
  } catch (error) {
    console.error("Erro ao enviar mensagem aleatória:", error);
  }
}

function startRandomMessageInterval(client) {
  sendRandomMessage(client); // Envia a primeira mensagem imediatamente
  setInterval(() => {
    sendRandomMessage(client);
  }, 3600000 * 2); // 1 hora = 3600000 ms
  console.log("Intervalo de mensagens aleatórias iniciado.");
}

module.exports = { startRandomMessageInterval };

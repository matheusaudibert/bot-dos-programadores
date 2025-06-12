require("dotenv").config();
const { Client, GatewayIntentBits, Events } = require("discord.js");
const { handleTechButtonClick, sendTechEmbed } = require("./src/techs/techs");
const {
  handleColorSelectClick,
  sendColorEmbed,
} = require("./src/colors/colors");
const { handleBoost } = require("./src/messages/booster");
// const { handleWelcome } = require("./src/messages/welcome"); Retirado por enquanto
const { startRandomMessageInterval } = require("./src/messages/random");
// Criar uma nova instância do cliente
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

// Evento disparado quando o bot estiver pronto
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Bot conectado como ${readyClient.user.tag}`);

  try {
    // Obtém o servidor principal do bot (primeiro servidor na lista)
    const guild = readyClient.guilds.cache.first();

    if (!guild) {
      console.error("Não foi possível encontrar nenhum servidor");
      return;
    }

    // Enviar o embed de tecnologias após obter as informações do servidor
    await sendTechEmbed(readyClient);

    // Enviar o embed de cores
    await sendColorEmbed(readyClient);

    // Iniciar o envio de mensagens aleatórias
    // startRandomMessageInterval(readyClient);
  } catch (error) {
    console.error("Erro ao processar informações do servidor:", error);
  }
});

// Manipular interações (botões e select menus)
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton()) {
    await handleTechButtonClick(interaction);
  } else if (interaction.isStringSelectMenu()) {
    await handleColorSelectClick(interaction);
  }
});

// Manipular evento de atualização de membro (para boosts)
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
  // Verifica se o membro começou a impulsionar (premiumSinceTimestamp tornou-se não nulo)
  if (!oldMember.premiumSince && newMember.premiumSince) {
    await handleBoost(newMember);
  }
});

// Manipular evento de entrada de novo membro
// client.on(Events.GuildMemberAdd, async (member) => {
//   await handleWelcome(member);
// }); Retirado por enquanto

// Servidor HTTP para o Render
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot dos Programadores está rodando!");
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Servidor HTTP rodando na porta ${PORT}`);
});

// Fazer login com o token do bot
client
  .login(process.env.BOT_TOKEN)
  .then(() => console.log("Logando..."))
  .catch((error) => {
    console.error("Erro ao fazer login:", error);
  });

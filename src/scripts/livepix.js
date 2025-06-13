const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const { Client, GatewayIntentBits } = require("discord.js");

const {
  BOT_TOKEN,
  GUILD_ID,
  APOIADOR_ROLE_ID,
  CLIENT_ID,
  CLIENT_SECRET,
  CHAT_CHANNEL_ID,
} = process.env;

// Validar token antes de criar o cliente
if (!BOT_TOKEN) {
  console.error("BOT_TOKEN não está definido no arquivo .env");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

async function getAccessToken() {
  if (
    !CLIENT_ID ||
    !CLIENT_SECRET ||
    CLIENT_SECRET === "SEU_CLIENT_SECRET_AQUI"
  ) {
    throw new Error(
      "CLIENT_ID ou CLIENT_SECRET não configurados corretamente no .env"
    );
  }

  const res = await fetch("https://oauth.livepix.gg/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: "messages:read",
    }),
  });

  const data = await res.json();

  if (!data.access_token) {
    console.error("Erro ao obter token:", data);
    throw new Error("Falha ao obter access token da LivePix");
  }

  console.log("Access Token obtido com sucesso");
  return data.access_token;
}

async function buscarMensagensDoacoes() {
  const token = await getAccessToken();
  const res = await fetch("https://api.livepix.gg/v2/messages?limit=3", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  const data = await res.json();
  return data.data || [];
}

async function processarDoacoes() {
  const guild = await client.guilds.fetch(GUILD_ID);
  const chatChannel = await client.channels.fetch(CHAT_CHANNEL_ID);
  const mensagens = await buscarMensagensDoacoes();

  for (const msg of mensagens) {
    if (msg.amount >= 500) {
      const username = msg.username;

      try {
        const members = await guild.members.fetch({
          query: username,
          limit: 10,
        });
        const member = members.find(
          (m) => m.user.username.toLowerCase() === username.toLowerCase()
        );

        if (!member) {
          console.log(`Usuário "${username}" não encontrado no servidor.`);
          continue;
        }

        const temCargo = member.roles.cache.has(APOIADOR_ROLE_ID);
        if (temCargo) {
          console.log(`${username} já tem o cargo de apoiador.`);
        } else {
          await member.roles.add(APOIADOR_ROLE_ID);
          console.log(`Cargo de apoiador adicionado a ${username}.`);

          // Enviar mensagem no chat geral
          if (chatChannel && chatChannel.isTextBased()) {
            await chatChannel.send(
              `Obrigado(a) ${member}, por apoiar o servidor. Você recebeu o cargo <@&${APOIADOR_ROLE_ID}>.`
            );
          }
        }
      } catch (err) {
        console.error(
          `Erro ao procurar ou atribuir cargo para ${username}:`,
          err.message
        );
      }
    }
  }
}

client.once("ready", () => {
  console.log(`Bot conectado como ${client.user.tag}`);
  processarDoacoes()
    .then(() => {
      console.log("Verificação finalizada.");
      client.destroy();
    })
    .catch((error) => {
      console.error("Erro durante a verificação:", error.message);
      client.destroy();
    });
});

client.login(BOT_TOKEN);

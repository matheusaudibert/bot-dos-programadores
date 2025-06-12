const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  GatewayIntentBits,
} = require("discord.js");

// Criar cliente do Discord com as intents necessárias
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// Função para enviar a embed com os botões
async function sendBoostEmbed() {
  try {
    // Obter o canal do ID definido no .env
    const channel = await client.channels.fetch(process.env.BOOST_CHANNEL_ID);

    if (!channel) {
      console.error("Canal não encontrado");
      return;
    }

    // Obter a guild (servidor) a partir do canal
    const guild = channel.guild;
    const guildName = guild.name;
    const guildIconURL = guild.iconURL({ dynamic: true }) || null;

    // Criar a embed
    const embed = new EmbedBuilder()
      .setTitle("Impulsione o servidor")
      .setDescription(
        "Ao impulsionar o **Servidor dos Programadores**, você não só fortalece a comunidade como também desbloqueia **benefícios exclusivos**:\n\n- Cargo exclusivo de <@&1115446339661221980>.\n- Insígnia no seu perfil do Discord que evolui com o tempo <a:BoostEvolution:1381421179872612443>.\n- Ícone de Booster ao lado do seu nome aqui no servidor <:BoostSide:1381422381444108409>.\n\n-# Seu apoio faz toda a diferença."
      )
      .setImage("https://i.dfr.gg/banniere-discord-server-boosting.png")
      .setColor(0xfa75f7)
      .setFooter({ text: guildName, iconURL: guildIconURL });

    await channel.send({
      embeds: [embed],
    });

    console.log("Embed de Boost enviada com sucesso!");

    client.destroy();
  } catch (error) {
    console.error("Erro ao enviar embed de Boost:", error);
    client.destroy();
  }
}

// Login e envio da embed quando o cliente estiver pronto
client.once("ready", async () => {
  console.log(`Bot conectado como ${client.user.tag}`);
  await sendBoostEmbed();
});

// Login com o token do bot
client
  .login(process.env.BOT_TOKEN)
  .then(() => console.log("Conectando para enviar embed de Boost..."))
  .catch((error) => {
    console.error("Erro ao fazer login:", error);
    process.exit(1);
  });

// Para executar este arquivo diretamente
if (require.main === module) {
  console.log("Iniciando envio da embed de Boost...");
}

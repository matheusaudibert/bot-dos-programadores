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

async function sendWelcomeEmbed() {
  try {
    // Obter o canal do ID definido no .env
    const channel = await client.channels.fetch(
      process.env.HELLO_WORLD_CHANNEL_ID
    );

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
      .setTitle("Bem-vindo(a) ao Servidor dos Programadores")
      .setDescription(
        "Você está em uma comunidade feita para quem **ama programação e tecnologia**. Aqui, o foco é **compartilhar conhecimento**, **trocar experiências**, **interagir com outras pessoas da área** e **crescer juntos**.\n\nSeja você **iniciante** ou **experiente**, este é um espaço aberto para **aprender**, **ensinar**, **tirar dúvidas**, **colaborar em projetos**, **participar de eventos** e **fazer conexões reais com outros desenvolvedores**.\n\nNosso objetivo é criar um ambiente respeitoso, organizado e inspirador, onde todos se sintam à vontade para contribuir.\n\nApresente-se, explore os canais e aproveite tudo o que essa comunidade pode oferecer. Estamos felizes por ter você aqui."
      )
      .setImage(
        "https://cdn.prod.website-files.com/5f9072399b2640f14d6a2bf4/64777c94f5f4e1d038525b68_TimesSquare_Blog_1800x720.png"
      )
      .setColor(0x4c4aa4)
      .setFooter({ text: guildName, iconURL: guildIconURL });

    await channel.send({
      embeds: [embed],
    });

    console.log("Embed de Hello World enviada com sucesso!");

    client.destroy();
  } catch (error) {
    console.error("Erro ao enviar embed de Hello World:", error);
    client.destroy();
  }
}

// Login e envio da embed quando o cliente estiver pronto
client.once("ready", async () => {
  console.log(`Bot conectado como ${client.user.tag}`);
  await sendWelcomeEmbed();
});

// Login com o token do bot
client
  .login(process.env.BOT_TOKEN)
  .then(() => console.log("Conectando para enviar embed de Hello World..."))
  .catch((error) => {
    console.error("Erro ao fazer login:", error);
    process.exit(1);
  });

// Para executar este arquivo diretamente
if (require.main === module) {
  console.log("Iniciando envio da embed de Hello World...");
}
